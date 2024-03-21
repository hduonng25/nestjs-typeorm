import { ResultError } from '../result';
import { HttpException } from '@nestjs/common';
import { HttpsStatus } from '/common';

export interface ErrorData {
    errorCode: string;
    description: {
        en: string;
        vi: string;
    };
}

export class HttpError extends HttpException {
    constructor(public error: ResultError) {
        super({ ...error } ?? { error: error }, HttpsStatus.BAD_REQUEST);
    }
}
