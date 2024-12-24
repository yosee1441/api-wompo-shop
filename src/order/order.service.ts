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

  async findOne(id: number): Promise<Order> {
    return this.orderRepository.findOne({ where: { id } });
  }

  async updateTransactionId(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    return await this.orderRepository.save({
      ...order,
      transaction: { id: dto.transactionId },
    });
  }
}
