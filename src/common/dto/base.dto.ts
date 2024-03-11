import { Expose } from 'class-transformer';

export class BaseDTO {
    @Expose()
    id: string;

    ids: string[];
    F;
    created_date: Date;

    updated_date: Date;

    is_deleted: boolean;

    is_active: boolean;
}
