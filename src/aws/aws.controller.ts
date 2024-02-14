import { Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Express } from 'express';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image-upload')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
    @Res() response,
  ) {
    try{
      return this.awsService.uploadImage(file);
    } catch (error) {
      return response.status(400).json({ message: 'Error uploading image' });
    }
  }
}
