import { Exclude, Expose } from 'class-transformer';
import { PostEntity } from '../../post/entity/post.entity';
import { BaseDTO } from '../../../common';

export class CategoryDTO extends BaseDTO {
    @Expose()
    name: string;

    @Exclude()
    post: PostEntity[];
}
