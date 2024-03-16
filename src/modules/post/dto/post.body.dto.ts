import { BaseDTO } from '../../../common';
import { CategoryEntity } from '../../category/entity/category.entity';

export interface CreatePostDTO extends BaseDTO {
    category_id?: string;

    content: string;

    thumbnail?: string;

    avatar?: string;
}

export class UpdatePostDTO extends BaseDTO {
    content?: string;

    category?: CategoryEntity;

    avatar?: string;

    thumbnail: string;

    user_id: string;
}
