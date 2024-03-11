import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configs, withCache } from './configs';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';
import { CheckTokenReq } from './auth/check/check.token.request';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './shared/guard';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

@Module({
    imports: [
        JwtModule.register({
            secret: configs.keys.public_key,
            signOptions: { expiresIn: '2h' },
        }),
        TypeOrmModule.forRoot(withCache),
        UserModule,
        BlogModule,
        CategoryModule,
        AuthModule,
    ],
    controllers: [UserController, AuthController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})

export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckTokenReq)
            .exclude(
                { path: '/auth/login', method: RequestMethod.POST },
                { path: '/auth/refresh-token', method: RequestMethod.POST },
                { path: '/user/', method: RequestMethod.POST },
            )
            .forRoutes('*');
    }
}
