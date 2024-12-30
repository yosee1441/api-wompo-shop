export enum wompiErrorStatusCode {
  INVALID_ACCESS_TOKEN = 401,
  NOT_FOUND_ERROR = 404,
  INPUT_VALIDATION_ERROR = 422,
}

export enum StatusTransaction {
  PENDING = 'PENDING',
  DECLINED = 'DECLINED',
  ERROR = 'ERROR',
  APPROVED = 'APPROVED',
  VOIDED = 'VOIDED',
}
