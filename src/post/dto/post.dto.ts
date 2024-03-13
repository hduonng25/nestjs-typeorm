import { BaseDTO } from '../../common';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../../user/entity/user.entity';
import { CategoryEntity } from '../../category/entity/category.entity';

export class PostDto extends BaseDTO {
    @Expose()
    content: string;

    @Expose()
    user: UserEntity;

    @Expose()
    avatar: string;

    @Exclude()
    category: CategoryEntity;
}
