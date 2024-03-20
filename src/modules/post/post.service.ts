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
            where: [{}],

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
            const { dto, is_user, thumbnail } = params;

            const [category, user] = await Promise.all([
                this.CategoryService.findOne(dto.category_id),
                this.UserService.findOne(is_user),
            ]);

            const create = {
                user,
                ...(category ? { category } : {}),
                ...dto,
                thumbnail,
            } as Partial<PostEntity>;

            const result = await this.PostRepository.insert(create);
            const postDto = plainToInstance(PostDto, result, {
                excludeExtraneousValues: true,
            });
            return success.ok(postDto);
        } catch (e) {
            throw new HttpException(
                'Internal Server Error',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async deleted(params: { ids: string[]; user_id: string }): Promise<Result> {
        const user = await this.UserService.findOne(params.user_id);

        const isAdmin = user.roles === 'ADMIN';

        for (let id of params.ids) {
            const post = await this.PostRepository.findOne({
                where: { id },
                relations: ['user'],
            });

            const hasPermissionToDelete = isAdmin || user.id === post.user.id;

            if (!hasPermissionToDelete) {
                throw new HttpException(
                    'You do not have permission to delete this post',
                    HttpsStatus.BAD_REQUEST,
                );
            }

            await this.PostRepository.softDelete(id);
        }

        return success.ok({ message: 'Delete successfuly' });
    }

    async update(params: {
        dto: UpdatePostDTO;
        user: string;
        thumbnail?: string;
    }): Promise<Result> {
        const { dto, user, thumbnail } = params;

        const [foundUser, category, post] = await Promise.all([
            this.UserService.findOne(user),
            this.CategoryService.findOne(dto.category_id),
            this.PostRepository.findOne({
                where: { id: dto.id },
                relations: ['user'],
            }),
        ]);

        const isAdmin = foundUser.roles === 'ADMIN';

        if (foundUser.id !== post.user.id || !isAdmin) {
            return error.commonError({
                location: 'user',
                param: 'authen',
                message: 'You do not have permission to edit this post',
            });
        }

        const update: Partial<PostEntity> = {
            content: dto.content,
            category,
            thumbnail,
        };
        await this.PostRepository.update(post.id, update);

        const result = plainToInstance(PostDto, post, {
            excludeExtraneousValues: true,
        });
        return success.ok({ mess: 'Update successfuly', ...result });
    }

    async getByCategory(id: string): Promise<PostEntity[]> {
        try {
            let result = await this.PostRepository.find({
                where: { category: { id: id } },
            });
            return result;
        } catch (e) {
            throw new HttpException('Invalid server', HttpsStatus.BAD_REQUEST);
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
