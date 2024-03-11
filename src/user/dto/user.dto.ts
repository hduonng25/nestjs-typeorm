import { Expose, Transform } from '@nestjs/class-transformer';
import { BaseDTO } from '../../common';

export class UserDTO extends BaseDTO {
    first_name: string;

    last_name: string;

    @Transform(({ obj }) => obj.first_name + obj.last_name)
    @Expose()
    full_name: string;

    @Expose()
    age: number;

    @Expose()
    address: string;

    @Expose()
    email: string;

    password: string;

    @Expose()
    roles: string[];
}
