import { IsNotEmpty, Min } from '@nestjs/class-validator';

export class FindReqBody {
    @IsNotEmpty()
    page: number;

    @IsNotEmpty()
    size: number;

    query: string;
}
