import { HttpException, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../shared/type-orm';
import { UserDTO } from './dto/user.dto';
import { FindReqBody } from '../shared/interface';
import { Result, success, error } from '../shared/result';
import * as bcrypt from 'bcrypt';
import { v1 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { changePasswordDTO } from './dto/change.password.dto';
import { checkUser } from './check/check.user';
import { HttpsStatus } from '../common/constant';

@Injectable()
export class UserService extends BaseService<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
        private readonly checkUser: checkUser,
    ) {
        super();
    }

    async findAll(params: FindReqBody): Promise<Result> {
        const page = params.page > 0 ? params.page : 1;
        const size = params.size > 0 ? params.size : 10;
        const skip = (page - 1) * size;

        const where = {
            is_deleted: false,
        };

        const findManyOptions: FindManyOptions<UserEntity> = {
            where,
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

    async create(params: UserDTO): Promise<Result> {
        try {
            const check = await this.UserRepository.findOne({
                where: {
                    email: params.email,
                    is_deleted: false,
                    is_active: true,
                },
            });

            if (!check) {
                params.id = v1();
                params.password = await bcrypt.hash(params.password.toString(), 10);
                const user = await this.UserRepository.save(params);
                const result = plainToInstance(UserDTO, user, {
                    excludeExtraneousValues: true,
                });
                return success.ok(result);
            } else {
                throw new HttpException(`Email ${params.email} already exists`, HttpsStatus.BAD_REQUEST);
            }
        } catch (e) {
            throw new HttpException(`Email ${params.email} already exists`, HttpsStatus.BAD_REQUEST);
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
        } else {
            return error.commonError({
                location: 'user',
                message: 'User not found',
            });
        }
    }

    async deleted(params: UserDTO): Promise<Result> {
        for (const item of params.ids) {
            const user = await this.UserRepository.findOne({
                where: {
                    id: item,
                    is_deleted: false,
                    is_active: true,
                },
            });

            if (user) {
                await this.UserRepository.update(item, { is_deleted: true });
            } else {
                return error.commonError({
                    location: 'user',
                    message: 'User not found',
                });
            }
        }

        return success.ok('Deleted successfully');
    }

    async changePassword(params: changePasswordDTO): Promise<Result> {
        const user = await this.UserRepository.findOne({
            where: {
                id: params.id,
                is_deleted: false,
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
            } else {
                return error.commonError({
                    location: 'password',
                    param: 'password',
                    message: 'Password old wrong',
                });
            }
        } else {
            return error.commonError({
                location: 'user',
                param: 'id',
                message: 'User not found',
            });
        }

        return success.ok('Change password successfully');
    }
}
