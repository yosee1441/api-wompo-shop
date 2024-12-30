import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Order } from '@/order/entities';

interface Options {
  id: number;
}

export const findOneByIdUseCase = async (
  orderRepository: Repository<Order>,
  options: Options,
) => {
  const { id } = options;
  const response = await orderRepository.findOne({ where: { id } });
  if (!response) {
    throw new NotFoundException('Not found order');
  }

  return response;
};
