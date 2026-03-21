import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackageInstallation } from './entities/packageInstallation.entity';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Package, PackageInstallation])],
    providers: [PackagesService],
    controllers: [PackagesController],
    exports: [PackagesService],
})
export class PackagesModule { }
