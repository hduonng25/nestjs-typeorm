import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { withCache } from './configs';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot(withCache),
        BlogModule,
        CategoryModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
