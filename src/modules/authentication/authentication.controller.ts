import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import RequestWithUser from './interface/requestUser.interface';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import { Response } from 'express';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
 
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService
  ) {}
 
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }
 
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const {user} = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const refreshTokenCookie = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
 
    await this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);
 
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
 
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}