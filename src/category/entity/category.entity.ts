import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common';
import { BlogEntity } from '../../blog/entity/blog.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
    @Column()
    name: string;

    @OneToMany(() => BlogEntity, (blog) => blog.category)
    blog: BlogEntity[];
}
