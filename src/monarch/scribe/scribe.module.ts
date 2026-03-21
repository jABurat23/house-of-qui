import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectChronicle } from './entities/chronicle.entity';
import { Project } from '../entities/project.entity';
import { ScribeService } from './scribe.service';
import { ScribeController } from './scribe.controller';
import { CartographerModule } from '../cartographer/cartographer.module';
import { AuditModule } from '../../system/audit/audit.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectChronicle, Project]),
    CartographerModule,
    AuditModule
  ],
  providers: [ScribeService],
  controllers: [ScribeController],
  exports: [ScribeService]
})
export class ScribeModule {}
