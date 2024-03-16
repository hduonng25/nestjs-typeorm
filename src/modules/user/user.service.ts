import { HttpException, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { changePasswordDTO } from './dto/change.password.dto';
import { checkUser } from './check/check.user';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../shared/type-orm';
import { error, Result, success } from '../../shared/result';
import { FindReqBody } from '../../shared/interface';
import { HttpsStatus } from '../../common/constant';

@Injectable()
export class UserService extends BaseService {
    private random: () => string;
    private codeRanDom: string;

    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
        private readonly checkUser: checkUser,
    ) {

        super();

        this.random = () => {
            const length = 8;
            const characters =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let ranDom = '';
            const charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                ranDom += characters.charAt(
                    Math.floor(Math.random() * charactersLength),
                );
            }

            return ranDom;
        };
    }

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (page - 1) * size;

        const findManyOptions: FindManyOptions<UserEntity> = {
            take: size,
            skip,
            select: ['id', 'full_name', 'age', 'email'],
            order: { created_date: 'DESC' },
        };

        const [result, total] =
            await this.UserRepository.findAndCount(findManyOptions);

        const totalPage = Math.ceil(total / size);

        return success.ok({
            page,
            size,
            total,
            totalPage,
            result,
        });
    }

    async findOne(id: string): Promise<UserEntity> {
        const user = await this.UserRepository.findOne({
            where: { id: id },
            select: [
                'id',
                'full_name',
                'age',
                'first_name',
                'last_name',
                'email',
            ],
        });
        if (user) {
            return user;
        }
        else {
            throw new HttpException(
                'User not found',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }

    async create(params: UserDTO): Promise<Result> {
        const check = await this.UserRepository.findOne({
            where: {
                email: params.email,
            },
        });

        if (!check) {
            const user = new UserEntity();
            Object.assign(user, params);
            await this.UserRepository.save(user);
            const result = plainToInstance(UserDTO, user, {
                excludeExtraneousValues: true,
            });
            return success.created(result);
        }
        else {
            return error.commonError({
                location: 'user',
                param: 'email',
                message: `Email ${params.email} already exists`,
            });
        }
    }

    async update(params: UserDTO): Promise<Result> {
        await this.checkUser.checkExitsUser({
            id: params.id,
            email: params.email,
        });

        const user = await this.UserRepository.findOne({
            where: { id: params.id },
        });

        if (user) {
            await this.UserRepository.update(params.id, params);
            return success.ok('Update successfully');
        }
        else {
            return error.commonError({
                location: 'user',
                message: 'User not found',
            });
        }
    }

    async deleted(params: { ids: string[] }): Promise<Result> {
        for (const item of params.ids) {
            const user = await this.UserRepository.findOne({
                where: {
                    id: item,
                    is_active: true,
                },
            });

            if (user) {
                await this.UserRepository.softDelete(item);
            }
            else {
                return error.commonError({
                    location: 'user',
                    message: 'User not found',
                });
            }
        }

        return success.ok('Deleted successfully');
    }

    async uploadAvatar(params: { id: string; avatar: string }) {
        await this.UserRepository.update(params.id, { avatar: params.avatar });
    }

    async genCodeRanDom(id: string) {
        const user = await this.UserRepository.findOne({ where: { id: id } });
        if (user) {
            this.codeRanDom = this.random();
        }
        else {
            return error.notFound({});
        }
    }

    async checkRanDomCode(code: string) {
        if (code === this.codeRanDom) {
            return;
        }
        else {
            return error.commonError({
                location: 'code',
                param: 'code',
                message: `code ${code} wrong`,
            });
        }
    }

    async changePassword(params: changePasswordDTO): Promise<Result> {
        const user = await this.UserRepository.findOne({
            where: {
                id: params.id,
                is_active: true,
            },
        });
        if (user) {
            const checkPass = bcrypt.compareSync(
                params.old_password.toString(),
                user.password,
            );
            if (checkPass) {
                const password = await bcrypt.hash(
                    params.new_password.toString(),
                    10,
                );
                await this.UserRepository.update(params.id, {
                    password: password,
                });
            }
            else {
                return error.commonError({
                    location: 'password',
                    param: 'password',
                    message: 'Password old wrong',
                });
            }
        }
        else {
            return error.commonError({
                location: 'user',
                param: 'id',
                message: 'User not found',
            });
        }

        return success.ok('Change password successfully');
    }
}
