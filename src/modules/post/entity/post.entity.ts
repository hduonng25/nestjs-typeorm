import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { ReplyEntity } from '../../reply/entity/reply.entity';
import { BaseEntity } from '../../../common';
import { CommentEntity } from '../../comment/entity/comment.entity';

@Entity({ name: 'post' })
export class PostEntity extends BaseEntity {
    @Column()
    content: string;

    @Column({
        nullable: true,
        default: null,
    })
    thumbnail: string;

    @ManyToOne(() => UserEntity, (user) => user.post, {
        eager: false,
        lazy: false,
    })
    user: UserEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.post, {
        nullable: true,
        eager: false,
    })
    category: CategoryEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    comment: CommentEntity[];

    @OneToMany(() => ReplyEntity, (reply) => reply.post)
    reply: ReplyEntity[];
}
