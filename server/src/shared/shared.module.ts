import { Global, Module } from '@nestjs/common';
import { CloudinaryStorageService } from './infrastructure/services/image-storage.service';

@Global()
@Module({
  providers: [
    { provide: 'IImageStorageService', useClass: CloudinaryStorageService },
  ],
  exports: ['IImageStorageService'],
})
export class SharedModule {}
