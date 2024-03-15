import { Module } from '@nestjs/common';
import { NormalService } from './nomal/normal.service';
import { NormalController } from './nomal/normal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalEntity } from './nomal/entity/normal.entity';
import { ReplyEntity } from './reply/entity/reply.entity';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { ReplyService } from './reply/reply.service';
import { ReplyController } from './reply/reply.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([NormalEntity, ReplyEntity]),
        UserModule,
        PostModule,
    ],
    providers: [NormalService, ReplyService],
    controllers: [NormalController, ReplyController],
    exports: [NormalService, ReplyService],
})
export class CommentModule {}
