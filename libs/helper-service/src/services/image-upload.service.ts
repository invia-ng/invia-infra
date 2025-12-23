import * as sharp from 'sharp';
import { randomUUID } from 'crypto';
import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileUploadResult } from '../interface';
import { S3UploadService } from './s3-upload.service';
import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common';
import { OptimizedImageType } from 'libs/common/src/constants/enums';
import { sanitizeString } from '@app/common/src/utils/string.utils';

@Injectable()
export class ImageUploadService implements OnModuleInit {
  private cloudinaryConfig: ConfigOptions;

  constructor(
    private s3Service: S3UploadService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.cloudinaryConfig = {
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    };

    cloudinary.config(this.cloudinaryConfig);
  }

  async uploadImageToAws(
    file: Express.Multer.File,
    type: OptimizedImageType,
    fileName?: string,
  ): Promise<FileUploadResult> {
    try {
      const uuid = randomUUID().concat(
        '_',
        sanitizeString(fileName ?? file.originalname),
      );

      const sizeMap: Record<string, { width: number; height?: number }> = {
        small: { width: 512 },
      };

      let uploadResult: FileUploadResult;

      for (const [sizeKey, dimensions] of Object.entries(sizeMap)) {
        const resizedBuffer = await sharp(file.buffer)
          .resize(dimensions.width, dimensions.height, {
            fit: 'contain',
          })
          .jpeg({ mozjpeg: true })
          .toBuffer();

        const versionKey = `versions/${sizeKey}/${uuid}.jpeg`;

        const upload = await this.s3Service.uploadBufferToS3(
          resizedBuffer,
          versionKey,
          file.mimetype,
        );

        uploadResult = {
          url: `${this.configService.get<string>('AWS_CLOUDFRONT_API_ENDPOINT')}/${versionKey}`,
          public_id: upload.Key,
        };
      }

      return uploadResult;
    } catch (error) {
      console.log(`Error uploading image: ${error.message}`);

      throw error;
    }
  }

  async uploadFileToAws(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<FileUploadResult> {
    try {
      const uuid = randomUUID().concat(
        '_',
        sanitizeString(fileName ?? file.originalname),
      );

      let uploadResult: FileUploadResult;

      const versionKey = `versions/original/${uuid}.${file.mimetype.split('/')[1]}`;

      const upload = await this.s3Service.uploadFileToS3(
        file,
        versionKey,
        // file.mimetype,
      );

      uploadResult = {
        url: `${this.configService.get<string>('AWS_CLOUDFRONT_API_ENDPOINT')}/${versionKey}`,
        public_id: upload.Key,
      };

      return uploadResult;
    } catch (error) {
      console.log(`Error uploading image: ${error.message}`);

      throw error;
      // throw new BadGatewayException(`Error uploading image: ${error.message}`);
    }
  }

  async uploadFileToCloudinary(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<any> {
    try {
      const originalName = fileName ?? file.originalname;
      const lastDotIndex = originalName.lastIndexOf('.');

      let nameWithoutExtension: string;
      let extension: string;

      if (lastDotIndex === -1) {
        nameWithoutExtension = originalName;
        // Try to infer extension from mimetype for common types
        if (file.mimetype === 'application/pdf') {
          extension = 'pdf';
        } else if (file.mimetype === 'text/plain') {
          extension = 'txt';
        } else if (file.mimetype.startsWith('image/')) {
          extension = file.mimetype.split('/')[1];
        } else {
          extension = '';
        }
      } else {
        nameWithoutExtension = originalName.substring(0, lastDotIndex);
        extension = originalName.substring(lastDotIndex + 1);
      }

      const uuid = randomUUID().concat(
        '_',
        sanitizeString(nameWithoutExtension),
        extension ? `.${extension}` : '',
      );

       const sizeMap: Record<string, { width: number; height?: number }> = {
        small: { width: 512 },
      };

      let uploadResult: FileUploadResult;

      if (file.mimetype.startsWith('image/')) {
        for (const [sizeKey, dimensions] of Object.entries(sizeMap)) {
          const resizedBuffer = await sharp(file.buffer)
            .resize(dimensions.width, dimensions.height, {
              fit: 'contain',
            })
            .toBuffer();

          const upload = await cloudinary.uploader.upload(
            `data:${file.mimetype};base64,${resizedBuffer.toString('base64')}`,
            {
              folder: 'versions',
              public_id: uuid,
              resource_type: 'image',
            },
          );

          uploadResult = {
            url: upload.secure_url,
            public_id: upload.public_id,
          };
        }
      } else {
        const upload = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'versions',
            public_id: uuid,
            resource_type: 'raw',
          },
        );

        uploadResult = {
          url: upload.secure_url,
          public_id: upload.public_id,
        };
      } return uploadResult;
    } catch (error) {
      console.log(`Error uploading image: ${error.message}`);

      throw error;
      // throw new BadGatewayException(`Error uploading image: ${error.message}`);
    }
  }

