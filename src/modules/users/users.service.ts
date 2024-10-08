import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import StripeService from '../stripe/stripe.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private stripeService: StripeService,
  ) {}

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email, deleted_at: null } });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
 
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );
 
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async create(userData: CreateUserDto) {
    const stripeCustomer = await this.stripeService.createCustomer(userData.name, userData.email);
 
    const newUser = this.usersRepository.create({
      ...userData,
      stripeCustomerId: stripeCustomer.id
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateMonthlySubscriptionStatus(
    stripeCustomerId: string, monthlySubscriptionStatus: string
  ) {
    return this.usersRepository.update(
      { stripeCustomerId },
      { monthlySubscriptionStatus }
    );
  }
}
