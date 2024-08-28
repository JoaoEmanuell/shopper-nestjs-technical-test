import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfirmDto, measureType, UploadDto } from './app.dtos';
import { isBase64 } from 'class-validator';
import { randomUUID, UUID } from 'crypto';
import sharp from 'sharp';
import { GeminiInterface } from './gemini/geminiInterface';
import { Gemini } from './gemini/gemini';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Measure } from './app.entity';
import { Repository } from 'typeorm';
import { getMonthAndYear } from './utils/getMonthAndYear';

@Injectable()
export class AppService {
  private gemini: GeminiInterface;
  constructor(
    @InjectRepository(Measure) private measureRepository: Repository<Measure>,
  ) {
    this.gemini = new Gemini();
  }
  /**
   * upload the photo to gemini api and await the measure value extraction
   * @param body uploadDto
   * @param req request object, used to construct the url to image
   * @returns ``` {
      image_url: string // url to image saved in database
      measure_value: number, // value of measure
      measure_uuid: string, // string with saved uuid of measure
    }```
   */
  async uploadPhoto(body: UploadDto, req: Request) {
    // validate the measure type
    const measureTypeBody = this.validateMeasureType(body.measure_type);

    const dateTime = new Date(body.measure_datetime);

    const monthAndYear = getMonthAndYear(dateTime);

    const savedMeasure = await this.measureRepository.findOneBy({
      monthAndYear: monthAndYear,
      measure_type: measureTypeBody,
      customer_code: body.customer_code,
    });

    if (savedMeasure) {
      // exists a saved measure for this month
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }
    if (!isBase64(body['image'])) {
      // validate if image is a valid base64 encoded
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Image is not a base64 encoded',
      });
    }

    const measureUUID = randomUUID(); // generate the measure uuid
    const imageName = `${measureUUID}.webp`;
    const imagePath = `./src/database/images/${imageName}`; // path to image
    try {
      // save the image in server
      await sharp(Buffer.from(body['image'], 'base64')).toFile(imagePath);
    } catch (err) {
      console.log(err);
      // if error to save image
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'invalid image',
      });
    }

    const imageUrl = `${req.protocol}://${req.get('Host')}/images/${imageName}`; // url to access the image in server

    const geminiResult = await this.gemini.getMeasureValue(
      imagePath,
      measureTypeBody,
    ); // get the gemini result

    const measure = new Measure(); // create a measure and copy the data
    measure.measure_uuid = measureUUID;
    measure.customer_code = body.customer_code;
    measure.image_url = imageName;
    measure.measure_datetime = body.measure_datetime; // save the datetime string
    measure.measure_type = measureTypeBody;
    measure.monthAndYear = getMonthAndYear(dateTime);
    measure.measure_value = geminiResult.measureValue;

    await this.measureRepository.save(measure); // save the measure in database

    return {
      image_url: imageUrl,
      measure_value: geminiResult.measureValue,
      measure_uuid: measureUUID,
    };
  }
  /**
   * confirm the measure or change the value
   * @param body measure_uuid and confirmed_value
   * @throws `NotFoundException` if measure not exists
   * @throws `ConflictException` if measure has confirmed
   * @returns `{success: true}`
   */
  async confirm(body: ConfirmDto) {
    const queryObject = {
      measure_uuid: body.measure_uuid as UUID,
    };
    const savedMeasure = await this.measureRepository.findOneBy(queryObject); // get the saved measure using the uuid provide by user
    if (!savedMeasure) {
      // if not has a measure in database
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura do mês já realizada',
      });
    } else if (
      savedMeasure.has_confirmed &&
      savedMeasure.measure_value === body.confirmed_value // saved value is equals to new value
    ) {
      // if measure has confirmed
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }
    // change the saved measure
    savedMeasure.has_confirmed = true;
    savedMeasure.measure_value = body.confirmed_value;
    await this.measureRepository.update(queryObject, savedMeasure); // update
    return {
      success: true,
    };
  }
  /**
   * list the customer measures
   * @param customer_code customer code provide by user
   * @param measure_type measure type, water or gas
   * @param req request object, used to construct url to image
   * @throws `NotFoundException` case the costumer not has a measures
   * @returns object with costumer code and measures
   */
  async listCustomer(
    customer_code: string,
    measure_type: measureType,
    req: Request,
  ) {
    const measureTypeBody = this.validateMeasureType(measure_type);

    const measures = await this.measureRepository.findBy({
      customer_code: customer_code,
      measure_type: measureTypeBody,
    });
    if (measures.length === 0) {
      // if not has measures
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }
    const formattedMeasures = [];

    await Promise.all(
      measures.map(async (measure) => {
        measure['image_url'] =
          `${req.protocol}://${req.get('Host')}/images/${measure['image_url']}`;
        delete measure['monthAndYear'];
        delete measure['customer_code'];
        delete measure['measure_value']; // remove the keys
        formattedMeasures.push(measure);
      }),
    );
    return {
      customer_code: customer_code,
      measures: formattedMeasures,
    };
  }

  /**
   * remove the spaces and transform to lower case, if string is not valid, return a BadRequestException
   * @param measureType string with measure type
   * @returns measure type
   */
  private validateMeasureType = (measureType: string) => {
    measureType = measureType.trim().toLowerCase();
    if (measureType !== 'gas' && measureType !== 'water') {
      throw new BadRequestException({
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }
    return measureType;
  };
}
