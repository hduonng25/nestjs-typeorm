import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class CheckCategory {
    constructor(
        @InjectRepository(CategoryEntity)
        protected readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

    async checkDuplicateName(params: { id?: string; name: string }) {
        const filter = {
            where: {
                name: ILike(`%${params.name}%`),
            },
        };

        const category = await this.categoryRepository.findOne(filter);

        if (category && category.id !== params.id) {
            throw new HttpException(
                'Category name already exists',
                HttpStatus.BAD_REQUEST,
            );
        }
        return;
    }
}
