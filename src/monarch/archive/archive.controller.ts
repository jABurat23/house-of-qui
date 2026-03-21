import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchiveService } from './archive.service';

@Controller('monarch/archive')
export class ArchiveController {
    constructor(private readonly archiveService: ArchiveService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadArtifact(
        @UploadedFile() file: any,
        @Body() body: { projectId: string; version: string }
    ) {
        return this.archiveService.createArtifact(
            body.projectId,
            body.version,
            file.originalname,
            file.buffer
        );
    }

    @Get('project/:projectId')
    async getProjectArtifacts(@Param('projectId') projectId: string) {
        return this.archiveService.getArtifactsByProject(projectId);
    }

    @Get(':id')
    async getArtifact(@Param('id') id: string) {
        return this.archiveService.getArtifact(id);
    }
}
