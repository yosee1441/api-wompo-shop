export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const expMonthTransform = ({ value }) => {
  const paddedValue = value.padStart(2, '0');
  const numValue = Number(paddedValue);
  if (numValue < 1 || numValue > 12) {
    throw new Error('expMonth must be between 01 and 12');
  }
  return paddedValue;
};

export const expYearTransform = ({ value }) => {
  const paddedValue = String(value).padStart(2, '0');
  const numValue = Number(paddedValue);
  const currentYearLastTwoDigits = new Date().getFullYear() % 100;
  if (numValue < currentYearLastTwoDigits || numValue > 99) {
    throw new Error(
      'expYear must be between the last 2 digits of the current year and 99',
    );
  }
  return paddedValue;
};
