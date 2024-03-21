import { diskStorage } from 'multer';
import { Request } from 'express';

export const StorageConfigs = (folder: string) =>
    diskStorage({
        destination: `upload/${folder}`,
        filename(
            _: Request,
            file: Express.Multer.File,
            callback: (error: Error | null, filename: string) => void,
        ) {
            callback(null, Date.now() + '-' + file.originalname);
        },
    });
