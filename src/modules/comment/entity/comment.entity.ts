import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '/common';
import { ReplyEntity } from '/modules/reply/entity/reply.entity';
import { UserEntity } from '/modules/user/entity/user.entity';
import { PostEntity } from '/modules/post/entity/post.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
    @Column()
    content: string;

    @OneToMany(() => ReplyEntity, (reply) => reply.comment, {
        nullable: true,
    })
    reply_comment: ReplyEntity[];

    @ManyToOne(() => UserEntity, (user) => user.comment, {
        eager: false,
    })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.comment)
    post: PostEntity;
}
