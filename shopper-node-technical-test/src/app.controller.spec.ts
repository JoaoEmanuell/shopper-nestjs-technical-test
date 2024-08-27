import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { readFileSync } from 'fs';
import { UploadDto } from './app.dtos';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('upload photo', () => {
    it('upload photo test', async () => {
      const image = readFileSync('./test/files/hidrometro-1.jpg').toString(
        'base64',
      );
      const data = {
        image: image,
        measure_datetime: new Date(),
        measure_type: 'gas',
      } as UploadDto;
      expect(await appController.uploadPhoto(data)).toStrictEqual(data);
    });
  });

  describe('list customer', () => {
    it('should return the list of customer', async () => {
      const result = ['50', 'gas'];

      expect(
        await appController.listCustomer(
          { customer_code: '50' },
          { measure_type: 'gas' },
        ),
      ).toStrictEqual(result);
    });
  });
});
