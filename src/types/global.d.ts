import * as multer from "multer";

declare namespace Express {
    interface MulterFile extends multer.File{
        originalname: string;
        mimetype: string;
        size: string;
        buffer: Buffer;
        path?: string;
        filename?: string;
    }
}