import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../shared/type-orm';
import { UserDTO } from './dto/user.dto';
import { FindReqBody } from '../shared/interface';
import { Result, success } from '../shared/result';

@Injectable()
export class UserService extends BaseService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
    ) {
        super();
    }

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (page - 1) * size;

        const where = {
            is_deleted: false,
        };

        const findManyOptions: FindManyOptions<UserEntity> = {
            where,
            take: size,
            skip,
            select: ['id', 'full_name', 'age', 'email'],
            order: { created_date: 'DESC' },
        };

        const [result, total] =
            await this.UserRepository.findAndCount(findManyOptions);

        const totalPage = Math.ceil(total / size);

        return success.ok({
            page,
            size,
            total,
            totalPage,
            result,
        });
    }

    async create(dto: UserEntity | Partial<UserEntity>): Promise<Result> {
        throw new Error('Method not implemented.');
    }

    async update(dto: UserEntity | Partial<UserEntity>): Promise<Result> {
        throw new Error('Method not implemented.');
    }

    async deleted(dto: UserEntity | Partial<UserEntity>): Promise<Result> {
        throw new Error('Method not implemented.');
    }
}
