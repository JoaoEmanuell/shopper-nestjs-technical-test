import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfirmDto, measureType, UploadDto } from './app.dtos';
import { isBase64 } from 'class-validator';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

@Injectable()
export class AppService {
  async uploadPhoto(body: UploadDto) {
    if (!isBase64(body['image'])) {
      // validate if image is a valid base64
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Image is not a base64 encoded',
      });
    }
    const measureUuid = randomUUID();
    try {
      await sharp(Buffer.from(body['image'], 'base64')).toFile(
        `./src/tmp/${measureUuid}.webp`,
      );
    } catch (err) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'invalid image',
      });
    }

    return body;
  }
  async confirm(body: ConfirmDto) {
    return body;
  }
  async listCustomer(customer_code: string, measure_type: measureType) {
    return [customer_code, measure_type];
  }
}
