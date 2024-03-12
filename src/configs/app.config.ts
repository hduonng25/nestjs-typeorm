import 'dotenv/config';
import * as process from 'process';

export const configs = {
    app: {
        prefix: process.env.PREFIX || '/api/v1',
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT,
    },

    keys: {
        private_key: process.env.PRIVATE_KEY || '',
        public_key: process.env.PUBLIC_KEY || '',
    },

    jwt: {
        expiresIn: process.env.EXPIRES_IN,
        algorithm: process.env.ALGORITHM || 'RS256',
        expire_at: process.env.EXPIRE_AT || '3600',
    },

    login: {
        number_of_tired: process.env.NUMBER_OF_TIRED,
    },

    main: {
        body_parser_json_limit: process.env.BODY_PARSER_JSON_LIMIT,
        validation_pipe_tranfrom: process.env.VALIDATION_PIPE_TRANSFORM,
    },

    auth: {
        lock_time: process.env.LOCK_TIME,
    },

    exclude: {
        auth: {
            login: process.env.AUTH_LOGIN_EXCLUDE,
            refresh_token: process.env.AUTH_REFRESH_EXCLUDE,
        },
        user: {
            create: process.env.USER_CREATE_EXCLUDE,
        },
    },
};
