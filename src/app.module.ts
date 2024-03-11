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

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forRoot(withCache),
        BlogModule,
        CategoryModule,
        AuthModule,
        JwtModule.register({
            secret: configs.keys.public_key,
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [],
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
            .exclude({ path: '127.0.0.1:3009/api/v1/auth/', method: RequestMethod.POST })
            .exclude({ path: '/user/', method: RequestMethod.POST })
            .forRoutes('*');
    }
}
