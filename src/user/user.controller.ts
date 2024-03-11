import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindReqBody } from '../shared/interface';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}
    
    @Get()
    public findAll(@Query() params: FindReqBody) {
        return this.UserService.findAll(params);
    }
}
