import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {

    }

    @Post('login')
    async login(@Body() body: LoginDTO) {
        return this.AuthService.login(body);
    }

    @Post('refresh-token')
    async refreshToken(@Headers('refreshToken') refreshToken: string) {
        return this.AuthService.refreshToken(refreshToken);
    }
}
