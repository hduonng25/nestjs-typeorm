import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { CategoryEntity } from '../../category/entity/category.entity';
import { NormalEntity } from '../../comment/nomal/entity/normal.entity';
import { ReplyEntity } from '../../comment/reply/entity/reply.entity';
import { BaseEntity } from '../../../common';

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

    @OneToMany(() => NormalEntity, (normal) => normal.post)
    normal_comment: NormalEntity[];

    @OneToMany(() => ReplyEntity, (reply) => reply.post)
    reply_comment: ReplyEntity[];
}
