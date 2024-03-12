import { Reflector } from '@nestjs/core';

//TODO: Tạo mới một decorator mới có lên là Roles, sẽ được đánh dấu ở mỗi đầu router handle xem roles nào mới có quyền ở router đó
export const Roles = Reflector.createDecorator<string[]>();
