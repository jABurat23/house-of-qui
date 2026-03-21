import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth/ritual')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('request')
  async requestAudience(
    @Body('imperialName') name: string,
    @Body('houseKey') key: string
  ) {
    return this.authService.requestAudience(name, key);
  }

  @Post('complete')
  async completeRitual(
    @Body('ritualId') ritualId: string,
    @Body('phrase') phrase: string,
    @Req() req: Request
  ) {
    const meta = {
      ip: req.ip || '0.0.0.0',
      userAgent: req.headers['user-agent'] || 'unknown'
    };
    return this.authService.completeRitual(ritualId, phrase, meta);
  }
  
  @Post('grant-throne')
  async grantThrone(
    @Body('name') name: string,
    @Body('key') key: string
  ) {
      // This is a one-time ceremonial setup to establish the first Monarch
      return this.authService.grantThrone(name, key);
  }
}
