import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';

@Controller('packages')
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) { }

    @Get()
    async listPackages(@Query('q') query?: string) {
        return this.packagesService.findAll(query);
    }

    @Get(':namespace/:name')
    async getPackage(@Param('namespace') namespace: string, @Param('name') name: string) {
        return this.packagesService.findOne(namespace, name);
    }

    @Post('install')
    async installPackage(
        @Body() body: { projectId: string; namespace: string; name: string; version?: string }
    ) {
        return this.packagesService.install(
            body.projectId,
            body.namespace,
            body.name,
            body.version || 'latest'
        );
    }

    @Get('project/:projectId')
    async getProjectPackages(@Param('projectId') projectId: string) {
        return this.packagesService.getProjectPackages(projectId);
    }
}
