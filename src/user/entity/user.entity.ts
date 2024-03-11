import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common';

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
    address: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
    })
    roles: string[];
}
