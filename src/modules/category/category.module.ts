import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { CheckCategory } from './check/check.category';

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    providers: [CategoryService, CheckCategory],
    controllers: [CategoryController],
    exports: [CategoryService],
})
export class CategoryModule {}
