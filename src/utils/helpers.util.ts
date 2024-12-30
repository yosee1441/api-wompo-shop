import { createHash } from 'crypto';

export const exchangeRate = 4000;
export const taxRate = 0.19;

/**
 * Returns a SHA256 hash using SHA-2 for the given `content`.
 * * @see https://en.wikipedia.org/wiki/SHA-2
 * * @param {String} content
 * * @returns {String}
 */
export const sha256 = (content: string) => {
  return createHash('sha256').update(content).digest('hex');
};

/**
 * Convierte el precio en dólares a pesos colombianos.
 * @param {number} priceInUSD - El precio en dólares.
 * @returns {number} - El precio convertido a pesos colombianos.
 */
export function convertToCOP(priceInUSD: number): number {
  return priceInUSD * exchangeRate;
}

/**
 * Calcula el IVA dado un precio base sin impuestos.
 * @param {number} base - La base sin impuestos en COP.
 * @returns {number} - El IVA en COP.
 */
export function calculateTax(productPrice: number, taxRate: number): number {
  return Math.round((productPrice * taxRate) / 100);
}

/**
 * Convierte el precio total en pesos a centavos.
 * @param {number} priceInCOP - El precio total en COP.
 * @returns {number} - El precio total en centavos.
 */
export function convertToCents(priceInCOP: number): number {
  return Math.round(priceInCOP * 100);
}
