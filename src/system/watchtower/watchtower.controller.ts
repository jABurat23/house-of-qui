import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { WatchtowerService } from './watchtower.service';

@Controller('system/watchtower')
export class WatchtowerController {
  constructor(private readonly watchtowerService: WatchtowerService) {}

  @Get('channels')
  async getChannels() {
    return this.watchtowerService.getChannels();
  }

  @Post('channels')
  async createChannel(@Body() body: any) {
    return this.watchtowerService.createChannel(body);
  }
}
