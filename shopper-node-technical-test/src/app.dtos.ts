import { ApiProperty } from '@nestjs/swagger';
import {
  IsBase64,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export type measureType = 'water' | 'gas';

export class ListCustomerDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  measure_type: measureType;
}

export class UploadDto {
  @ApiProperty({ nullable: false })
  @IsBase64()
  image: string;
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  customer_code: string;
  @ApiProperty({ nullable: false })
  @IsDateString()
  @IsNotEmpty()
  measure_datetime: Date;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    nullable: false,
  })
  measure_type: measureType;
}

export class ConfirmDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  measure_uuid: string;
  @IsNumber()
  @IsNotEmpty()
  confirmed_value: number;
}
