import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { Request } from 'express';
import { HttpsStatus } from '../../common/constant';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //TODO: Su dung role nhan vao tu @Roles(['']) ben phia controller
        const roles = this.reflector.get(Roles, context.getHandler()); //TODO: Lấy roles từ @Roles[]

        //TODO: Nếu không được đánh dấu là Role nào thì tiếp tục chạy
        if (!roles) {
            return true;
        }

        //TODO: Nếu được đánh dấu thì lấy roles ở req.payload và bắt đầu so sánh
        const request = context.switchToHttp().getRequest() as Request;
        const user = request.payload;

        //TODO: Lấy role từ user trong payload, check xem có trùng với router được đánh dấu ỏ mỗi đầu Router handle hay không
        //TODO: Sử dụng some để xem có ít nhất 1 quyền nằm trong số quyền router handle yêu cầu hay không
        const hasRequiredRole = roles.some((role: string) =>
            user.roles[0].includes(role),
        );

        //TODO: Nếu không có thì trả ra ngoại lệ
        if (!hasRequiredRole) {
            throw new HttpException('Roles bad', HttpsStatus.BAD_REQUEST);
        }

        return true;
    }
}
//Su dung de check xem roles nguoi dung dang dang nhap co roles nao trung voi mang duoc khai bao o ben controller khong
//Neu co tra ve true va tiep tuc, neu khong tra ra loi
