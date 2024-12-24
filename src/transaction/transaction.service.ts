import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductService } from '@/product/product.service';
import { StockService } from '@/stock/stock.service';
import { OrderService } from '@/order/order.service';
import { OrderItemService } from '@/order-item/order-item.service';
import { OrderStatus } from '@/order/entities';
import { RequestTypeNames } from '@/request-type/entities';
import { RequestTypeService } from '@/request-type/request-type.service';
import { Transaction } from './entities';
import { CreateTransactionDto } from './dto';
import { WompiService } from '@/wompi/wompi.service';
import {
  generateReferenceUseCase,
  generateHashUseCase,
  generateTokenUseCase,
} from './use-cases';
import { envs } from '@/common/config/envs';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly wompiService: WompiService,
    private readonly productService: ProductService,
    private readonly requestTypeService: RequestTypeService,
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly stockService: StockService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productService.findOneById(dto.productId);
      const subtotal = product.price * dto.quantity;
      const total = subtotal * (product.iva + 1);

      const orderEntity = await this.orderService.create({
        customerId: dto.customerId,
        transactionId: null,
        deliveryAddress: '',
        status: OrderStatus.PENDING,
        total,
      });

      await this.orderItemService.create({
        orderId: orderEntity.id,
        productId: dto.productId,
        quantity: dto.quantity,
        subtotal: subtotal,
      });

      const isStockAvailability =
        await this.stockService.checkStockAvailability(
          dto.productId,
          dto.sizeId,
          dto.quantity,
        );

      if (!isStockAvailability) {
        throw new BadRequestException('Stock not available');
      }

      await this.stockService.updateAvailableQuantity({
        productId: dto.productId,
        sizeId: dto.sizeId,
        quantity: dto.quantity,
      });

      const reference = generateReferenceUseCase();
      const requestType = await this.requestTypeService.findOneByName(
        RequestTypeNames.PURCHASE,
      );

      const transactionEntity = this.transactionRepository.create({
        customer: { id: dto.customerId },
        reference_number: reference,
        requestType: { id: requestType.id },
        paymentResponse: {},
      });

      const transaction =
        await this.transactionRepository.save(transactionEntity);

      const tokenResponse = await generateTokenUseCase(this.wompiService, {
        cardNumber: dto.cardNumber,
        cardHolder: dto.cardHolder,
        expMonth: dto.expMonth,
        cvc: dto.cvc,
        expYear: dto.expYear,
      });

      const signature = generateHashUseCase({
        transactionReference: reference,
        amountInCents: dto.amountInCents * dto.quantity,
        currency: dto.currency,
        integritySecret: envs.apiKeyIntegrityWompo,
      });

      const response = await this.wompiService.createTransaction({
        acceptanceToken: dto.acceptanceToken,
        acceptPersonalAuth: dto.acceptPersonalAuth,
        amountInCents: dto.amountInCents * dto.quantity,
        currency: dto.currency,
        customerEmail: dto.customerEmail,
        reference,
        signature,
        paymentMethod: {
          type: 'card',
          token: tokenResponse.data.id,
          installments: dto.paymentMethod.installments,
        },
        redirectUrl: dto.redirectUrl,
      });

      await this.orderService.updateTransactionId(orderEntity.id, {
        transactionId: transaction.id,
      });

      const updatedTransaction = await this.transactionRepository.findOne({
        where: { id: transaction.id },
      });

      await this.transactionRepository.save({
        ...updatedTransaction,
        paymentResponse: response,
      });

      await queryRunner.commitTransaction();

      return response;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  getMerchants() {
    return this.wompiService.getMerchants();
  }
}
