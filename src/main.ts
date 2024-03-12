import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configs } from './configs';
import { Logger, ValidationPipe } from '@nestjs/common';

async function main() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['debug', 'error', 'fatal', 'verbose', 'warn'],
    });
    const host = configs.app.host;
    const port = configs.app.port;
    const prefix = configs.app.prefix;

    app.setGlobalPrefix(prefix), {
        exclude: ['/'],
    };

    app.useGlobalPipes(
        new ValidationPipe({ transform: process.env.VALIDATION_PIPE_TRANSFORM === 'true' }),
    );

    app.useBodyParser('json', { limit: configs.main.body_parser_json_limit });

    await app.listen(port, host, () => {
        Logger.verbose(`Listening on: ${host}:${port}`);
    });
}

main();
