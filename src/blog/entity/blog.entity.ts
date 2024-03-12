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

    @ManyToOne(() => UserEntity, (user) => user.blog)
    user: UserEntity;

    @ManyToOne(() => CategoryEntity, (category) => category.blog, {
        nullable: true,
    })
    category: CategoryEntity;
}
