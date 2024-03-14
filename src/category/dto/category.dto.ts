import { BaseDTO } from '../../common';
import { Exclude, Expose } from 'class-transformer';
import { PostEntity } from '../../post/entity/post.entity';

export class CategoryDTO extends BaseDTO {
    @Expose()
    name: string;

    @Exclude()
    post: PostEntity[];
}
