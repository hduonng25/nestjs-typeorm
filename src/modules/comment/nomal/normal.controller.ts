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
import { NormalService } from './normal.service';
import { CreateNormalReq } from './dto/normal.body';
import { Request } from 'express';

@Controller('comment/normal')
export class NormalController {
    constructor(private readonly NormalService: NormalService) {}

    @Post()
    async create(@Body() body: CreateNormalReq, @Req() req: Request) {
        const user_id = req.payload.id;
        const data = {
            user_id,
            ...body,
        };
        return this.NormalService.create(data);
    }

    @Get('by-post')
    async findByPost(@Query('post_id') post_id: string) {
        return this.NormalService.getByPost({ post_id });
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
