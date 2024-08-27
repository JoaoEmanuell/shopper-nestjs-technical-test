/**
 * construct a message for IsNotEmpty validator
 * @param field name of the field
 * @returns object with message
 */
export const isNotEmptyValidationOptions = (field: string) => {
  return { message: `${field} não pode ser vazio` };
};
