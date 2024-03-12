import { FindReqBody } from '../interface';
import { Result } from '../result';

export abstract class BaseService {
    abstract findAll(params: FindReqBody): Promise<Result>;

    abstract create(params: object | Record<string, string>): Promise<Result>;

    abstract update(params: object | Record<string, string>): Promise<Result>;

    abstract deleted(params: object | Record<string, string>): Promise<Result>;
}
