import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { existsSync, readFileSync, unlinkSync } from 'fs';
import { ConfirmDto, UploadDto } from './app.dtos';
import { Request } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measure } from './app.entity';

describe('AppController', () => {
  let appController: AppController;
  const fakeRequestObject = {
    protocol: 'http',
    get(_: string) {
      // used to get the host
      return 'localhost:8080';
    },
  };
  const customer_code = 'test_customer_code';
  const measure_type = 'water';
  let firstTest = true;

  beforeEach(async () => {
    const pathToTestDb = './src/database/db_test.sqlite';
    if (firstTest && existsSync(pathToTestDb)) {
      // delete the test db if first test
      unlinkSync(pathToTestDb);
    }
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: pathToTestDb,
          entities: [Measure],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Measure]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  describe('full test', () => {
    let measureUUID: string;
    let measureValue: number;
    it('upload photo', async () => {
      const image = readFileSync('./test/files/hidrometro-1.jpg').toString(
        'base64',
      ); // image encoded as base64
      const data = {
        customer_code: customer_code,
        image: image,
        measure_datetime: new Date(),
        measure_type: measure_type,
      } as UploadDto; // data for send to controller
      const result = await appController.uploadPhoto(
        data,
        fakeRequestObject as Request,
      );
      expect(result).toHaveProperty('measure_uuid');
      expect(result).toHaveProperty('image_url');
      expect(result).toHaveProperty('measure_value');
      measureUUID = result.measure_uuid;
      measureValue = result.measure_value;
      firstTest = false;
    }, 15000); // 15 seconds
    it('confirm test', async () => {
      const data = {
        measure_uuid: measureUUID,
        confirmed_value: measureValue,
      } as ConfirmDto;
      const result = await appController.confirm(data);
      expect(result).toHaveProperty('success');
    });
    it('list customer', async () => {
      const result = await appController.listCustomer(
        {
          customer_code: customer_code,
        },
        {
          measure_type: measure_type,
        },
        fakeRequestObject as Request,
      );
      expect(result).toHaveProperty('customer_code');
      expect(result['customer_code']).toEqual(customer_code);
      expect(result).toHaveProperty('measures');
    });
  });
});
