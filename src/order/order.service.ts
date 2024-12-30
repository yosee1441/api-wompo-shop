import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Order } from './entities';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { findOneByIdUseCase } from './use-cases';

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
      deliveryAddress: dto.deliveryAddress,
      delivery_date: new Date(),
    });
    return await this.orderRepository.save(orderEntity);
  }

  async createWithQueryRunner(queryRunner: QueryRunner, dto: CreateOrderDto) {
    const orderEntity = this.orderRepository.create({
      transaction: { id: dto.transactionId },
      customer: { id: dto.customerId },
      total: dto.total,
      status: dto.status,
      deliveryAddress: dto.deliveryAddress,
      delivery_date: new Date(),
    });
    return await queryRunner.manager.save(orderEntity);
  }

  async findOne(id: number): Promise<Order> {
    return await findOneByIdUseCase(this.orderRepository, { id });
  }

  async updateTransactionIdWithQueryRunner(
    queryRunner: QueryRunner,
    id: number,
    dto: UpdateOrderDto,
  ) {
    return await queryRunner.manager.update(Order, id, {
      transaction: { id: dto.transactionId },
    });
  }

  async updateWithQueryRunner(
    queryRunner: QueryRunner,
    id: number,
    dto: UpdateOrderDto,
  ) {
    return await queryRunner.manager.update(Order, id, {
      status: dto.status,
    });
  }
}
