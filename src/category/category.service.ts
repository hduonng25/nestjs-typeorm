import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseService } from '../shared/type-orm';
import { FindReqBody } from '../shared/interface';
import { error, Result, success } from '../shared/result';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.body.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryDTO } from './dto/category.dto';
import { HttpsStatus } from '../common/constant';

@Injectable()
export class CategoryService implements BaseService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly CategoryRepository: Repository<CategoryEntity>,
    ) {}

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (params.page - 1) * params.size;

        const findManyOptions: FindManyOptions<CategoryEntity> = {
            take: params.size,
            skip,
            select: ['id', 'name'],
            order: { created_date: 'DESC' },
        };

        const [result, total] =
            await this.CategoryRepository.findAndCount(findManyOptions);

        const totalPage = Math.ceil(total / params.size);

        return success.ok({
            page,
            size,
            total,
            totalPage,
            result,
        });
    }

    async create(params: CreateCategoryDTO): Promise<Result> {
        try {
            await this.CategoryRepository.insert(params);
            const result = plainToInstance(CategoryDTO, params, {
                excludeExtraneousValues: true,
            });
            return success.ok(result);
        } catch (e) {
            throw new HttpException(
                'INVALID_SERVER',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async deleted(params: { ids: string[] }): Promise<Result> {
        for (let id of params.ids) {
            await this.CategoryRepository.softDelete(id);
        }
        return success.ok({ mess: 'deleted successfuly' });
    }

    async update(params: UpdateCategoryDTO): Promise<Result> {
        const check = await this.CategoryRepository.findOne({
            where: { id: params.id },
        });
        if (check) {
            await this.CategoryRepository.update(params.id, params);
            return success.ok({ mess: 'Update successfuly' });
        } else {
            return error.commonError({
                location: 'category',
                param: 'id',
                message: 'category not found',
            });
        }
    }

    async findOne(id: string): Promise<CategoryEntity> {
        const category = await this.CategoryRepository.findOne({
            where: { id: id },
        });
        if (category) {
            return category;
        } else {
            throw new HttpException(
                'Category not found',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }
}
