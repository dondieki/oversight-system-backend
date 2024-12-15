import { v2 as cloudinary } from 'cloudinary';
import { FactoryProvider } from '@nestjs/common';

export const CloudinaryProvider: FactoryProvider = {
  provide: 'Cloudinary',
  useFactory: (): typeof cloudinary => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    return cloudinary;
  },
};
