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
            const numberOfTired: number = 5; //TODO: Số lần đăng nhập được phép trước khi bị khoá
            const user = await this.UserRepository.findOne({
                where: { email: params.email },
            }); //TODO: Tìm kiê user dựa theo email được truyền vào

            if (user && user.password) {
                if (user.fail_login === numberOfTired - 1) {
                    user.last_locked = new Date(); //TODO: Quy ước đếm từ 0, khi đến số lâ đăng nhập được cho phép thì khoá
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

                    if (diffInMinutes <= 30) { //TODO: Bị khoá 30 phút nếu như đăng nhập thất bại 5 lần, check xem thời gian khoá còn lại là bao nhiu
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

            const check_pass = bcrypt.compareSync(params.password.toString(), user.password); //TODO: check xem mật khẩu truyền vào với mật khẩu trong DB có khớp nhau không

            if (check_pass) {
                //TODO: Nếu có khớp nhau thì xử lý và tạo token
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
