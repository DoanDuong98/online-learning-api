import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersService } from './modules/users/users.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CreditCardController } from './modules/credit-card/credit-card.controller';
import * as Joi from 'joi';
import { StripeWebhookController } from './modules/stripe/webhook/stripe-webhook.controller';
import StripeWebhookService from './modules/stripe/webhook/stripe-webhook.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision','staging').default('development'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        FRONTEND_URL: Joi.string(),
        MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string(),
        STRIPE_WEBHOOK_SECRET: Joi.string(),
      }),
      validationOptions: {
        abortEarly: false,
      },
    }),
    SubscriptionsModule,
    UsersModule,
    DatabaseModule,
    AuthenticationModule,
  ],
  controllers: [AppController, CreditCardController, StripeWebhookController],
  providers: [AppService, UsersService, StripeWebhookService],
})
export class AppModule {}
