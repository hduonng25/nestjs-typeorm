import { forwardRef, Global, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { UserModule } from '../user/user.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        UserModule,
        CategoryModule,
    ],
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService],
})
export class PostModule {}
