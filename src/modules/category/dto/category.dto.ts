import { BaseDTO } from '@Common/index';
import { Exclude, Expose } from 'class-transformer';
import { PostEntity } from '/modules/post/entity/post.entity';

export class CategoryDTO extends BaseDTO {
    @Expose()
    name: string;

    @Exclude()
    post: PostEntity[];
}
