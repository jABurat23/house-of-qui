import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImperialCommand } from './entities/command.entity';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { CommunicationModule } from '../communication/communication.module';
import { AuditModule } from '../../system/audit/audit.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ImperialCommand]),
    CommunicationModule,
    AuditModule
  ],
  providers: [CommandService],
  controllers: [CommandController],
  exports: [CommandService]
})
export class CommandModule {}
