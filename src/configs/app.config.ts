import 'dotenv/config';

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
};
