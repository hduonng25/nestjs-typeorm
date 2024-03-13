import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../common/enum/roles.enum';
import { PostEntity } from '../../post/entity/post.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    full_name: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: Roles,
    })
    roles: string[];

    @Column({ default: 0 })
    fail_login: number;

    @Column({ type: 'datetime', nullable: true })
    last_locked: Date;

    @OneToMany(() => PostEntity, (post) => post.user)
    post: PostEntity[];

    @BeforeInsert()
    async hashPasswordCreate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }

    @BeforeUpdate()
    async hashPasswordUpdate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }
}
