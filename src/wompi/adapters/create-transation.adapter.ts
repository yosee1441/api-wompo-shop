import { camelizeKeys, decamelizeKeys } from '@/wompi/utils';

export function createTransactionReponseAdapter<T>(data: T): T {
  return camelizeKeys<T>(data);
}

export function createTransactionRequestAdapter<T>(data: T): T {
  return decamelizeKeys(data) as T;
}
