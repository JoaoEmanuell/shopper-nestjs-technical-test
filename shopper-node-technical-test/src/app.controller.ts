import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam } from '@nestjs/swagger';
import { ConfirmDto, ListCustomerDto, UploadDto } from './app.dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @HttpCode(200)
  async uploadPhoto(@Body() body: UploadDto) {
    return this.appService.uploadPhoto(body);
  }

  @Patch('confirm')
  confirm(@Body() body: ConfirmDto) {
    return this.appService.confirm(body);
  }

  @Get(':customer_code/list')
  @ApiParam({
    name: 'customer_code',
    description: 'code of customer',
    type: 'string',
  })
  listCustomer(@Param() params: any, @Query() query: ListCustomerDto) {
    return this.appService.listCustomer(
      params.customer_code,
      query.measure_type,
    );
  }
}
