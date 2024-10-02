import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import StripeService from '../stripe/stripe.service';
import RequestWithUser from '../authentication/interface/requestUser.interface';
import CreateChargeDto from './dto/create-charge.dto';
import SubscriptionsService from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Post('charge')
  @UseGuards(JwtAuthenticationGuard)
  async createCharge(
    @Body() charge: CreateChargeDto,
    @Req() request: RequestWithUser,
  ) {
    return this.stripeService.charge(
      charge.amount,
      charge.paymentMethodId,
      request.user.stripeCustomerId,
    );
  }

  @Post('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async createMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.createMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }

  @Get('monthly')
  @UseGuards(JwtAuthenticationGuard)
  async getMonthlySubscription(@Req() request: RequestWithUser) {
    return this.subscriptionsService.getMonthlySubscription(
      request.user.stripeCustomerId,
    );
  }
}
