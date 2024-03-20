import { Module, forwardRef } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { ReplyEntity } from './entity/reply.entity';
import { CommentModule } from '../comment/comment.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReplyEntity]),
        forwardRef(() => CommentModule),
        UserModule,
        PostModule,
    ],
    providers: [ReplyService],
    controllers: [ReplyController],
    exports: [ReplyService],
})
export class ReplyModule {}
