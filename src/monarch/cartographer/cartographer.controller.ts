import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { CartographerService } from './cartographer.service';

@Controller('monarch/cartographer')
export class CartographerController {
  constructor(private readonly cartographerService: CartographerService) {}

  @Get('graph')
  async getGraph(@Headers('x-imperial-role') role: string = 'OPERATOR') {
    return this.cartographerService.getUniverseGraph(role);
  }

  @Get('code/:projectId')
  async getCodeGraph(
    @Param('projectId') projectId: string,
    @Headers('x-imperial-role') role: string = 'OPERATOR'
  ) {
    return this.cartographerService.getProjectCodeGraph(projectId, role);
  }

  @Get('file')
  async getFile(@Query('path') path: string) {
    return this.cartographerService.getFileContent(path);
  }
}
