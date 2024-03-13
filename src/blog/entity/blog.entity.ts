import { BaseEntity } from '../../common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';
import { CategoryEntity } from '../../category/entity/category.entity';

@Entity({ name: 'blog' })
export class BlogEntity extends BaseEntity {
    @Column()
    content: string;

    @Column({
        nullable: true,
    })
    avatar: string;

    @Column({ nullable: true })
    parent_id: string;

    @ManyToOne(() => UserEntity, (user) => user.blog, {
        eager: true,
        lazy: false,
    })
    user: UserEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.blog, {
        nullable: true,
        eager: true,
    })
    category: CategoryEntity;
}
