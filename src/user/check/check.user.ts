import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { HttpsStatus } from '../../common/constant';

@Injectable()
export class checkUser {
    constructor(
        @InjectRepository(UserEntity)
        protected readonly UserRepository: Repository<UserEntity>,
    ) {}

    public async checkExitsUser(params: { id?: string; email?: string }) {
        const where = {
            email: params.email,
            is_deleted: false,
            is_active: true,
        };

        const user = await this.UserRepository.findOne({ where });

        if (user && user.id !== params.id) {
            throw new HttpException(
                'Email is readly exits',
                HttpsStatus.BAD_REQUEST,
            );
        }
        return;
    }
}
