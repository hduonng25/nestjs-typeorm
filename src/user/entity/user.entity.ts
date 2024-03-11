import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import { BlogEntity } from '../../blog/entity/blog.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({})
    full_name: string;

    @Column()
    age: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
    })
    roles: string[];

    @OneToMany(() => BlogEntity, (blog) => blog.user)
    blog: BlogEntity[];
}
