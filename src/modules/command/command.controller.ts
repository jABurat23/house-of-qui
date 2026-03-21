import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandService } from './command.service';

@Controller('monarch/command')
export class CommandController {
  constructor(private readonly commandService: CommandService) {}

  @Post('remote/:projectId')
  async executeCommand(
    @Param('projectId') projectId: string,
    @Body() body: { command: string; args?: any }
  ) {
    return this.commandService.executeRemoteCommand(projectId, body.command, body.args || {});
  }

  @Get('history')
  async getHistory() {
    return this.commandService.getCommandHistory();
  }

  @Get('history/:projectId')
  async getProjectHistory(@Param('projectId') projectId: string) {
    return this.commandService.getCommandHistory(projectId);
  }

  @Get(':id')
  async getCommand(@Param('id') id: string) {
    return this.commandService.getCommandById(id);
  }
}
