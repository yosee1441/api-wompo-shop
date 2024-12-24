import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities';
import { CreateOrderItemDto } from './dto/create-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create({
      order: { id: dto.orderId },
      product: { id: dto.productId },
      quantity: dto.quantity,
      subtotal: dto.subtotal,
    });
    return await this.orderItemRepository.save(orderItem);
  }
}
