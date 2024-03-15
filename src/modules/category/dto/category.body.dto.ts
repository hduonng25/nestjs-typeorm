import { IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateCategoryDTO {
    @IsNotEmpty()
    name: string;
}

export class UpdateCategoryDTO {
    @Exclude()
    id: string;

    @Expose()
    name: string;
}
