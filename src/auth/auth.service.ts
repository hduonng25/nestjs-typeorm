import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import { error, success } from '../shared/result';
import * as bcrypt from 'bcrypt';
import { Token } from './token/create.token';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../user/dto/user.dto';
import { HttpsStatus } from '../common/constant';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
        private readonly token: Token,
    ) {
    }

    public async login(params: LoginDTO) {
        try {
            const numberOfTired: number = 5;
            const user = await this.UserRepository.findOne({
                where: { email: params.email },
            });

            if (user && user.password) {
                if (user.fail_login === numberOfTired - 1) {
                    user.last_locked = new Date();
                } else if (user.fail_login === numberOfTired) {
                    const lastLocked = user.last_locked
                        ? user.last_locked
                        : new Date();

                    const now = new Date();

                    const diffInMicrosecond =
                        now.getTime() - lastLocked.getTime();

                    const diffInMinutes = Math.ceil(
                        diffInMicrosecond / (60 * 1000),
                    );

                    if (diffInMinutes <= 30) {
                        return error.commonError({
                            location: 'user',
                            param: 'email or password',
                            message: 'Account is temporarily locked for 30 minutes',
                        });
                    }
                }
            } else {
                return error.commonError({
                    location: 'user',
                    message: 'user not found',
                });
            }

            const check_pass = bcrypt.compareSync(params.password.toString(), user.password);
            if (check_pass) {
                const { id, email, full_name } = user;
                const roles = [user.roles as unknown as string];
                const payload = { id, email, full_name, roles };

                const accessToken = await this.token.genAccessToken(payload);
                const refreshToken = await this.token.ganRefreshToken(id);

                const userResult = plainToInstance(UserDTO, user, {
                    excludeExtraneousValues: true,
                });

                await this.UserRepository.save(user);

                const data = {
                    ...userResult,
                    access_token: accessToken.token,
                    refresh_token: refreshToken.token,
                    roles: user.roles,
                };

                return success.ok(data);
            }
        } catch (e) {
            throw new HttpException('Faild login', HttpsStatus.INTERNAL_SERVER);
        }
    }
}
