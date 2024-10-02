
import { AuthenticationService } from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from 'src/entities/user.entity';
import { UsersService } from '../../users/users.service';
import mockedJwtService from 'src/utils/mocks/jwt.service';
import mockedConfigService from 'src/utils/mocks/config.service';
 
describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ],
    })
      .compile();
    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  })
  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get the user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
      await authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword');
      expect(getByEmailSpy).toBeCalledTimes(1);
    })
  })
});
