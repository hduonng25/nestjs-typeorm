import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({ select: true })
    created_date: Date;

    @UpdateDateColumn({ select: true })
    updated_date: Date;

    @DeleteDateColumn({ nullable: true, select: true })
    deleted_at: Date;

    @Column({ default: true, select: true })
    is_active: boolean;
}
