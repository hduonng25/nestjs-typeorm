import { BaseDTO } from '../../common';
import { CategoryEntity } from '../../category/entity/category.entity';

export class CreatePostDTO extends BaseDTO {
    category?: string;

    content: string;

    avatar?: string;
}

export class UpdatePostDTO extends BaseDTO {
    content?: string;

    category?: CategoryEntity;

    avatar?: string;

    user_id: string;
}
