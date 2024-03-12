import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/type-orm';
import { BlogEntity } from './entity/blog.entity';
import { FindReqBody } from '../shared/interface';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, success } from '../shared/result';
import { BlogDTO } from './dto/blog.dto';
import { HttpsStatus } from '../common/constant';

@Injectable()
export class BlogService extends BaseService {
    constructor(
        @InjectRepository(BlogEntity)
        protected readonly BlogRepository: Repository<BlogEntity>,
    ) {
        super();
    }

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (params.page - 1) * params.size;

        const findManyOptions: FindManyOptions<BlogEntity> = {
            take: params.size,
            skip,
            select: ['id', 'avatar', 'content', 'user'],
            order: { created_date: 'DESC' },
        };

        const [result, total] =
            await this.BlogRepository.findAndCount(findManyOptions);

        const totalPage = Math.ceil(total / params.size);

        return success.ok({
            page,
            size,
            total,
            totalPage,
            result,
        });
    }

    async create(params: Partial<BlogDTO>): Promise<Result> {
        try {
            const blog = await this.BlogRepository.insert(params);
            return success.ok(blog);
        } catch (e) {
            throw new HttpException(
                'Invalid server',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async deleted(params: Partial<BlogEntity> | BlogDTO): Promise<Result> {
        return Promise.resolve(undefined);
    }

    async update(params: Partial<BlogEntity> | BlogEntity): Promise<Result> {
        return Promise.resolve(undefined);
    }
}
