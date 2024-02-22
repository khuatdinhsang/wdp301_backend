/* eslint-disable prettier/prettier */
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseImage } from './dto/responseImage.dto';
import { UploadService } from './upload.service';
import { AuthGuardUser } from 'src/modules/auth/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/upload';
import { extname } from 'path';
import { fileMessage } from 'src/enums';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('file')
  @UseGuards(AuthGuardUser)
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    type: () => ResponseImage,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageConfig('file'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = [
          '.jpg',
          '.png',
          '.jpeg',
          '.pdf',
          '.doc',
          '.txt',
          '.rtf',
          '.mov',
          '.mp4',
        ];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong file extension. Accepted file ext are :${allowedExtArr.toString()}.`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.header['content-length']);
          // file > 5MB
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError =
              'File size is too large. Accepted file size is less than 5MB';
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  async uploadImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseImage> {
    const response = new ResponseImage();
    if (req.fileValidationError) {
      response.setError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        req.fileValidationError,
      );
    } else if (!file) {
      response.setError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        fileMessage.fileRequire,
      );
    } else {
      response.setSuccess(
        HttpStatus.OK,
        fileMessage.uploadSuccess,
        `localhost:${process.env.SERVER_PORT}/file/${file.filename}`,
      );
    }
    return response;
  }

  @Post('files')
  @UseGuards(AuthGuardUser)
  @HttpCode(200)
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'file',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    type: () => ResponseImage,
  })
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: storageConfig('file'),
    }),
  )
  async uploadMultipleFile(
    @Req() req: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('abs', files);
    const response = new ResponseImage();
    const stringsUrl = [];
    for (let i = 0; i < files.length; i++) {
      stringsUrl.push(
        `localhost:${process.env.SERVER_PORT}/file/${files[i].filename}`,
      );
    }
    if (req.fileValidationError) {
      response.setError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        req.fileValidationError,
      );
    } else if (!files) {
      response.setError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        fileMessage.fileRequire,
      );
    } else {
      response.setSuccess(HttpStatus.OK, fileMessage.uploadSuccess, stringsUrl);
    }
    return response;
  }
}
