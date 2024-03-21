import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../dto';
import { configs } from '../../../configs';
import { HttpsStatus } from '@Common/index';

const private_key = configs.keys.private_key;

@Injectable()
export class Token {
    constructor(private readonly jwtService: JwtService) {}

    public async genAccessToken(payload: Omit<Payload, 'type'>): Promise<{
        token: string;
        expireAt: number;
    }> {
        try {
            const timestampInSec = new Date().getDate() / 1000;

            const timeExpire = parseFloat(configs.jwt.expire_at);

            const expireAt = Math.floor(timestampInSec + timeExpire); //Tinh thoi gian het han cua token

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
    } //TODO: Tạo access token với nhưng dữ liệu được truyền vào của user

    public async genRefreshToken(id: string): Promise<{
        token: string;
        expireAt: number;
    }> {
        try {
            const timestampInSec = new Date().getDate() / 1000;
            const timeExpire = parseFloat(configs.jwt.expire_refresh_token_at);
            const expireAt = Math.floor(timestampInSec + timeExpire);

            const token = this.jwtService.sign(
                { id, type: 'REFRESH_TOKEN' },
                { privateKey: private_key, expiresIn: expireAt },
            );

            return { token, expireAt };
        } catch (e) {
            throw new HttpException(
                'Failed to generate access token',
                HttpsStatus.BAD_REQUEST,
            );
        }
    } //TODO: Tạo refresh token theo id của user

    public async getPayload(token: string): Promise<Payload> {
        try {
            const public_key = configs.keys.public_key;
            const payload = <Payload>this.jwtService.verify(token, {
                publicKey: public_key,
            });

            return payload;
        } catch (e) {
            throw new HttpException(
                'Faild gen payload',
                HttpsStatus.INTERNAL_SERVER,
            );
        }
    }
}
