const generateSegment = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join('');
};

export const generateReferenceUseCase = (): string => {
  return `sk8-${generateSegment(5)}-${generateSegment(7)}-${generateSegment(4)}`;
};
