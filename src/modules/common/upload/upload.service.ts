/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 } from 'uuid';

@Injectable({})
export class UploadService {
    async uploadOneObject(file: Express.Multer.File): Promise<string> {
        const uploadFolder = path.join(__dirname, '..', 'file');
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadFolder, fileName);
    
        if (!fs.existsSync(uploadFolder)) {
          fs.mkdirSync(uploadFolder, { recursive: true });
        }
        fs.writeFileSync(filePath, file.buffer);
    
        return fileName;
      }

}
