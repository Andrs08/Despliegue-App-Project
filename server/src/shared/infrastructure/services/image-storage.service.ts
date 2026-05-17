import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { IImageStorageService } from '../../../shared/domain/repositories/image.repository.interface';
import 'dotenv/config';

@Injectable()
export class CloudinaryStorageService implements IImageStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadImage(file: any, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: `${folder}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );

      upload.end(file.buffer);
    });
  }

  async deleteImage(url: string): Promise<void> {
    const matches =
      url.match(/\/v\d+\/(.+)\.[a-z]+$/i) ||
      url.match(/\/upload\/(.+)\.[a-z]+$/i);
    if (!matches || matches.length < 2) return;

    const publicId = matches[1];
    await cloudinary.uploader.destroy(publicId);
  }
}
