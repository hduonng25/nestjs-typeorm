import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyEntity } from './entity/reply.entity';
import { Repository } from 'typeorm';
import { CreateReplyReq } from './dto/reply.body';
import { HttpsStatus } from '@Common/index';
import { NormalService } from '../comment/comment.service';
import { UserService } from '../user/user.service';
import { success } from '@Shared/result';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(ReplyEntity)
        private readonly ReplyRepository: Repository<ReplyEntity>,
        @Inject(forwardRef(() => NormalService))
        private readonly NormalService: NormalService,
        private readonly UserService: UserService,
    ) {}

    async getByComment(params: { id: string }) {
        const result = await this.ReplyRepository.find({
            where: { comment: { id: params.id } },
            relations: {
                user: true,
                comment: true,
            },
            select: {
                id: true,
                content: true,
                user: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar: true,
                },
            },
        });

        return result;
    }

    async create(params: CreateReplyReq) {
        try {
            const [user, comment] = await Promise.all([
                this.UserService.findOne(params.user_id),
                this.NormalService.findOne(params.comment_id),
            ]);
            if (user && comment) {
                const data = {
                    content: params.content,
                    user,
                    comment,
                };

                await this.ReplyRepository.insert(data);
                return success.ok({ mess: 'Create successfuly' });
            }
        } catch (e) {
            throw e;
        }
    }

    async deletedByComment(id_comment: string) {
        await this.ReplyRepository.softDelete({
            comment: { id: id_comment },
        });
        return 'deleted successfuly';
    }

    async deleted(params: { id: string; id_comment: string; user_id: string }) {
        const { id, id_comment, user_id } = params;

        const [normalComment, user, replyComment] = await Promise.all([
            this.NormalService.findOne(id_comment),
            this.UserService.findOne(user_id),
            this.ReplyRepository.findOne({ where: { id: id } }),
        ]);

        if (!normalComment) {
            throw new HttpException(
                'Comment not found',
                HttpsStatus.BAD_REQUEST,
            );
        }

        const isAdmin = user.roles === 'ADMIN';
        const isOwner =
            user.id === replyComment.user.id ||
            user.id === normalComment.user.id;

        if (!isAdmin && !isOwner) {
            throw new HttpException(
                'Failed to delete',
                HttpsStatus.BAD_REQUEST,
            );
        }
        await this.ReplyRepository.softDelete(replyComment.id);
    }
}
