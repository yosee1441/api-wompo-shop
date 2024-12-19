export interface Pagination<T> {
  results: T;
  meta: Meta;
}

interface Meta {
  total: number;
  page: number;
}
