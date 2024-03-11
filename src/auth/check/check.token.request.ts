import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { HttpsStatus } from '../../common/constant';
import { configs } from '../../configs';
import { Payload } from '../dto';

declare module 'express-serve-static-core' {
    interface Request {
        payload?: Payload;
        request_id: string;
        correlation_id?: string;
        requested_time?: number;
        source_hostname?: string;
        source_netname?: string;
    }
} //TODO: Mở rộng phương thức của đối tượng Request

@Injectable()
export class CheckTokenReq implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {
    }

    use(req: Request, _: Response, next: NextFunction) {
        const token: string | undefined = req.header('token');

        if (!token) {
            throw new HttpException('There is no token in the URL', HttpsStatus.BAD_REQUEST);
        }

        try {
            const public_key = configs.keys.public_key;
            let payload = <Payload>this.jwtService.verify(token, {
                publicKey: public_key,
            });

            req.payload = payload;

            const type: string = req.payload.type;

            if (type !== 'ACCESS_TOKEN') {
                throw new HttpException('Your token is not valid', HttpsStatus.BAD_REQUEST);
            }
            next();
        } catch (e) {
            if (e.name && e.name === 'TokenExpiredError') {
                throw new HttpException('Your token expired', HttpsStatus.BAD_REQUEST);
            } else {
                throw new HttpException('Your token is not valid', HttpsStatus.BAD_REQUEST);
            }
        }
    }
}//TODO: Middleware check xem có token truyền vào header của req không và check xem token có hợp lệ hay không