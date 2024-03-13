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
import { BlogService } from './blog.service';
import { FindReqBody } from '../shared/interface';
import { CreateBlogDTO, UpdateBlogDTO } from './dto/blog.body.dto';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { BlogDTO } from './dto/blog.dto';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly BlogService: BlogService,
        private readonly UserService: UserService,
    ) {
    }

    @Get()
    async findAll(@Query() params: FindReqBody) {
        return this.BlogService.findAll(params);
    }

    @Post()
    async createBlog(@Req() req: Request, @Body() body: CreateBlogDTO) {
        const user = await this.UserService.findOne(req.payload.id);
        const blogDTO = {
            user,
            ...body,
        } as unknown as BlogDTO;

        return this.BlogService.create(blogDTO);
    }

    @Put()
    async updateBlog(@Body() body: UpdateBlogDTO, @Req() req: Request) {
        const user_id = req.payload.id;
        return this.BlogService.update({
            dto: body,
            user: user_id,
        });
    }

    @Delete()
    async deleted(@Body('ids') ids: string[], @Req() req: Request) {
        return this.BlogService.deleted({
            ids: ids,
            user_id: req.payload.id,
        });
    }
}
