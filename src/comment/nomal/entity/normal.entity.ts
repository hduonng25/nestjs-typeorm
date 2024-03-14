import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common';
import { UserEntity } from '../../../user/entity/user.entity';
import { ReplyEntity } from '../../reply/entity/reply.entity';
import { PostEntity } from '../../../post/entity/post.entity';

@Entity({ name: 'normal_comment' })
export class NormalEntity extends BaseEntity {
    @Column()
    content: string;

    @OneToMany(() => ReplyEntity, (reply) => reply.normal_comment, {
        nullable: true,
    })
    reply_comment: ReplyEntity[];

    @ManyToOne(() => UserEntity, (user) => user.normal_comment, { eager: true })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.normal_comment)
    post: PostEntity;
}
