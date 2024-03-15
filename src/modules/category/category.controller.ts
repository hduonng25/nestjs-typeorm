import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.body.dto';
import { FindReqBody } from '../../shared/interface';

@Controller('category')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) {}

    @Get()
    async findAll(@Query() parmas: FindReqBody) {
        return this.CategoryService.findAll(parmas);
    }

    @Post()
    async create(@Body() body: CreateCategoryDTO) {
        return this.CategoryService.create(body);
    }

    @Put()
    async update(@Body() body: UpdateCategoryDTO) {
        return this.CategoryService.update(body);
    }

    @Delete()
    async deleted(@Body('ids') ids: string[]) {
        return this.CategoryService.deleted({ ids });
    }
}
