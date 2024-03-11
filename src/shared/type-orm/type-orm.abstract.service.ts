import { FindReqBody } from '../interface';
import { Result } from '../result';

export abstract class BaseService<T> {
    abstract findAll(params: FindReqBody): Promise<Result>;

    abstract create(dto: T | Partial<T>): Promise<Result>;

    abstract update(dto: T | Partial<T>): Promise<Result>;

    abstract deleted(dto: T | Partial<T>): Promise<Result>;
}
