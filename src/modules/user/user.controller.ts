import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query, Req, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { changePasswordDTO } from './dto/change.password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FindReqBody } from '../../shared/interface';
import { StorageConfigs } from '../../configs';

@Controller('user')
export class UserController {
    constructor(private readonly UserService: UserService) {
    }

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return await this.UserService.findAll(params);
    }

    @Get(':id')
    async getByID(@Query('id') id: string) {
        return this.UserService.findOne(id);
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

    @UseInterceptors(FileInterceptor('avatar', { storage: StorageConfigs('avatar') }))
    @Post('upload-avatar')
    async uploadAvatar(@Req() req: Request,
                       @UploadedFile() file: Express.Multer.File) {
        const data = {
            id: req.payload.id,
            avatar: file.destination + '/' + file.filename,
        };
        return this.UserService.uploadAvatar({ ...data });
    }
}
