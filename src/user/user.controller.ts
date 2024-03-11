import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindReqBody } from '../shared/interface';
import { UserDTO } from './dto/user.dto';
import { changePasswordDTO } from './dto/change.password.dto';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {
    }

    @Get()
    public findAll(@Query() params: FindReqBody) {
        return this.UserService.findAll(params);
    }

    @Post()
    public create(@Body() body: UserDTO) {
        return this.UserService.create(body);
    }

    @Put()
    public update(@Body() body: UserDTO) {
        return this.UserService.update(body);
    }

    @Delete()
    public deleted(@Body() body: UserDTO) {
        return this.UserService.deleted(body);
    }

    @Put('change-pass')
    public changePassword(@Body() body: changePasswordDTO) {
        return this.UserService.changePassword(body);
    }

}
