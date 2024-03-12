import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created_date: Date;

    @UpdateDateColumn()
    updated_date: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;

    @Column({ default: true })
    is_active: boolean;
}
