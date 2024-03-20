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
import { PostService } from './post.service';
import { Request } from 'express';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.body.dto';
import { FindReqBody } from '../../shared/interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageConfigs } from '../../configs';
import { fileFilter } from '../../common/imgUpload/img.filter';

@Controller('post')
export class PostController {
    constructor(private readonly PostService: PostService) {}

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return this.PostService.getAll(params);
    }

    @Get(':id')
    async getByID(@Query('id') id: string) {
        return this.PostService.getByID(id);
    }

    @Get('user/:id')
    async getByUser(@Query('id') id: string) {
        return this.PostService.getByUser(id);
    }

    @Get('category/:id')
    async getByCategory(@Query('id') id: string) {
        return this.PostService.getByCategory(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: StorageConfigs('thumbnail'),
            fileFilter: fileFilter,
        }),
    )
    async create(
        @Req() req: Request,
        @Body() body: CreatePostDTO,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (req.validateFile) {
            throw new HttpException(req.validateFile, HttpStatus.BAD_REQUEST);
        } else if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        } else {
            return this.PostService.create({
                dto: body,
                is_user: req.payload.id,
                thumbnail: file.fieldname + '/' + file.filename,
            });
        }
    }

    @UseInterceptors(
        FileInterceptor('thumbnail', { storage: StorageConfigs('thumbnail') }),
    )
    @Put()
    async update(
        @Body() body: UpdatePostDTO,
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const user_id: string = req.payload.id;
        let data: any;
        if (file) {
            data = {
                dto: body,
                user: user_id,
                thumbnail: file.fieldname + '/' + file.filename,
            };
        } else {
            data = {
                dto: body,
                user: user_id,
            };
        }
        return this.PostService.update(data);
    }

    @Delete()
    async deleted(@Body('ids') ids: string[], @Req() req: Request) {
        return this.PostService.deleted({
            ids: ids,
            user_id: req.payload.id,
        });
    }
}
