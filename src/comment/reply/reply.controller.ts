import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { Request } from 'express';
import { CreateReplyReq } from './dto/reply.body';

@Controller('comment/reply')
export class ReplyController {
    constructor(private readonly ReplyService: ReplyService) {}

    @Get()
    async getByComment(@Query('comment_id') comment_id: string) {
        return this.ReplyService.getByComment({ id: comment_id });
    }

    @Post()
    async create(@Req() req: Request) {
        const user_id = req.payload.id;
        const { comment_id, content } = req.body;
        const data = {
            comment_id,
            user_id,
            content,
        } as CreateReplyReq;

        return this.ReplyService.create(data);
    }
}
