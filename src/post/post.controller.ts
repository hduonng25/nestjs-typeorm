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
import { UserService } from '../user/user.service';
import { PostDto } from './dto/post.dto';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.body.dto';

@Controller('post')
export class PostController {
    constructor(
        private readonly PostService: PostService,
        private readonly UserService: UserService,
    ) {}

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return this.PostService.findAll(params);
    }

    @Post()
    async create(@Req() req: Request, @Body() body: CreatePostDTO) {
        const user = await this.UserService.findOne(req.payload.id);
        const postDTO = {
            user,
            ...body,
        } as unknown as PostDto;

        return this.PostService.create(postDTO);
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
