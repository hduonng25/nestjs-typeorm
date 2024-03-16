import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';
import { changePasswordDTO } from './dto/change.password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { FindReqBody } from '../../shared/interface';
import { StorageConfigs } from '../../configs';
import { fileFilter } from '../../common';

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

    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: StorageConfigs('user'),
            fileFilter: fileFilter
        }),
    )
    @Post('upload-avatar')
    async uploadAvatar(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (req.validateFile) {
            throw new HttpException(req.validateFile, HttpStatus.BAD_REQUEST);
        }
        else if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        else {
            const data = {
                id: req.payload.id,
                avatar: file.destination + '/' + file.filename,
            };
            return this.UserService.uploadAvatar({ ...data });
        }
    }

    @Post('random')
    async randomCode(@Req() req: Request) {
        return this.UserService.genCodeRanDom(req.payload.id);
    }

    @Post('check-code')
    async checkCode(@Req() req: Request) {
        return this.UserService.checkRanDomCode(req.body.code);
    }

    @Put('change-pass')
    async changePassword(@Body() body: changePasswordDTO) {
        return this.UserService.changePassword(body);
    }
}
