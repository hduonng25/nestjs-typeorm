import { BaseDTO } from '../../common';
import { IsNotEmpty } from 'class-validator';

export class changePasswordDTO extends BaseDTO {
    @IsNotEmpty()
    new_password: string;

    @IsNotEmpty()
    old_password: string;
}
