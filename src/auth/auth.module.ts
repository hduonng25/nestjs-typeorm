import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { configs } from '../configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Token } from './token/create.token';

@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: async () => ({
                privateKey: configs.keys.private_key,
                signOptions: { expiresIn: '2h', algorithm: 'RS256' },
            }),
        }),

        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [AuthService, Token],
    controllers: [AuthController],
})
export class AuthModule {}
