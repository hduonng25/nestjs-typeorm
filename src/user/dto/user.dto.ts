import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDTO } from '../../common';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDTO extends BaseDTO {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @Transform(({ obj }) => obj.first_name + ' ' + obj.last_name)
    @Expose()
    full_name: string;

    @IsNotEmpty()
    @Expose()
    age: number;

    @IsNotEmpty()
    @IsEmail()
    @Expose()
    email: string;

    password: string;

    @Exclude()
    last_locked: Date;

    @IsNotEmpty()
    @Expose()
    roles: string[];
}
