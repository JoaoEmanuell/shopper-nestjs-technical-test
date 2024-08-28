// base

export const badRequestSchema = {
  type: 'object',
  properties: {
    error_code: { type: 'string' },
    error_description: { type: 'string' },
  },
};

export const badRequestInvalidMeasureType = {
  error_code: 'INVALID_TYPE',
  error_description: 'Tipo de medição não permitida',
};

export const badRequestInvalidMeasureTypeWithSummary = {
  summary: `Invalid type - Measure type is not 'WATER' or 'GAS'`,
  value: badRequestInvalidMeasureType,
};

export const conflictDoubleReportResponse = {
  error_code: 'DOUBLE_REPORT',
  error_description: 'Leitura do mês já realizada',
};

export const measureNotFoundResponse = {
  error_code: 'MEASURES_NOT_FOUND',
  error_description: 'Nenhuma leitura encontrada',
};

// upload

export const OkUploadResponse = {
  image_url: 'url to image saved in api',
  measure_value: 'measurement value extracted from the image',
  measure_uuid: 'uuid generated for measure',
};

export const badRequestUploadInvalidBase64Response = {
  summary: 'Invalid Data - Base64 Error',
  value: {
    error_code: 'INVALID_DATA',
    error_description: 'Image is not a base64 encoded',
  },
};

export const badRequestUploadInvalidImageResponse = {
  summary: 'Invalid Data - Image Error',
  value: {
    error_code: 'INVALID_DATA',
    error_description: 'Invalid image',
  },
};

// confirm

export const confirmOkResponse = {
  success: true,
};

// list

export const listOkResponse = {
  customer_code: 'string with customer code',
  measures: [
    {
      measure_uuid: 'string',
      measure_datetime: 'datetime',
      measure_type: 'string',
      has_confirmed: 'boolean',
      image_url: 'string',
    },
  ],
};
