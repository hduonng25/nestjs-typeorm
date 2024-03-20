import { HttpException, Injectable } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostDto } from './dto/post.dto';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.body.dto';
import { CategoryService } from '../category/category.service';
import { FindReqBody } from '../../shared/interface';
import { BaseService } from '../../shared/type-orm';
import { error, Result, success } from '../../shared/result';
import { HttpsStatus } from '../../common/constant';

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
            where: [
                {
                    // content: Like('%' + params.query + '%'),
                },
            ],

            take: params.size,

            skip,

            relations: {
                user: true,
                category: true,
            },
            select: {
                id: true,
                thumbnail: true,
                content: true,
                created_date: true,
                user: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar: true,
                    password: false,
                },
                category: {
                    id: true,
                    name: true,
                },
            },
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

    async getByID(id: string) {
        const result = await this.PostRepository.findOne({
            where: { id: id },
            relations: {
                user: true,
                category: true,
            },
            select: {
                id: true,
                thumbnail: true,
                content: true,
                created_date: true,
                user: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar: true,
                    password: false,
                },
                category: {
                    id: true,
                    name: true,
                },
            },
        });

        return result;
    }

    async getByUser(id: string) {
        const user = await this.UserService.findOne(id);
        if (user) {
            const findManyOptions: FindManyOptions<PostEntity> = {
                relations: {
                    user: true,
                },
                select: {
                    id: true,
                    content: true,
                    thumbnail: true,
                    created_date: true,
                    user: {
                        id: true,
                        email: true,
                        full_name: true,
                        avatar: true,
                    },
                },
                order: { created_date: 'DESC' },
            };

            const result = await this.PostRepository.find(findManyOptions);
            return success.ok(result);
        }
    }

    async create(params: {
        dto: CreatePostDTO;
        is_user: string;
        thumbnail: string;
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
                thumbnail: params.thumbnail,
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
                relations: { user: true },
            });

            if (user.roles !== 'ADMIN' || user.id !== post.user.id) {
                throw new HttpException(
                    'You do not have permission to delete this post',
                    HttpsStatus.BAD_REQUEST,
                );
            } else {
                await this.PostRepository.softDelete(id);
                return success.ok({ mess: 'Delete successfuly' });
            }
        }
    }

    async update(params: {
        dto: UpdatePostDTO;
        user: string;
        thumbnail?: string;
    }): Promise<Result> {
        const user = await this.UserService.findOne(params.user);
        const category = await this.CategoryService.findOne(
            params.dto.category_id,
        );

        const post = await this.PostRepository.findOne({
            where: { id: params.dto.id },
            relations: {
                user: true,
            },
        });
        if (user.id !== post.user.id) {
            return error.commonError({
                location: 'user',
                param: 'authen',
                message: 'You do not have permission to edit this post',
            });
        } else {
            const update = {
                content: params.dto.content,
                category: category,
                thumbnail: params.thumbnail,
            };

            await this.PostRepository.update(post.id, update);
            const result = plainToInstance(PostDto, post, {
                excludeExtraneousValues: true,
            });
            return success.ok({ mess: 'Update successfuly', ...result });
        }
    }

    async getByCategory(id: string): Promise<PostEntity[]> {
        try {
            let result = await this.PostRepository.find({
                where: { category: { id: id } },
            });
            return result;
        } catch (e) {
            throw e;
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
}
