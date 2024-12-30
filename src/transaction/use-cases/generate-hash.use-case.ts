import { sha256 } from '@/utils';

interface Options {
  transactionReference: string;
  amountInCents: number;
  currency: string;
  integritySecret: string;
}

export const generateHashUseCase = (options: Options): string => {
  const { integritySecret, transactionReference, amountInCents, currency } =
    options;
  return sha256(
    `${transactionReference}${amountInCents}${currency}${integritySecret}`,
  );
  // return sha256(
  //   'sk8-438k4-xmxm392-sn2m2490000COPprod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6',
  // );
};
