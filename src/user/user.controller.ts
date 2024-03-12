import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindReqBody } from '../shared/interface';
import { UserDTO } from './dto/user.dto';
import { changePasswordDTO } from './dto/change.password.dto';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return await this.UserService.findAll(params);
    }

    @Post()
    async create(@Body() body: UserDTO) {
        return this.UserService.create(body);
    }

    @Put()
    async update(@Body() body: UserDTO) {
        return this.UserService.update(body);
    }

    @Delete()
    async deleted(@Body('ids') ids: string[]) {
        return this.UserService.deleted({ ids });
    }

    @Put('change-pass')
    async changePassword(@Body() body: changePasswordDTO) {
        return this.UserService.changePassword(body);
    }
}
