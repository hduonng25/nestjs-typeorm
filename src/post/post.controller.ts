import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FindReqBody } from '../shared/interface';
import { Request } from 'express';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.body.dto';

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

    @Post()
    async create(@Req() req: Request, @Body() body: CreatePostDTO) {
        return this.PostService.create({ dto: body, is_user: req.payload.id });
    }

    @Put()
    async update(@Body() body: UpdatePostDTO, @Req() req: Request) {
        const user_id = req.payload.id;
        return this.PostService.update({
            dto: body,
            user: user_id,
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
