import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), UserModule],
    providers: [PostService],
    controllers: [PostController],
})
export class PostModule {}
