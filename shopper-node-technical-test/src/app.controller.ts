import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ConfirmDto, ListCustomerDto, UploadDto } from './app.dtos';
import { Request } from 'express';
import {
  badRequestInvalidMeasureType,
  badRequestInvalidMeasureTypeWithSummary,
  badRequestSchema,
  badRequestUploadInvalidBase64Response,
  badRequestUploadInvalidImageResponse,
  confirmOkResponse,
  conflictDoubleReportResponse,
  listOkResponse,
  measureNotFoundResponse,
  OkUploadResponse,
} from './app.responses';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Ok response',
    schema: {
      example: OkUploadResponse,
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    content: {
      'application/json': {
        schema: badRequestSchema,
        examples: {
          example1: badRequestUploadInvalidBase64Response,
          example2: badRequestUploadInvalidImageResponse,
          example3: badRequestInvalidMeasureTypeWithSummary,
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict to upload a measure',
    schema: {
      example: conflictDoubleReportResponse,
    },
  })
  async uploadPhoto(@Body() body: UploadDto, @Req() request: Request) {
    return this.appService.uploadPhoto(body, request);
  }

  @Patch('confirm')
  @ApiOkResponse({
    description: 'Ok response',
    schema: {
      example: confirmOkResponse,
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    schema: {
      example: {
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Leitura do mês já realizada',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict to confirm measure',
    schema: {
      example: conflictDoubleReportResponse,
    },
  })
  confirm(@Body() body: ConfirmDto) {
    return this.appService.confirm(body);
  }

  @Get(':customer_code/list')
  @ApiParam({
    name: 'customer_code',
    description: 'code of customer',
    type: 'string',
  })
  @ApiOkResponse({
    description: 'Ok response',
    schema: {
      example: listOkResponse,
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    schema: {
      example: badRequestInvalidMeasureType,
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found',
    schema: {
      example: measureNotFoundResponse,
    },
  })
  listCustomer(
    @Param() params: any,
    @Query() query: ListCustomerDto,
    @Req() request: Request,
  ) {
    return this.appService.listCustomer(
      params.customer_code,
      query.measure_type,
      request,
    );
  }
}
