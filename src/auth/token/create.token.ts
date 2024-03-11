import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../dto';
import { configs } from '../../configs';
import { HttpsStatus } from '../../common/constant';

const private_key = configs.keys.private_key;

@Injectable()
export class Token {
    constructor(private readonly jwtService: JwtService) {
    }

    public async genAccessToken(payload: Omit<Payload, 'type'>): Promise<{
        token: string;
        expireAt: number;
    }> {
        try {
            const timestampInSec = new Date().getDate() / 1000;
            const expireAt = Math.floor(timestampInSec + 60 * 60);
            const token = this.jwtService.sign(
                {
                    ...payload,
                    type: 'ACCESS_TOKEN',
                },
                { privateKey: private_key },
            );

            return { token, expireAt };
        } catch (e) {
            throw new HttpException(
                'Failed to generate access token',
                HttpsStatus.BAD_REQUEST,
            );
        }
    }

    public async ganRefreshToken(id: string): Promise<{
        token: string;
        expireAt: number;
    }> {
        try {
            const timestampInSec = new Date().getDate() / 1000;
            const expireAt = Math.floor(timestampInSec + 60 * 60);

            const token = this.jwtService.sign(
                { id, type: 'REFRESH_TOKEN' },
                { privateKey: private_key },
            );

            return { token, expireAt };
        } catch (e) {
            throw new HttpException(
                'Failed to generate access token',
                HttpsStatus.BAD_REQUEST,
            );
        }
    }
}
