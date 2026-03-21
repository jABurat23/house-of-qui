import { Module } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { RecoveryController } from './recovery.controller';
import { MonarchModule } from '../monarch.module';
import { ArchiveModule } from '../archive/archive.module';

@Module({
    imports: [ArchiveModule, MonarchModule],
    providers: [RecoveryService],
    controllers: [RecoveryController],
    exports: [RecoveryService]
})
export class RecoveryModule { }
