import { Test, TestingModule } from '@nestjs/testing';
import { QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { OrderService } from '@/order/order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '@/order/entities/order.entity';
import { CreateOrderDto } from '@/order/dto/create-order.dto';
import { UpdateOrderDto } from '@/order/dto/update-order.dto';
import { StatusTransaction } from '@/wompi/utils/enums.util';

describe('OrderService', () => {
  let orderService: OrderService;
  let queryRunner: QueryRunner;
  let mockRepository: {
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    queryRunner = {
      manager: {
        save: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('create', () => {
    it('should create and save an order', async () => {
      const createOrderDto: CreateOrderDto = {
        transactionId: 1,
        customerId: 1,
        total: 100,
        status: StatusTransaction.PENDING,
        deliveryAddress: 'Some address',
      };
      const mockOrder = {
        transaction: { id: createOrderDto.transactionId },
        customer: { id: createOrderDto.customerId },
        total: createOrderDto.total,
        status: createOrderDto.status,
        deliveryAddress: createOrderDto.deliveryAddress,
        delivery_date: expect.any(Date),
      };

      mockRepository.create.mockReturnValue(mockOrder);
      mockRepository.save.mockReturnValue(mockOrder);

      const result = await orderService.create(createOrderDto);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction: { id: createOrderDto.transactionId },
          customer: { id: createOrderDto.customerId },
          total: createOrderDto.total,
          status: createOrderDto.status,
          deliveryAddress: createOrderDto.deliveryAddress,
        }),
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('createWithQueryRunner', () => {
    it('should create and save an order using query runner', async () => {
      const createOrderDto: CreateOrderDto = {
        transactionId: 1,
        customerId: 1,
        total: 100,
        status: StatusTransaction.PENDING,
        deliveryAddress: 'Some address',
      };
      const mockOrder = {
        transaction: { id: createOrderDto.transactionId },
        customer: { id: createOrderDto.customerId },
        total: createOrderDto.total,
        status: createOrderDto.status,
        deliveryAddress: createOrderDto.deliveryAddress,
        delivery_date: expect.any(Date),
      };

      mockRepository.create.mockReturnValue(mockOrder);
      (queryRunner.manager.save as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createWithQueryRunner(
        queryRunner,
        createOrderDto,
      );

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction: { id: createOrderDto.transactionId },
          customer: { id: createOrderDto.customerId },
          total: createOrderDto.total,
          status: createOrderDto.status,
          deliveryAddress: createOrderDto.deliveryAddress,
        }),
      );
      expect(queryRunner.manager.save).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('findOne', () => {
    it('should find an order by id', async () => {
      const mockOrder = { id: 1, status: StatusTransaction.PENDING } as Order;
      mockRepository.findOne.mockResolvedValue(mockOrder);

      const result = await orderService.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(orderService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTransactionIdWithQueryRunner', () => {
    it('should update the transaction id using query runner', async () => {
      const updateOrderDto: UpdateOrderDto = { transactionId: 2 };
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await orderService.updateTransactionIdWithQueryRunner(
        queryRunner,
        1,
        updateOrderDto,
      );

      expect(queryRunner.manager.update).toHaveBeenCalledWith(Order, 1, {
        transaction: { id: 2 },
      });
      expect(result).toEqual({ affected: 1 });
    });
  });

  describe('updateWithQueryRunner', () => {
    it('should update the order status using query runner', async () => {
      const updateOrderDto: UpdateOrderDto = {
        status: StatusTransaction.APPROVED,
      };
      (queryRunner.manager.update as jest.Mock).mockResolvedValue({
        affected: 1,
      });

      const result = await orderService.updateWithQueryRunner(
        queryRunner,
        1,
        updateOrderDto,
      );

      expect(queryRunner.manager.update).toHaveBeenCalledWith(Order, 1, {
        status: StatusTransaction.APPROVED,
      });
      expect(result).toEqual({ affected: 1 });
    });
  });
});
