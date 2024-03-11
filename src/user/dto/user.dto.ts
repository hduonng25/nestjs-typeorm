import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDTO } from '../../common';
import { IsNotEmpty } from 'class-validator';

export class UserDTO extends BaseDTO {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @Transform(({ obj }) => obj.first_name + " " + obj.last_name)
    @Expose()
    full_name: string;

    @IsNotEmpty()
    @Expose()
    age: number;

    @IsNotEmpty()
    @Expose()
    email: string;

    @Exclude()
    password: string;

    @IsNotEmpty()
    @Expose()
    roles: string[];
}

