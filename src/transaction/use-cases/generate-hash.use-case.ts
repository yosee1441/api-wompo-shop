import { createHmac } from 'crypto';

interface Options {
  transactionReference: string;
  amountInCents: number;
  currency: string;
  integritySecret: string;
}

export const generateHashUseCase = (options: Options): string => {
  const { integritySecret, transactionReference, amountInCents, currency } =
    options;
  return createHmac('sha256', integritySecret)
    .update(
      `${transactionReference}${amountInCents}${currency}${integritySecret}`,
    )
    .digest('hex');
};
