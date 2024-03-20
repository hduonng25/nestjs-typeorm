import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '@Common/index';
import { PostEntity } from '/modules/post/entity/post.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
    @Column()
    name: string;

    @OneToMany(() => PostEntity, (post) => post.category)
    post: PostEntity[];
}
