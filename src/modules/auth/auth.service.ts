import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../user/dto/user.dto';
import { Token } from './token';
import { configs } from '../../configs';
import { error, Result, success } from '../../shared/result';
import { HttpsStatus } from '@Common/index';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
        private readonly token: Token,
    ) {}

    async login(params: LoginDTO) {
        try {
            const numberOfTired: number = parseFloat(
                configs.login.number_of_tired,
            );
            const user = await this.UserRepository.findOneOrFail({
                where: { email: params.email },
            });

            if (user.password) {
                if (user.fail_login === numberOfTired - 1) {
                    await this.UserRepository.update(user.id, {
                        last_locked: new Date(),
                    });
                } else if (user.fail_login === numberOfTired) {
                    const lastLocked = user.last_locked
                        ? user.last_locked
                        : new Date();
                    const now = new Date();
                    const diffInMilliseconds =
                        now.getTime() - lastLocked.getTime();
                    const diffInMinutes = Math.ceil(
                        diffInMilliseconds / (60 * 1000),
                    );
                    const lockTime = parseFloat(configs.auth.lock_time);

                    if (diffInMinutes <= lockTime) {
                        return error.commonError({
                            location: 'user',
                            param: 'email or password',
                            message:
                                'Account is temporarily locked for 30 minutes',
                        });
                    } else {
                        await this.UserRepository.update(user.id, {
                            fail_login: 0,
                        });
                    }
                }
            } else {
                return error.commonError({
                    location: 'user',
                    message: 'user not found',
                });
            }

            const check_pass = await bcrypt.compare(
                params.password.toString(),
                user.password,
            );

            if (check_pass) {
                const { id, email, full_name } = user;
                const roles = [user.roles as unknown as string];
                const payload = { id, email, full_name, roles };

                const accessToken = await this.token.genAccessToken(payload);
                const refreshToken = await this.token.ganRefreshToken(id);

                await this.UserRepository.update(user.id, { fail_login: 0 });

                const userResult = plainToInstance(UserDTO, user, {
                    excludeExtraneousValues: true,
                });
                const data = {
                    ...userResult,
                    access_token: accessToken.token,
                    refresh_token: refreshToken.token,
                    roles: user.roles,
                };
                return success.ok(data);
            } else {
                await this.UserRepository.increment(
                    { id: user.id },
                    'fail_login',
                    1,
                );
                return error.commonError({
                    location: 'user',
                    param: 'password',
                    message: 'password wrong',
                });
            }
        } catch (e) {
            throw new HttpException(
                'Failed login',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async refreshToken(token: string): Promise<Result> {
        const payload = await this.token.getPayload(token);
        try {
            const user = await this.UserRepository.findOne({
                where: {
                    id: payload.id,
                    is_active: true,
                },
            });

            if (user) {
                const { id, email, full_name } = user;
                const roles = [user.roles as unknown as string];
                const payload = { id, email, full_name, roles };

                const accessToken = await this.token.genAccessToken(payload);
                const refreshToken = await this.token.ganRefreshToken(id);

                const userResult = plainToInstance(UserDTO, user, {
                    excludeExtraneousValues: true,
                });

                const data = {
                    ...userResult,
                    access_token: accessToken.token,
                    refresh_token: refreshToken.token,
                    roles: user.roles,
                };

                return success.ok(data);
            }
        } catch (e) {
            if (e.name && e.name === 'TokenExpiredError') {
                throw new HttpException(
                    'Your token expired',
                    HttpsStatus.INTERNAL_SERVER,
                );
            } else {
                throw new HttpException(
                    'Your token is not valid',
                    HttpsStatus.BAD_REQUEST,
                );
            }
        }
    }
}
