import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { checkUser } from './check/check.user';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, checkUser],
    controllers: [UserController],
    exports: [],
})
export class UserModule {}
