// import { Repository } from 'typeorm';
// import { FindReqBody } from '../interface';
// import { Result, success } from '../result';
// import { Injectable } from '@nestjs/common';

import { FindReqBody } from '../interface';
import { Result } from '../result';

// @Injectable()
// export abstract class BaseService<T> {
//     protected constructor(private readonly genericRepository: Repository<T>) {}

//     async findAll(params: FindReqBody): Promise<Result> {
//         const page = params.page > 0 ? params.page : 1;
//         const size = params.size > 0 ? params.size : 10;
//         const skip = (page - 1) * size;

//         const filter: any = {
//             where: {
//                 is_deleted: false,
//             },
//             take: size,
//             skip: skip,
//             order: { created_date: 'DESC' },
//         };

//         const [result, total] =
//             await this.genericRepository.findAndCount(filter);

//         const totalPage = Math.ceil(total / size);

//         return success.ok({
//             page: page,
//             size: size,
//             total: total,
//             totalPage: totalPage,
//             result,
//         });
//     }
// }

export abstract class BaseService<T> {
    abstract findAll(params: FindReqBody): Promise<Result>;

    abstract create(dto: T | Partial<T>): Promise<Result>;

    abstract update(dto: T | Partial<T>): Promise<Result>;

    abstract deleted(dto: T | Partial<T>): Promise<Result>;
}
