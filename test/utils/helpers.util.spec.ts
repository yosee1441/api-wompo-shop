import {
  sha256,
  convertToCOP,
  calculateTax,
  convertToCents,
  exchangeRate,
  taxRate,
} from '@/utils/helpers.util';

describe('Helper Functions', () => {
  describe('sha256', () => {
    it('should return a SHA256 hash of the given content', () => {
      const content =
        'sk8-438k4-xmxm392-sn2m2490000COPprod_integrity_Z5mMke9x0k8gpErbDqwrJXMqsI6SFli6';
      const expectedHash =
        '37c8407747e595535433ef8f6a811d853cd943046624a0ec04662b17bbf33bf5';
      expect(sha256(content)).toBe(expectedHash);
    });
  });

  describe('convertToCOP', () => {
    it('should convert USD to COP using the exchange rate', () => {
      const priceInUSD = 100;
      const expectedCOP = priceInUSD * exchangeRate;
      expect(convertToCOP(priceInUSD)).toBe(expectedCOP);
    });

    it('should return 0 if the price in USD is 0', () => {
      expect(convertToCOP(0)).toBe(0);
    });
  });

  describe('calculateTax', () => {
    it('should calculate the tax for a given product price and tax rate', () => {
      const productPrice = 100000;
      const expectedTax = Math.round((productPrice * taxRate) / 100);
      expect(calculateTax(productPrice, taxRate)).toBe(expectedTax);
    });

    it('should return 0 if the product price is 0', () => {
      expect(calculateTax(0, 19)).toBe(0);
    });
  });

  describe('convertToCents', () => {
    it('should convert COP to cents', () => {
      const priceInCOP = 5000.5;
      const expectedCents = Math.round(priceInCOP * 100);
      expect(convertToCents(priceInCOP)).toBe(expectedCents);
    });

    it('should return 0 if the price in COP is 0', () => {
      expect(convertToCents(0)).toBe(0);
    });
  });
});
