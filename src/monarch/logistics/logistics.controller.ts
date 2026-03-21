import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { LogisticsService } from './logistics.service';

@Controller('monarch/logistics')
export class LogisticsController {
    constructor(private readonly logisticsService: LogisticsService) { }

    @Get('quotas/:projectId')
    async getQuota(@Param('projectId') projectId: string) {
        return this.logisticsService.getQuota(projectId);
    }

    @Put('quotas/:projectId')
    async updateQuota(@Param('projectId') projectId: string, @Body() body: any) {
        return this.logisticsService.updateQuota(projectId, body);
    }

    @Post('usage/broadcast')
    async triggerBroadcast() {
        await this.logisticsService.broadcastLiveUsage();
        return { status: 'broadcasted' };
    }
}
