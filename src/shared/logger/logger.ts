import { Injectable, LogLevel, Logger, LoggerService } from '@nestjs/common';

@Injectable()
export class MyLogger implements LoggerService {
    log(message: any, ...optionalParams: any[]) {
        Logger.log(message);
    }

    error(message: any, ...optionalParams: any[]) {
        Logger.error(message);
    }

    warn(message: any, ...optionalParams: any[]) {
        Logger.warn(message);
    }

    debug?(message: any, ...optionalParams: any[]) {
        Logger.debug(message);
    }

    verbose?(message: any, ...optionalParams: any[]) {
        Logger.verbose(message);
    }

    fatal?(message: any, ...optionalParams: any[]) {
        Logger.fatal(message);
    }

    setLogLevels?(levels: LogLevel[]) {
        throw new Error('Method not implemented.');
    }
}

export const logger = new MyLogger();
