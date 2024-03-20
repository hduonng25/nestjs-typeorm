import { ConsoleLogger, Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
    private logger: Logger;

    constructor(context: string) {
        super();
    }

    error(message: any, trace?: string, context?: string) {
        return this.logger.error(this.context, message);
    }

    warn(message: any, context?: string) {
        return this.logger.warn(this.context, message);
    }

    log(message: any, context?: string) {
        return this.logger.log(this.context, message);
    }

    debug(message: any, context?: string) {
        return this.logger.debug(this.context, message);
    }

    verbose(message: any, context?: string) {
        return this.logger.verbose(this.context, message);
    }
}
