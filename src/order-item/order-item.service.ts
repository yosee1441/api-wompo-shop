import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { OrderItem } from './entities';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { findOneByPaymentTransactionIdUseCase } from '@/order-item/use-cases';
import { WompiService } from '@/wompi/wompi.service';
import { StatusTransaction } from '@/wompi/utils/enums.util';
import { OrderService } from '@/order/order.service';
import { StockService } from '@/stock/stock.service';
import { Order } from '@/order/entities';
import { Stock } from '@/stock/entities';
import { Transaction } from '@/transaction/entities';

@Injectable()
export class OrderItemService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly wompiService: WompiService,
    private readonly orderService: OrderService,
    private readonly stockService: StockService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

  async createWithQueryRunner(
    queryRunner: QueryRunner,
    dto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItemEntity = this.orderItemRepository.create({
      order: { id: dto.orderId },
      product: { id: dto.productId },
      quantity: dto.quantity,
      subtotal: dto.subtotal,
    });
    return await queryRunner.manager.save(orderItemEntity);
  }

  async findOneByPaymentTransactionId(paymentTransactionId: string) {
    this.logger.log(
      `Finding order item by payment transaction ID: ${paymentTransactionId}`,
      OrderItemService.name,
    );
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction =
        await this.wompiService.findOneById(paymentTransactionId);

      if (!transaction?.data?.id) {
        this.logger.warn(
          `Transaction not found: ${paymentTransactionId}`,
          OrderItemService.name,
        );
        throw new NotFoundException('Not found transaction');
      }

      const checkOrderItem = await findOneByPaymentTransactionIdUseCase(
        this.orderItemRepository,
        { paymentTransactionId },
      );

      this.logger.log(
        `Order item retrieved: ${JSON.stringify(checkOrderItem)}`,
        OrderItemService.name,
      );

      const checkOrderStatus =
        checkOrderItem?.order?.status === StatusTransaction.APPROVED ||
        checkOrderItem?.order?.status === StatusTransaction.DECLINED ||
        checkOrderItem?.order?.status === StatusTransaction.ERROR ||
        checkOrderItem?.order?.status === StatusTransaction.VOIDED;

      if (checkOrderStatus) {
        this.logger.log(
          `Order item already has final status: ${checkOrderItem?.order?.status}`,
          OrderItemService.name,
        );
        return checkOrderItem;
      }

      const checkPaymentTransactionStatus =
        transaction.data.status === StatusTransaction.DECLINED ||
        transaction.data.status === StatusTransaction.ERROR ||
        transaction.data.status === StatusTransaction.VOIDED;

      if (checkPaymentTransactionStatus) {
        await this.orderService.findOne(checkOrderItem.order.id);
        await queryRunner.manager.update(Order, checkOrderItem.order.id, {
          status: transaction.data.status as StatusTransaction,
        });

        const items =
          checkOrderItem?.order?.transaction?.paymentResponse?.items || [];

        await queryRunner.manager.update(
          Transaction,
          checkOrderItem.order.transaction.id,
          {
            paymentResponse: {
              ...transaction,
              items,
            },
          },
        );

        for (const item of items) {
          const stock = await this.stockService.findOneByProductIdAndSizeId(
            item.productId,
            item.sizeId,
          );

          const availableQuantity =
            stock.available_quantity + checkOrderItem.quantity;

          await queryRunner.manager.update(Stock, stock.id, {
            available_quantity: availableQuantity,
          });

          this.logger.log(
            `Stock updated: ${stock.id}, available quantity: ${availableQuantity}`,
            OrderItemService.name,
          );
        }
      }
      if (transaction.data.status === StatusTransaction.APPROVED) {
        await this.orderService.updateWithQueryRunner(
          queryRunner,
          checkOrderItem.order.id,
          {
            status: StatusTransaction.APPROVED,
          },
        );

        this.logger.log(
          `Order approved: ${checkOrderItem.order.id}`,
          OrderItemService.name,
        );
      }

      await queryRunner.commitTransaction();

      return await findOneByPaymentTransactionIdUseCase(
        this.orderItemRepository,
        { paymentTransactionId },
      );
    } catch (error) {
      this.logger.error(
        'Error occurred during order item',
        error,
        OrderItemService.name,
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.log('Order item resources released', OrderItemService.name);
    }
  }
}
