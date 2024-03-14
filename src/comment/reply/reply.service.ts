import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReplyEntity } from './entity/reply.entity';
import { Repository } from 'typeorm';
import { CreateReplyReq } from './dto/reply.body';
import { NormalService } from '../nomal/normal.service';
import { UserService } from '../../user/user.service';
import { HttpsStatus } from '../../common/constant';
import { success } from '../../shared/result';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(ReplyEntity)
        private readonly ReplyRepository: Repository<ReplyEntity>,
        private readonly UserService: UserService,
        @Inject(forwardRef(() => NormalService))
        private readonly NormalService: NormalService,
    ) {}

    async getByComment(params: { id: string }) {
        const result = await this.ReplyRepository.createQueryBuilder('reply')
            .select(['reply.id', 'reply.content'])
            .addSelect(['user.id', 'user.full_name', 'user.email'])
            .leftJoin('reply.user', 'user')
            .where('reply.normalCommentId = :normalCommentId', {
                normalCommentId: params.id,
            })
            .getMany();

        return result;
    }

    async create(params: CreateReplyReq) {
        try {
            const user = await this.UserService.findOne(params.user_id);
            const commnet = await this.NormalService.findOne(params.comment_id);
            if (user && commnet) {
                const data = {
                    content: params.content,
                    user,
                    commnet,
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
            normal_comment: { id: id_comment },
        });
        return 'deleted successfuly';
    }

    async deleted(params: { id: string; id_comment: string; user_id: string }) {
        const normalComment = await this.NormalService.findOne(
            params.id_comment,
        );
        const user = await this.UserService.findOne(params.user_id);
        const reply_comment = await this.ReplyRepository.findOne({
            where: { id: params.id },
        });
        if (normalComment) {
            if (
                user.id === reply_comment.user.id ||
                user.id === normalComment.user.id ||
                user.roles.some((role) => role.includes('ADMIN'))
            ) {
                await this.ReplyRepository.softDelete(reply_comment.id);
            } else {
                throw new HttpException(
                    'Faild deleted',
                    HttpsStatus.BAD_REQUEST,
                );
            }
        } else {
            throw new HttpException(
                'Comment not found',
                HttpsStatus.BAD_REQUEST,
            );
        }
    }
}
