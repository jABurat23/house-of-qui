import { Controller, Get, Post, Param, Headers } from '@nestjs/common';
import { ScribeService } from './scribe.service';

@Controller('monarch/scribe')
export class ScribeController {
  constructor(private readonly scribeService: ScribeService) {}

  @Post('chronicle/:projectId')
  async generate(@Param('projectId') projectId: string, @Headers('x-imperial-role') role: string = 'OPERATOR') {
    return this.scribeService.generateChronicle(projectId, role);
  }

  @Get('chronicle/:projectId')
  async get(@Param('projectId') projectId: string) {
    return this.scribeService.getChronicle(projectId);
  }

  @Get('chronicles')
  async getAll() {
    return this.scribeService.getAllChronicles();
  }
}
