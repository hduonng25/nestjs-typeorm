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
import { NormalService } from './comment.service';
import { Request } from 'express';
import { CreateCommentReq } from './dto/comment.body';

@Controller('comment')
export class NormalController {
    constructor(private readonly NormalService: NormalService) {}

    @Post()
    async create(@Body() body: CreateCommentReq, @Req() req: Request) {
        const user_id = req.payload.id;
        const data = {
            user_id,
            ...body,
        };
        return this.NormalService.create(data);
    }

    @Get('post/:id')
    async findByPost(@Query('id') id: string) {
        return this.NormalService.getByPost({ post_id: id });
    }

    @Put()
    async update(@Req() req: Request) {
        const { id, content } = req.body;
        const user_id = req.payload.id;
        const data = {
            id,
            content,
            user_id,
        };

        return this.NormalService.update({ ...data });
    }

    @Delete()
    async delete(@Req() req: Request) {
        const user_id = req.payload.id;
        const data = {
            ...req.body.id,
            user_id,
        };

        return this.NormalService.deleted(data);
    }
}
