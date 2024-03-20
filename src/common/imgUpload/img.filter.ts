import { extname } from 'path';
import { FileEnum } from '../enum/image.enum';
import { Request } from 'express';
import { configs } from '../../configs';

export function fileFilter(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) {
    const ext = extname(file.originalname);
    if (!FileEnum.includes(ext)) {
        req.validateFile = `Wrong extention type. Accepted file ext are: ${FileEnum}`;
        callback(null, false);
    } else {
        const fileSize = parseInt(req.headers['content-length']);
        if (fileSize > parseInt(configs.file.limit)) {
            req.validateFile = `${configs.file.mess}`;
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
}
