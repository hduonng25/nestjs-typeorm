import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { checkUser } from './check/check.user';
import { CheckRolesMiddleware } from './middleware/check.role.middleware';
import { LoggerModule } from '../logger/logger.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), LoggerModule],
    providers: [UserService, checkUser],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CheckRolesMiddleware)
            .forRoutes(
                { path: '/user/', method: RequestMethod.POST },
                { path: '/user/', method: RequestMethod.PUT },
            );
    }
}
