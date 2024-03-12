import { Expose } from 'class-transformer';

export class BaseDTO {
    @Expose()
    id: string;

    ids: string[];

    // deleted_at: Date;

    is_active: boolean;
}
