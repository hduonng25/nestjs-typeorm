import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const type = (process.env.TYPE_CONNECTION as any) || 'mysql';

export const withCache: TypeOrmModuleOptions = {
    type,
    host: process.env.HOST_ORM,
    username:
        type === 'mysql' ? process.env.USER_MYSQL : process.env.USER_POSTGRES,
    password:
        type === 'mysql' ? process.env.PASS_MYSQL : process.env.PASS_POSTGRES,
    database:
        type === 'mysql'
            ? process.env.DB_NAME_MYSQL
            : process.env.DB_NAME_POSTGRES,
    synchronize: true,
    entities: [__dirname, './**/*.entity{.ts,.js}'],
    dropSchema: false,
};
