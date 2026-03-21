import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SystemConfigService } from './config.service';

@Controller('system/config')
export class SystemConfigController {
    constructor(private readonly configService: SystemConfigService) { }

    @Get()
    async getAll() {
        return this.configService.getAll();
    }

    @Get(':key')
    async get(@Param('key') key: string) {
        return this.configService.get(key);
    }

    @Post()
    async set(@Body() body: { key: string; value: any; category?: string; description?: string }) {
        return this.configService.set(body.key, body.value, body.category, body.description);
    }
}
