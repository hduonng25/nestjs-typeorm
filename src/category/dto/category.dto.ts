import { BaseDTO } from '../../common';
import { Exclude, Expose } from 'class-transformer';
import { BlogEntity } from '../../blog/entity/blog.entity';

export class CategoryDTO extends BaseDTO {
    @Expose()
    name: string;

    @Exclude()
    blog: BlogEntity[];
}