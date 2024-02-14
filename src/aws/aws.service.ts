import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
require('dotenv').config();

@Injectable()
export class AwsService {
  constructor() {}

  bucketName = process.env.AWS_BUCKET_NAME;
  s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  async uploadImage(image: Express.Multer.File) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ContentType: image.mimetype,
        ACL: 'public-read',
      };

      const { Location } = await this.s3.upload(params).promise();
      return Location;
    } catch (error) {
      console.log(error);
    }
  }
}
