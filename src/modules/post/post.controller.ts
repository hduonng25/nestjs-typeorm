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
import { extname } from 'path';
import { FileEnum } from '../../common/enum/image.enum';
import { HttpsStatus } from '../../common/constant';

@Controller('post')
export class PostController {
    constructor(private readonly PostService: PostService) {}

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return this.PostService.getAll(params);
    }

    @Get(':id')
    async getByUser(@Query('id') id: string) {
        return this.PostService.getByUser(id);
    }

    @Get(':id')
    async getByCategory(@Query('id') id: string) {
        return this.PostService.getByCategory(id);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            storage: StorageConfigs('post'),
            fileFilter(
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, acceptFile: boolean) => void,
            ) {
                const ext = extname(file.originalname);
                if (!FileEnum.includes(ext)) {
                    req.validateFile = `Wrong extention type. Accepted file ext are: ${FileEnum}`;
                    callback(null, false);
                } else {
                    const fileSize = parseInt(req.headers['content-length']);
                    if (fileSize > 1024 * 1024 * 5) {
                        req.validateFile = `Wrong extention type. Accepted file ext are: ${FileEnum}`;
                        callback(null, false);
                    } else {
                        callback(null, true);
                    }
                }
            },
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
                thumbnail: file.destination + '/' + file.filename,
            });
        }
    }

    @UseInterceptors(
        FileInterceptor('thumbnail', { storage: StorageConfigs('post') }),
    )
    @Put()
    async update(
        @Body() body: UpdatePostDTO,
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const user_id = req.payload.id;
        return this.PostService.update({
            dto: body,
            user: user_id,
            thumbnail: file.destination + '/' + file.filename,
        });
    }

    @Delete()
    async deleted(@Body('ids') ids: string[], @Req() req: Request) {
        return this.PostService.deleted({
            ids: ids,
            user_id: req.payload.id,
        });
    }
}