import crypto from 'crypto';

export const generateReferenceUseCase = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TRX-${date}-${randomString}`;
};
