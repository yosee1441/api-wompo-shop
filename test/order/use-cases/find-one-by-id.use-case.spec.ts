import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { findOneByIdUseCase } from '@/order/use-cases';
import { Order } from '@/order/entities';
import { StatusTransaction } from '@/wompi/utils/enums.util';

const mockRepository = () => ({
  findOne: jest.fn(),
});

describe('findOneByIdUseCase', () => {
  let orderRepository: jest.Mocked<Repository<Order>>;

  beforeEach(() => {
    orderRepository = mockRepository() as unknown as jest.Mocked<
      Repository<Order>
    >;
  });

  it('should return an order when it exists', async () => {
    const mockOrder = {
      id: 1,
      transaction: { id: 1 },
      customer: { id: 1 },
      status: StatusTransaction.PENDING,
      delivery_date: new Date(),
      deliveryAddress: 'Address 1',
      total: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Order;
    orderRepository.findOne.mockResolvedValue(mockOrder);

    const result = await findOneByIdUseCase(orderRepository, { id: 1 });

    expect(result).toEqual(mockOrder);
    expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw a NotFoundException when the order does not exist', async () => {
    (orderRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      findOneByIdUseCase(orderRepository, { id: 1 }),
    ).rejects.toThrow(new NotFoundException('Not found order'));
  });
});
