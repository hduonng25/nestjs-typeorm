import {
    Column,
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;

    @Column({ default: false })
    is_deleted: boolean;

    @Column({ default: true })
    is_active: boolean;
}
