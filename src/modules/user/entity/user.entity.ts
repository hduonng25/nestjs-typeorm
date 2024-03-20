import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostEntity } from '../../post/entity/post.entity';
import { ReplyEntity } from '../../reply/entity/reply.entity';
import { BaseEntity } from '../../../common';
import { Roles } from '../../../common/enum/roles.enum';
import { CommentEntity } from '../../comment/entity/comment.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @Column({ select: true })
    first_name: string;

    @Column({ select: true })
    last_name: string;

    @Column()
    full_name: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column({ select: true })
    password: string;

    @Column({ nullable: true, default: null })
    avatar: string;

    @Column({})
    roles: string;

    @Column({ default: 0, select: true })
    fail_login: number;

    @Column({ type: 'datetime', nullable: true, select: true })
    last_locked: Date;

    @OneToMany(() => PostEntity, (post) => post.user)
    post: PostEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comment: CommentEntity[];

    @OneToMany(() => ReplyEntity, (reply) => reply.user)
    reply: ReplyEntity[];

    @BeforeInsert()
    async hashPasswordCreate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }

    @BeforeUpdate()
    async hashPasswordUpdate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }
}
