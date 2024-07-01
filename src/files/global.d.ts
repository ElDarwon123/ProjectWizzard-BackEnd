declare namespace Express {
  export interface MulterFile {
    originalname: string;
    mimetype: string;
    size: number;
    filename: string;
    path: string;
  }
}
