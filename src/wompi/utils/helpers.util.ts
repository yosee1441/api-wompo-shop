import { REGEX_SNAKE_CASE, REGEX_SNAKE_CASE_WITH_NUMBER } from './regex.util';

export function camelizeKeys<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => camelizeKeys(item)) as unknown as T;
  } else if (data !== null && typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, char) =>
        char.toUpperCase(),
      );
      (acc as any)[camelCaseKey] = camelizeKeys(value);
      return acc;
    }, {}) as T;
  }
  return data;
}

export function decamelizeKeys<T>(data: T): T {
  if (typeof data !== 'object' || data === null) return data;

  const newdData: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    const newKey = key
      .replace(REGEX_SNAKE_CASE, '$1_$2')
      .replace(REGEX_SNAKE_CASE_WITH_NUMBER, '$1_$2')
      .toLowerCase();
    newdData[newKey] = decamelizeKeys(value);
  }

  return newdData;
}
