import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertChannel } from './entities/channel.entity';
import { WatchtowerService } from './watchtower.service';
import { WatchtowerController } from './watchtower.controller';
import { AuditModule } from '../audit/audit.module';
import { MonarchModule } from '../../monarch/monarch.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AlertChannel]),
    AuditModule,
    MonarchModule
  ],
  providers: [WatchtowerService],
  controllers: [WatchtowerController],
  exports: [WatchtowerService]
})
export class WatchtowerModule {}
