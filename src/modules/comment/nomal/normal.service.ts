import { HttpException, Injectable } from '@nestjs/common';
import { CreateNormalReq, DeletedNormalReq } from './dto/normal.body';
import { InjectRepository } from '@nestjs/typeorm';
import { NormalEntity } from './entity/normal.entity';
import { Repository } from 'typeorm';
import { UserService } from '../../user/user.service';
import { PostService } from '../../post/post.service';
import { ReplyService } from '../reply/reply.service';
import { error, Result, success } from '../../../shared/result';
import { HttpsStatus } from '../../../common/constant';

@Injectable()
export class NormalService {
    constructor(
        @InjectRepository(NormalEntity)
        private readonly NormalCommentRepository: Repository<NormalEntity>,
        private readonly ReplyService: ReplyService,
        private readonly UserService: UserService,
        private readonly PostService: PostService,
    ) {}

    async getByPost(params: { post_id: string }) {
        const post = await this.PostService.findOne(params.post_id);
        const normal_comment = await this.NormalCommentRepository.find({
            where: { post: { id: post.id } },
            relations: {
                user: true,
            },
            select: {
                id: true,
                content: true,
                user: {
                    id: true,
                    full_name: true,
                    avatar: true,
                    email: true,
                },
            },
        });

        const result_comment = await Promise.all(
            normal_comment.map(async (item) => {
                const reply_comment = await this.ReplyService.getByComment({
                    id: item.id,
                });
                const data = {
                    ...item,
                    reply: reply_comment,
                };
                return data;
            }),
        );

        return result_comment;
    }

    async create(params: CreateNormalReq): Promise<Result> {
        const user = await this.UserService.findOne(params.user_id);
        const post = await this.PostService.findOne(params.post_id);
        const content = params.content;

        const create = {
            content,
            user,
            post,
        };

        await this.NormalCommentRepository.insert(create);
        return success.ok({ mess: 'Create successfuly' });
    }

    async deleted(params: DeletedNormalReq): Promise<Result> {
        const user = await this.UserService.findOne(params.user_id);
        const normalComment = await this.NormalCommentRepository.findOne({
            where: { id: params.id },
        });
        if (
            (user && user.id === normalComment.user.id) ||
            user.roles === 'ADMIN'
        ) {
            await this.NormalCommentRepository.softDelete(normalComment.id);
            await this.ReplyService.deletedByComment(normalComment.id);
        }

        return success.ok({ mess: 'Deleted successfuly' });
    }

    async update(params: {
        id: string;
        content: string;
        user_id: string;
    }): Promise<Result> {
        const normalComment = await this.NormalCommentRepository.findOne({
            where: { id: params.id },
        });
        const user = await this.UserService.findOne(params.user_id);
        if (normalComment) {
            if (user.id === normalComment.user.id) {
                normalComment.content = params.content;
                await this.NormalCommentRepository.update(
                    params.id,
                    normalComment,
                );
                return success.ok({ mess: 'Update successfuly' });
            } else {
                return error.commonError({
                    location: 'roles',
                    param: 'user',
                    message: 'You not roles is change',
                });
            }
        } else {
            return error.notFound({});
        }
    }

    //External
    async findOne(id: string) {
        const normalComment = await this.NormalCommentRepository.findOne({
            where: { id: id },
        });
        if (normalComment) {
            return normalComment;
        } else {
            throw new HttpException(
                'Commnet not found',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }
}
