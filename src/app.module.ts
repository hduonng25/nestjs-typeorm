import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { withCache } from './configs';

@Module({
    imports: [UserModule, TypeOrmModule.forRoot(withCache)],
    controllers: [],
    providers: [],
})
export class AppModule {}
