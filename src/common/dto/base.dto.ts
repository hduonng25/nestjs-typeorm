import { Expose } from '@nestjs/class-transformer';

export class BaseDTO {
    @Expose()
    id: string;

    created_date: Date;

    updated_date: Date;

    is_deleted: boolean;

    is_active: boolean;
}
