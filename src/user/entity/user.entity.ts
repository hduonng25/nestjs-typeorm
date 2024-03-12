import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common';
import { BlogEntity } from '../../blog/entity/blog.entity';
import * as bcrypt from 'bcrypt';
import { Roles } from '../../common/enum/roles.enum';

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

    @OneToMany(() => BlogEntity, (blog) => blog.user)
    blog: BlogEntity[];

    @BeforeInsert()
    async hashPasswordCreate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }

    @BeforeUpdate()
    async hashPasswordUpdate() {
        this.password = await bcrypt.hash(this.password.toString(), 10);
    }
}
