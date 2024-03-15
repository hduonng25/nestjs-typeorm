import { Column, Entity, OneToMany } from 'typeorm';
import { PostEntity } from '../../post/entity/post.entity';
import { BaseEntity } from '../../../common';

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
    @Column()
    name: string;

    @OneToMany(() => PostEntity, (post) => post.category)
    post: PostEntity[];
}
