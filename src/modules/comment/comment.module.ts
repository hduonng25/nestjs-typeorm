import { Global, Module, forwardRef } from '@nestjs/common';
import { NormalService } from './comment.service';
import { NormalController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { ReplyModule } from '../reply/reply.module';
import { CommentEntity } from './entity/comment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity]),
        forwardRef(() => ReplyModule),
        UserModule,
        PostModule,
    ],
    providers: [NormalService],
    controllers: [NormalController],
    exports: [NormalService],
})
export class CommentModule {}
