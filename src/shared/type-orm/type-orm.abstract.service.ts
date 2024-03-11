import { FindReqBody } from '../interface';
import { Result } from '../result';

export abstract class BaseService<T> {
    abstract findAll(params: FindReqBody): Promise<Result>;

    abstract create(params: T | Partial<T>): Promise<Result>;

    abstract update(params: T | Partial<T>): Promise<Result>;

    abstract deleted(params: T | Partial<T>): Promise<Result>;
}
