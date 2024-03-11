import { BaseDTO } from '../../common';
import { IsNotEmpty } from 'class-validator';

export class changePasswordDTO extends BaseDTO {
    new_password: string;

    old_password: string;
}