import { Column, Entity, ManyToOne } from 'typeorm';
import { NormalEntity } from '../../nomal/entity/normal.entity';
import { UserEntity } from '../../../user/entity/user.entity';
import { PostEntity } from '../../../post/entity/post.entity';
import { BaseEntity } from '../../../../common';

@Entity({ name: 'reply_comment' })
export class ReplyEntity extends BaseEntity {
    @Column()
    content: string;

    @ManyToOne(() => NormalEntity, (normal) => normal.reply_comment)
    normal_comment: NormalEntity;

    @ManyToOne(() => UserEntity, (user) => user.reply_comment, { eager: true })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.reply_comment)
    post: PostEntity;
}
