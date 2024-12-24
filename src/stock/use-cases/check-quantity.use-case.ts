import { AvailabilityResponse } from '@/stock/interfaces';
import { Stock } from '@/stock/entities';

export const checkStockQuantityUseCase = (
  stock: Stock,
  requestedQuantity: number,
): AvailabilityResponse => {
  if (stock.available_quantity < requestedQuantity) {
    return { available: false };
  }

  return { available: true };
};
