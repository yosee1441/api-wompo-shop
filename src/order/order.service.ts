import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Order } from './entities';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto) {
    const orderEntity = this.orderRepository.create({
      transaction: { id: dto.transactionId },
      customer: { id: dto.customerId },
      total: dto.total,
      status: dto.status,
      delivery_address: dto.deliveryAddress,
      delivery_date: new Date(),
    });
    return await this.orderRepository.save(orderEntity);
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, dto: UpdateOrderDto) {
    return { test: `This action updates a #${id} order`, dto };
  }
}
