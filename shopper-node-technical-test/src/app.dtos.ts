import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { isNotEmptyValidationOptions } from './utils/validationDto';

export type measureType = 'water' | 'gas';

export class ListCustomerDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty(isNotEmptyValidationOptions('measure_type'))
  measure_type: measureType;
}

export class UploadDto {
  @ApiProperty({ nullable: false })
  @IsBase64()
  @IsNotEmpty(isNotEmptyValidationOptions('image'))
  image: string;
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty(isNotEmptyValidationOptions('customer_code'))
  customer_code: string;
  @ApiProperty({ nullable: false })
  @IsDateString()
  @IsNotEmpty(isNotEmptyValidationOptions('measure_datetime'))
  measure_datetime: Date;
  @IsString()
  @IsNotEmpty(isNotEmptyValidationOptions('measure_type'))
  @ApiProperty({
    nullable: false,
  })
  measure_type: measureType;
}

export class ConfirmDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsUUID()
  @IsNotEmpty(isNotEmptyValidationOptions('measure_uuid'))
  measure_uuid: string;
  @ApiProperty({ nullable: false })
  @IsNumber()
  @IsNotEmpty(isNotEmptyValidationOptions('confirmed_value'))
  @Min(0, {
    message: 'Valor de confirmação da leitura não pode ser inferior a 0',
  })
  confirmed_value: number;
}
