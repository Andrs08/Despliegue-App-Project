export interface IImageStorageService {
  uploadImage(file: any, folder: string): Promise<string>;
  deleteImage(url: string): Promise<void>;
}
