import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultError, error } from '../result';
import { HttpsStatus } from '/common';
import errorList, { ErrorData } from '../error';
import { mask } from '../mask';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const request: Request = ctx.getRequest<Request>();
        const status: HttpStatus = exception.getStatus();
        const environment = 'dev' || 'pro';

        let result: any;

        let resultError = exception.getResponse() as ResultError;

        if (environment === 'pro' && resultError.status === HttpsStatus.METHOD_NOT_ALLOWED) {
            resultError = error.urlNotFound(request.path);
        }

        let { lang } = request.headers;
        lang = lang ?? 'vi';
        const error_code: string = resultError.code;
        const err = errorList.find((value: ErrorData) => value.errorCode === error_code);

        let description: string | undefined = undefined;

        if (resultError.description?.vi && lang === 'vi') {
            description = resultError.description.vi;
        }
        if (resultError.description?.en && lang === 'en') {
            description = resultError.description.en;
        }

        if (!description && err && err.description) {
            if (err.description.vi && lang === 'vi') {
                description = err.description.vi;
            }
            if (err.description.en && lang === 'en') {
                description = err.description.en;
            }
        }

        result = {
            code: error_code,
            description: description,
            ...resultError,
        };

        if (environment === 'dev') {
            result['errors'] = resultError.errors;
        }

        if (result !== null && result !== undefined) {
            //Kiem tra tiep xem respone data co phai la 1 ham khong
            if (typeof result.toJSON === 'function') {
                //Neu la 1 ham thi chuyen thanh doi tuong json
                result = result.toJSON();
            }
        }

        const maskedResponseData = {
            result,
        };

        mask(maskedResponseData, ['password', 'access_token', 'refresh_token']);
        const requestBody = JSON.parse(JSON.stringify(request.body));
        mask(requestBody, ['password', 'access_token', 'refresh_token']);

        response.status(status).json(result);
    }
}
