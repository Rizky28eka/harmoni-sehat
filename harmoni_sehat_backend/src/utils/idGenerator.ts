import { AppError } from './AppError';

export const generateCustomId = (prefix: string, length: number = 10): string => {
  if (prefix.length !== 2) {
    throw new AppError('Prefix must be 2 characters long', 500);
  }
  const randomDigitsLength = length - prefix.length;
  const randomDigits = Math.floor(Math.random() * Math.pow(10, randomDigitsLength))
    .toString()
    .padStart(randomDigitsLength, '0');
  return `${prefix}${randomDigits}`;
};
