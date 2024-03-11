import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {
    }

    @Post()
    private login(@Body() body: LoginDTO) {
        return this.AuthService.login(body);
    }
}
