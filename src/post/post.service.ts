import { HttpException, Injectable } from '@nestjs/common';
import { BaseService } from '../shared/type-orm';
import { PostEntity } from './entity/post.entity';
import { FindReqBody } from '../shared/interface';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, success, error } from '../shared/result';
import { PostDto } from './dto/post.dto';
import { HttpsStatus } from '../common/constant';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.body.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class PostService extends BaseService {
    constructor(
        @InjectRepository(PostEntity)
        protected readonly PostRepository: Repository<PostEntity>,
        private readonly UserService: UserService,
        private readonly CategoryService: CategoryService,
    ) {
        super();
    }

    async getAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (params.page - 1) * params.size;

        const findManyOptions: FindManyOptions<PostEntity> = {
            take: params.size,
            skip,
            select: ['id', 'avatar', 'content', 'user', 'created_date', 'user'],
            order: { created_date: 'DESC' },
        };

        const [result, total] =
            await this.PostRepository.findAndCount(findManyOptions);

        const totalPage = Math.ceil(total / params.size);

        return success.ok({
            page,
            size,
            total,
            totalPage,
            result,
        });
    }

    async getByUser(id: string) {
        const user = await this.UserService.findOne(id);
        if (user) {
            const findManyOptions: FindManyOptions<PostEntity> = {
                select: [
                    'id',
                    'avatar',
                    'content',
                    'user',
                    'created_date',
                    'user',
                ],
                order: { created_date: 'DESC' },
            };

            const result = await this.PostRepository.find(findManyOptions);
            return success.ok(result);
        }
    }

    async create(params: {
        dto: CreatePostDTO;
        is_user: string;
    }): Promise<Result> {
        try {
            const category = await this.CategoryService.findOne(
                params.dto.category_id,
            );
            const user = await this.UserService.findOne(params.is_user);
            const create = {
                user,
                category,
                ...params.dto,
            };

            await this.PostRepository.insert(create);
            const result = plainToInstance(PostDto, params.dto, {
                excludeExtraneousValues: true,
            });

            return success.ok(result);
        } catch (e) {
            throw new HttpException(
                'Invalid server',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async deleted(params: { ids: string[]; user_id: string }): Promise<Result> {
        const user = await this.UserService.findOne(params.user_id);

        for (let id of params.ids) {
            const post = await this.PostRepository.findOne({
                where: { id: id },
                relations: ['user'],
            });

            if (
                !user.roles.some((role) => role.includes('ADMIN')) ||
                user.id !== post.id
            ) {
                return error.commonError({
                    location: 'user',
                    param: 'authen',
                    message: 'You do not have permission to delete this post',
                });
            } else {
                await this.PostRepository.softDelete(id);
            }
        }

        return success.ok({ mess: 'Delete successfuly' });
    }

    async update(params: {
        dto: UpdatePostDTO;
        user: string;
    }): Promise<Result> {
        const user = await this.UserService.findOne(params.user);
        const post = await this.PostRepository.findOne({
            where: { id: params.dto.id },
        });
        if (user.id !== post.user.id) {
            return error.commonError({
                location: 'user',
                param: 'authen',
                message: 'You do not have permission to edit this post',
            });
        } else {
            await this.PostRepository.update(post.id, params.dto);
            const result = plainToInstance(PostDto, post, {
                excludeExtraneousValues: true,
            });
            return success.ok({ mess: 'Update successfuly', ...result });
        }
    }

    //External
    async findOne(id: string): Promise<PostEntity> {
        const post = await this.PostRepository.findOne({
            where: { id: id },
        });

        if (post) {
            return post;
        } else {
            throw new HttpException(
                'Post not found',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async getAtHome() {
        const posts = await this.PostRepository.find({
            order: { created_date: 'DESC' },
            relations: ['user', 'category'],
        });

        return posts;
    }
}
