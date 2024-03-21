import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Result, ResultError, ResultSuccess, error } from '../result';
import { HttpsStatus } from '/common';
import { Request, Response } from 'express';
import errorList, { ErrorData } from '../error';
import { mask } from '../mask';

@Injectable()
export class ResultInterceptor implements NestInterceptor<Result> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
        return next.handle().pipe(
            map((data: Result) => {
                //HTTP req, res
                const request: Request = context.switchToHttp().getRequest();
                const response: Response = context.switchToHttp().getResponse();

                //status code
                const statusCode = data.status ?? HttpsStatus.BAD_REQUEST;
                const environment = 'dev' || 'pro';
                let responseData: any;

                //Neu loi
                if (statusCode > 200) {
                    //Khoi tao mot error code ung voi ResultError
                    let resultError = data as ResultError;

                    //Neu environment la production va status la 405 thi tra ve voi not found
                    if (environment === 'pro' && resultError.status === HttpsStatus.METHOD_NOT_ALLOWED) {
                        resultError = error.urlNotFound(request.path);
                    }

                    //Neu khong, tim theo ngon ngu headers truyen vao mac dinh la Viet Nam
                    let { lang } = request.headers;
                    lang = lang ?? 'vi';
                    const error_code = resultError.code ?? 'UNKNOWN_ERROR';

                    //Tim error theo ma loi
                    const err = errorList.find((value: ErrorData) => value.errorCode === error_code);

                    //Khoi tao bien thong bao loi
                    let description: string | undefined = undefined;

                    //Check xem thuoc kieu ngon ngu nao va gan vao thong bao tuong ung
                    if (resultError.description?.vi && lang === 'vi') {
                        description = resultError.description.vi;
                    }
                    if (resultError.description?.en && lang === 'en') {
                        description = resultError.description.en;
                    }

                    //Neu qua 2 buoc tren ma khong duoc gan chi tiet loi thi lay chi tiet tu ma loi tim duoc trong Error.json
                    if (!description && err && err.description) {
                        if (err.description.vi && lang === 'vi') {
                            description = err.description.vi;
                        }

                        if (err.description.en && lang === 'en') {
                            description = err.description.en;
                        }
                    }

                    //Gan du lieu vao responseData
                    responseData = {
                        code: error_code,
                        description: description,
                        details: resultError.details,
                    };

                    //Neu la moi truong dev thi tra ra toan bo loi
                    if (environment === 'dev') {
                        responseData['errors'] = resultError.errors;
                    }
                } else {
                    //Nguoc lai voi status code thanh cong thi gan du lieu theo Result success da cau hinh
                    const resultSuccess = data as ResultSuccess;
                    responseData = resultSuccess.data ?? resultSuccess;
                }

                //Kiem tra xem respone data no null hoac underfined hay khong
                if (responseData !== null && responseData !== undefined) {
                    //Kiem tra tiep xem respone data co phai la 1 ham khong
                    if (typeof responseData.toJSON === 'function') {
                        //Neu la 1 ham thi chuyen thanh doi tuong json
                        responseData = responseData.toJSON();
                    }
                }

                //Khoi tao doi tuong maskedResponseData co du lieu la respone data
                const maskedResponseData = {
                    responseData,
                };

                //An du lieu trong maskedResponseData voi nhung du lieu nhay cam nhu la password, ...
                // mask(maskedResponseData, ['password', 'access_token', 'refresh_token']);
                // const requestBody = JSON.parse(JSON.stringify(request.body));

                //An tiep du lieu trong phan body cua request
                // mask(requestBody, ['password', 'access_token', 'refresh_token']);

                //Cuoi cung tra du lieu ra phia client
                response.status(statusCode).json(responseData);
            }),
        );
    }
}
