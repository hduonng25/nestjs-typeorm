import {
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { v1 as uuid1 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: string = uuid1();

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ default: true })
    is_active: boolean;
}
function v1(): string {
    throw new Error('Function not implemented.');
}
