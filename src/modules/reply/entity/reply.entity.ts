import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { PostEntity } from '../../post/entity/post.entity';
import { BaseEntity } from '../../../common';
import { CommentEntity } from '../../comment/entity/comment.entity';

@Entity({ name: 'reply_comment' })
export class ReplyEntity extends BaseEntity {
    @Column()
    content: string;

    @ManyToOne(() => CommentEntity, (comment) => comment.reply_comment)
    comment: CommentEntity;

    @ManyToOne(() => UserEntity, (user) => user.reply, { eager: false })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.reply)
    post: PostEntity;
}
