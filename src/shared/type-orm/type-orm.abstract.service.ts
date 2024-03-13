import { FindReqBody } from '../interface';
import { Result } from '../result';

export abstract class BaseService {
    async findAll(params: FindReqBody): Promise<Result> {
        return Promise.resolve(undefined);
    }

    async create(params: object | Record<string, string>): Promise<Result> {
        return Promise.resolve(undefined);
    }

    async update(params: object | Record<string, string>): Promise<Result> {
        return Promise.resolve(undefined);
    }

    async deleted(params: object | Record<string, string>): Promise<Result> {
        return Promise.resolve(undefined);
    }
}
