import { IsNotEmpty } from 'class-validator';
import { BaseDTO } from '../../../common';

export class changePasswordDTO extends BaseDTO {
    @IsNotEmpty()
    new_password: string;

    @IsNotEmpty()
    old_password: string;
}
