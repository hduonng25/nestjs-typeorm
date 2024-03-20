import {
    Logger,
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configs, withCache } from './configs';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './shared/guard';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';
import { CheckTokenReq } from './modules/auth/check/check.token.request';
import { MyLogger } from './shared/logger/logger';
import { ReplyModule } from './modules/reply/reply.module';

@Module({
    imports: [
        JwtModule.register({
            secret: configs.keys.public_key,
            signOptions: { expiresIn: configs.jwt.expiresIn },
        }),

        TypeOrmModule.forRoot(withCache),
        UserModule,
        PostModule,
        CategoryModule,
        AuthModule,
        CommentModule,
        ReplyModule,
    ],
    controllers: [UserController, AuthController],
    providers: [
        MyLogger,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckTokenReq)
            .exclude(
                {
                    path: configs.exclude.auth.login,
                    method: RequestMethod.POST,
                },
                {
                    path: configs.exclude.auth.refresh_token,
                    method: RequestMethod.POST,
                },
                {
                    path: configs.exclude.user.create,
                    method: RequestMethod.POST,
                },
                {
                    path: 'blog/home/',
                    method: RequestMethod.GET,
                },
            )
            .forRoutes('*');
    }
}
