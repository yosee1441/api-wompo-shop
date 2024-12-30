import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Stock } from '@/stock/entities';
import { findStockByProductAndSizeUseCase } from '@/stock/use-cases/find-by-product-and-size.use-case';

describe('findStockByProductAndSizeUseCase', () => {
  let mockStockRepository: Partial<Repository<Stock>>;

  beforeEach(() => {
    mockStockRepository = {
      findOne: jest.fn(),
    };
  });

  it('should return stock when a product with the given size is found', async () => {
    const productId = 1;
    const sizeId = 2;
    const mockStock = {
      id: 1,
      product: { id: productId },
      size: { id: sizeId },
    } as Stock;

    (mockStockRepository.findOne as jest.Mock).mockResolvedValue(mockStock);

    const result = await findStockByProductAndSizeUseCase(
      mockStockRepository as Repository<Stock>,
      { productId, sizeId },
    );

    expect(result).toEqual(mockStock);
    expect(mockStockRepository.findOne).toHaveBeenCalledWith({
      where: {
        product: { id: productId },
        size: { id: sizeId },
      },
    });
  });

  it('should throw NotFoundException when no stock is found', async () => {
    const productId = 1;
    const sizeId = 2;

    (mockStockRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      findStockByProductAndSizeUseCase(
        mockStockRepository as Repository<Stock>,
        { productId, sizeId },
      ),
    ).rejects.toThrow(NotFoundException);

    expect(mockStockRepository.findOne).toHaveBeenCalledWith({
      where: {
        product: { id: productId },
        size: { id: sizeId },
      },
    });
  });

  it('should throw NotFoundException when the stock object does not contain an ID', async () => {
    const productId = 1;
    const sizeId = 2;

    (mockStockRepository.findOne as jest.Mock).mockResolvedValue({} as Stock);

    await expect(
      findStockByProductAndSizeUseCase(
        mockStockRepository as Repository<Stock>,
        { productId, sizeId },
      ),
    ).rejects.toThrow(NotFoundException);

    expect(mockStockRepository.findOne).toHaveBeenCalledWith({
      where: {
        product: { id: productId },
        size: { id: sizeId },
      },
    });
  });
});
