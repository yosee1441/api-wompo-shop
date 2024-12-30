import { checkStockQuantityUseCase } from '@/stock/use-cases/check-quantity.use-case';
import { Stock } from '@/stock/entities';
import { AvailabilityResponse } from '@/stock/interfaces';

describe('checkStockQuantityUseCase', () => {
  let stock: Stock;

  beforeEach(() => {
    stock = {
      id: 1,
      product: {
        id: 1,
      },
      size: {
        id: 1,
      },
      warehouse: 'Main Warehouse',
      available_quantity: 10,
    } as Stock;
  });

  it('should return { available: true } when the requested quantity is less than the available quantity', () => {
    const requestedQuantity = 5;

    const result: AvailabilityResponse = checkStockQuantityUseCase(
      stock,
      requestedQuantity,
    );

    expect(result).toEqual({ available: true });
  });

  it('should return { available: true } when the requested quantity is equal to the available quantity', () => {
    const requestedQuantity = 10;

    const result: AvailabilityResponse = checkStockQuantityUseCase(
      stock,
      requestedQuantity,
    );

    expect(result).toEqual({ available: true });
  });

  it('should return { available: false } when the requested quantity is greater than the available quantity', () => {
    const requestedQuantity = 15;

    const result: AvailabilityResponse = checkStockQuantityUseCase(
      stock,
      requestedQuantity,
    );

    expect(result).toEqual({ available: false });
  });

  it('should correctly handle a stock with available quantity equal to 0', () => {
    stock.available_quantity = 0;
    const requestedQuantity = 1;

    const result: AvailabilityResponse = checkStockQuantityUseCase(
      stock,
      requestedQuantity,
    );

    expect(result).toEqual({ available: false });
  });

  it('should correctly handle a requested amount equal to 0', () => {
    const requestedQuantity = 0;

    const result: AvailabilityResponse = checkStockQuantityUseCase(
      stock,
      requestedQuantity,
    );

    expect(result).toEqual({ available: true });
  });
});
