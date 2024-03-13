import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/type-orm';
import { BlogEntity } from './entity/blog.entity';
import { FindReqBody } from '../shared/interface';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, success, error } from '../shared/result';
import { BlogDTO } from './dto/blog.dto';
import { HttpsStatus } from '../common/constant';
import { UserService } from '../user/user.service';
import { UpdateBlogDTO } from './dto/blog.body.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BlogService extends BaseService {
    constructor(
        @InjectRepository(BlogEntity)
        protected readonly BlogRepository: Repository<BlogEntity>,
        private readonly UserService: UserService,
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
            select: ['id', 'avatar', 'content', 'user', 'created_date'],
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

    async create(params: BlogDTO): Promise<Result> {
        try {
            await this.BlogRepository.insert(params);
            const result = plainToInstance(BlogDTO, params, {
                excludeExtraneousValues: true,
            });

            return success.ok(result);
        }
        catch (e) {
            throw new HttpException(
                'Invalid server',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async deleted(params: { ids: string[]; user_id: string }): Promise<Result> {
        const user = await this.UserService.findOne(params.user_id);

        for (let id of params.ids) {
            const blog = await this.BlogRepository.findOne({
                where: { id: id },
                relations: ['user'],
            });

            if (!user.roles.some(role => role.includes('ADMIN')) && user.id !== blog.id) {
                return error.commonError({
                    location: 'user',
                    param: 'authen',
                    message: 'You do not have permission to delete this post',
                });
            }
            else {
                await this.BlogRepository.softDelete(id);
            }
        }

        return success.ok({ mess: 'Delete blog successfuly' });

    }

    async update(params: {
        dto: UpdateBlogDTO;
        user: string;
    }): Promise<Result> {
        const user = await this.UserService.findOne(params.user);
        const blog = await this.BlogRepository.findOne({
            where: { id: params.dto.id },
        });
        if (user.id !== blog.user.id) {
            return error.commonError({
                location: 'user',
                param: 'authen',
                message: 'You do not have permission to edit this post',
            });
        }
        else {
            await this.BlogRepository.update(blog.id, params.dto);
            const result = plainToInstance(BlogDTO, blog, {
                excludeExtraneousValues: true,
            });
            return success.ok({ mess: 'Update successfuly', ...result });
        }
    }
}