  async uploadAwsImage(
    file: Express.Multer.File,
    type: OptimizedImageType,
  ): Promise<FileUploadResult> {
    try {
      const uploadResults = await this.generateFileVersions(file);
      if (type == OptimizedImageType.thumbnail) {
        return uploadResults[0];
      }
      if (type == OptimizedImageType.productImage) {
        return uploadResults[1];
      }
      if (type == OptimizedImageType.coverImage) {
        return uploadResults[1];
      }
      if (type == OptimizedImageType.large) {
        return uploadResults[2];
      }
      return uploadResults[1];
    } catch (error) {
      console.log(`Error uploading image: ${error.message}`);

      throw error;
      // throw new BadGatewayException(`Error uploading image: ${error.message}`);
    }
  }

  async getOptimizedImageUrl(
    key: string,
    bucketName: string,
    type: OptimizedImageType,
  ): Promise<FileUploadResult> {
    // Define image size presets based on the image type
    const sizeMap: Record<
      OptimizedImageType,
      { width: number; height?: number; fit: string }
    > = {
      [OptimizedImageType.thumbnail]: { width: 150, fit: 'contain' },
      [OptimizedImageType.logo]: { width: 300, height: 300, fit: 'cover' },
      [OptimizedImageType.productImage]: { width: 800, fit: 'contain' },
      [OptimizedImageType.coverImage]: { width: 1200, fit: 'contain' },
      [OptimizedImageType.medium]: { width: 600, fit: 'contain' },
      [OptimizedImageType.large]: { width: 1600, fit: 'contain' },
    };
    const { width, height, fit } = sizeMap[type];
    // Sharp transformation config
    const strRequest = JSON.stringify({
      bucket: bucketName,
      key,
      edits: {
        resize: {
          width,
          height,
          fit,
        },
      },
    });

    // encode cloudfront query
    const encRequest = btoa(
      encodeURIComponent(strRequest).replace(
        /%([0-9A-F]{2})/g,
        function (match, p1) {
          return String.fromCharCode(parseInt(p1, 16));
        },
      ),
    );

    return {
      url: `${this.configService.get<string>('IMAGE_CLOUDFRONT_API_ENDPOINT')}/${encRequest}`,
      public_id: key ?? '',
    };
  }

  async generateFileVersions(
    file: Express.Multer.File,
  ): Promise<FileUploadResult[]> {
    const uuid = randomUUID();
    try {
      // Define size presets for generating file versions
      const sizeMap: Record<string, { width: number; height?: number }> = {
        small: { width: 512 },
        medium: { width: 800 },
        large: { width: 1200 },
      };

      const uploadResults: FileUploadResult[] = [];
      // Iterate over the size presets
      for (const [sizeKey, dimensions] of Object.entries(sizeMap)) {
        // Generate resized image buffer
        const resizedBuffer = await sharp(file.buffer)
          .resize(dimensions.width, dimensions.height, {
            fit: 'contain',
          })
          .jpeg({ mozjpeg: true })
          .toBuffer();

        // Create a unique key for the version
        const versionKey = `versions/${sizeKey}/${uuid}.jpeg`;

        // Upload resized image to S3
        const uploadResult = await this.s3Service.uploadBufferToS3(
          resizedBuffer,
          versionKey,
          file.mimetype,
        );

        uploadResults.push({
          url: `${this.configService.get<string>('AWS_CLOUDFRONT_API_ENDPOINT')}/${versionKey}`,
          public_id: uploadResult.Key,
        });
      }

      sharp(file.buffer)
        .jpeg({ mozjpeg: true })
        .toBuffer()
        .then((buffer) => {
          this.s3Service.uploadBufferToS3(
            buffer,
            `versions/original/${uuid}.jpeg`,
            file.mimetype,
          );
        });

      return uploadResults;
    } catch (error) {
      throw new BadGatewayException(
        `Error generating and uploading file versions: ${error.message}`,
      );
    }
  }
}
