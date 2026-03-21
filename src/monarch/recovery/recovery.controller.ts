import { Controller, Post, Param, Body } from '@nestjs/common';
import { RecoveryService } from './recovery.service';

@Controller('monarch/recovery')
export class RecoveryController {
    constructor(private readonly recoveryService: RecoveryService) { }

    @Post(':projectId/trigger')
    async triggerRecovery(@Param('projectId') projectId: string, @Body() body: { reason: string }) {
        return this.recoveryService.autoRecover(projectId, body.reason || 'Manual trigger');
    }
}
