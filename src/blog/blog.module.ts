import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { UserModule } from '../user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntity]), UserModule],
    providers: [BlogService],
    controllers: [BlogController],
})
export class BlogModule {}
