import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectArtifact } from '../entities/artifact.entity';
import { ArchiveService } from './archive.service';
import { ArchiveController } from './archive.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectArtifact])],
    providers: [ArchiveService],
    controllers: [ArchiveController],
    exports: [ArchiveService]
})
export class ArchiveModule { }
