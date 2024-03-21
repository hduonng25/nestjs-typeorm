import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.body.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryDTO } from './dto/category.dto';
import { HttpsStatus } from '@Common/index';
import { BaseService } from '@Shared/type-orm';
import { FindReqBody } from '@Shared/interface';
import { Result, success } from '@Shared/result';
import { CheckCategory } from './check/check.category';

@Injectable()
export class CategoryService implements BaseService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly CategoryRepository: Repository<CategoryEntity>,

        private readonly checkcategory: CheckCategory,
    ) {}

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page ?? 1
        const size = params.size ?? 10
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
        const check = await this.CategoryRepository.findOne({
            where: { name: params.name },
        });

        if (check) {
            throw new HttpException(
                'Name category is readly exits',
                HttpsStatus.BAD_REQUEST,
            );
        } else {
            try {
                const check = await this.CategoryRepository.insert(params);
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
    }

    async deleted(params: { ids: string[] }): Promise<Result> {
        for (let id of params.ids) {
            await this.CategoryRepository.softDelete(id);
        }
        return success.ok({ mess: 'deleted successfuly' });
    }

    async update(params: UpdateCategoryDTO): Promise<Result> {
        await this.checkcategory.checkDuplicateName({
            id: params.id,
            name: params.name,
        });
        await this.CategoryRepository.update(params.id, params);
        return success.ok({ mess: 'Update successfuly' });
    }

    async findOne(id: string): Promise<CategoryEntity> {
        const category = await this.CategoryRepository.findOne({
            where: { id: id },
        });
        return category;
    }
}
