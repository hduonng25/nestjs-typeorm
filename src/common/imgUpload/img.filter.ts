import { extname } from 'path';
import { FileEnum } from '../enum/image.enum';
import { Request } from 'express';

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
        if (fileSize > 1024 * 1024 * 5) {
            req.validateFile = `Wrong extention type. Accepted file ext are: ${FileEnum}`;
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
}
