import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

import { StockService } from '@/stock/stock.service';
import { Stock } from '@/stock/entities';
import { UpdateStockDto } from '@/stock/dto';
import { AvailabilityResponse } from '@/stock/interfaces';

describe('StockService', () => {
  let stockService: StockService;
  let queryRunner: QueryRunner;
  let mockRepository: {
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    findOne: jest.Mock;
    findOneByProductIdAndSizeId: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      findOneByProductIdAndSizeId: jest.fn(),
    };

    queryRunner = {
      manager: {
        save: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Stock),
          useValue: mockRepository,
        },
      ],
    }).compile();

    stockService = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(stockService).toBeDefined();
  });

  describe('findOneByProductIdAndSizeId', () => {
    it('should return a Stock if it exists', async () => {
      const mockStock = { id: 1, available_quantity: 10 } as Stock;
      mockRepository.findOne.mockResolvedValue(mockStock);

      const result = await stockService.findOneByProductIdAndSizeId(1, 1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: { id: 1 },
          size: { id: 1 },
        },
      });
      expect(result).toEqual(mockStock);
    });

    it('should throw NotFoundException if it does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        stockService.findOneByProductIdAndSizeId(1, 1),
      ).rejects.toThrow(new NotFoundException('Not found product with size'));

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: { id: 1 },
          size: { id: 1 },
        },
      });
    });
  });

  describe('restoreWithQueryRunner', () => {
    it('should update the available quantity using QueryRunner', async () => {
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      await stockService.restoreWithQueryRunner(queryRunner, 1, 50);

      expect(queryRunner.manager.update).toHaveBeenCalledWith(Stock, 1, {
        available_quantity: 50,
      });
    });
  });

  describe('updateAvailableQuantity', () => {
    it('should update the amount available in the repository', async () => {
      const mockStock = { id: 1, available_quantity: 100 } as Stock;
      mockRepository.findOne.mockResolvedValue(mockStock);

      const dto: UpdateStockDto = { productId: 1, sizeId: 1, quantity: 10 };
      const updatedStock = { ...mockStock, available_quantity: 90 };

      mockRepository.save.mockResolvedValue(updatedStock);

      const result = await stockService.updateAvailableQuantity(dto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: { id: 1 },
          size: { id: 1 },
        },
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...mockStock,
        available_quantity: 90,
      });
      expect(result).toEqual(updatedStock);
    });
  });

  describe('updateAvailableQuantityWithQueryRunner', () => {
    it('should update the available quantity using QueryRunner', async () => {
      const mockStock = { id: 1, available_quantity: 100 } as Stock;
      mockRepository.findOne.mockResolvedValue(mockStock);

      (queryRunner.manager.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const dto: UpdateStockDto = { productId: 1, sizeId: 1, quantity: 10 };
      const updatedStock = { ...mockStock, available_quantity: 90 };

      (queryRunner.manager.save as jest.Mock).mockResolvedValue(updatedStock);

      const result = await stockService.updateAvailableQuantityWithQueryRunner(
        queryRunner,
        dto,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          product: { id: 1 },
          size: { id: 1 },
        },
      });
      expect(queryRunner.manager.save).toHaveBeenCalledWith({
        ...mockStock,
        available_quantity: 90,
      });
      expect(result).toEqual(updatedStock);
    });
  });

  describe('checkStockAvailability', () => {
    it('should return stock availability', async () => {
      const mockStock = { id: 1, available_quantity: 100 } as Stock;
      const mockAvailabilityResponse: AvailabilityResponse = {
        available: true,
      };

      mockRepository.findOne.mockResolvedValue(mockStock);

      const result = await stockService.checkStockAvailability(1, 1, 10);

      expect(result).toEqual(mockAvailabilityResponse);
    });
  });
});
