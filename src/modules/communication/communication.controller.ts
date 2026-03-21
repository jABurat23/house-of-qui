import { Controller, Post, Get, Body, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Controller('communication')
export class CommunicationController {
    constructor(private readonly commsService: CommunicationService) { }

    @Post('emit')
    async emitEvent(
        @Body() body: { type: string; payload: any; targetId?: string },
        @Headers('x-project-id') projectId: string
    ) {
        if (!projectId) throw new UnauthorizedException('Project identification required');

        return this.commsService.emitEvent(
            projectId,
            body.type,
            body.payload,
            body.targetId
        );
    }

    @Get('bus')
    async getBusHistory(@Query('limit') limit?: number) {
        return this.commsService.getRecentEvents(limit);
    }
}
