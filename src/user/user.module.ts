import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { checkUser } from './check/check.user';
import { CheckRolesMiddleware } from './middleware/check.role.middleware';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, checkUser],
    controllers: [UserController],
    exports: [],
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CheckRolesMiddleware).forRoutes(
            { path: '/user/', method: RequestMethod.POST },
            { path: '/user/', method: RequestMethod.PUT },
        );
    }
}
