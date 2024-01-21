/* eslint-disable prettier/prettier */
import { Controller, HttpCode, HttpStatus, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseImage } from './dto/responseImage.dto';
import { UploadService } from "./upload.service";
import { AuthGuard } from "src/modules/auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { storageConfig } from "src/common/upload";
import { extname } from "path";
import { fileMessage } from "src/enums";

@ApiTags('Upload')
@Controller("upload")
export class UploadController {
    constructor(private uploadService: UploadService) { }
    @Post('image')
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('img', {
        storage: storageConfig('img'),
        fileFilter: (req, file, cb) => {
            const ext = extname(file.originalname);
            const allowedExtArr = ['.jpg', '.png', '.jpeg']
            if (!allowedExtArr.includes(ext)) {
                req.fileValidationError = `Wrong file extension. Accepted file ext are :${allowedExtArr.toString()}.`
                cb(null, false)
            } else {
                const fileSize = parseInt(req.header['content-length'])
                // file > 5MB
                if (fileSize > 1024 * 1024 * 5) {
                    req.fileValidationError = 'File size is too large. Accepted file size is less than 5MB'
                    cb(null, false)
                } else {
                    cb(null, true)
                }
            }
        }
    }))
    // @UseGuards(AuthGuard)
    uploadImage(@Req() req: any, @UploadedFile() file: Express.Multer.File): ResponseImage {
        const response = new ResponseImage()
        if (req.fileValidationError) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, req.fileValidationError)
        }
        else if (!file) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, fileMessage.fileRequire)
        } else {
            response.setSuccess(HttpStatus.OK, fileMessage.uploadSuccess, `localhost:${process.env.SERVER_PORT}/img/${file.filename}`)
        }
        return response
    }
}