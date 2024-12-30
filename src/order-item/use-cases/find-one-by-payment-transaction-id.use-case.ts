import { OrderItem } from '@/order-item/entities';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

interface Options {
  paymentTransactionId: string;
}

export const findOneByPaymentTransactionIdUseCase = async (
  orderItemRepository: Repository<OrderItem>,
  options: Options,
) => {
  const { paymentTransactionId } = options;
  const response = await orderItemRepository
    .createQueryBuilder('orderItem')
    .leftJoinAndSelect('orderItem.order', 'order')
    .leftJoinAndSelect('order.transaction', 'transaction')
    .leftJoinAndSelect('orderItem.product', 'product')
    .where(
      "transaction.payment_response->'data'->>'id' = :paymentTransactionId",
      { paymentTransactionId },
    )
    .getOne();

  if (!response) {
    throw new NotFoundException('Not found order item');
  }

  return response;
};
