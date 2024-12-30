import { TransactionResponse } from '@/wompi/interfaces';

export const findOneByIdAdapter = (
  data: TransactionResponse,
): TransactionResponse => {
  if (!data?.data?.status) {
    return data;
  }

  return {
    ...data,
    data: {
      ...data.data,
      status:
        data.data.status.charAt(0).toUpperCase() +
        data.data.status.slice(1).toLowerCase(),
    },
  };
};
