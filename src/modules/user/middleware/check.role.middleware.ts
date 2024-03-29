import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpsStatus, Roles } from '@Common/index';

@Injectable()
export class CheckRolesMiddleware implements NestMiddleware {
    constructor() {}

    use(req: Request, _: Response, next: NextFunction) {
        const roles = [Roles.ADMIN, Roles.SRAFF, Roles.CUSTOMER];
        if (req.body.roles) {
            const invalidRoles = req.body.roles.filter(
                (role: any) => !roles.includes(role),
            );

            if (invalidRoles.length > 0) {
                throw new HttpException(
                    `Quyen khong hop le: ${invalidRoles.join(',')}`,
                    HttpsStatus.BAD_REQUEST,
                );
            }
            return next();
        }
        return next();
    }
}
