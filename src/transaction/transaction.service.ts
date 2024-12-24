import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

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
      const isStockAvailability =
        await this.stockService.checkStockAvailability(
          dto.productId,
          dto.sizeId,
          dto.quantity,
        );

      if (!isStockAvailability) {
        throw new BadRequestException('Stock not available');
      }

      const tokenResponse = await generateTokenUseCase(this.wompiService, {
        cardNumber: dto.cardNumber,
        cardHolder: dto.cardHolder,
        expMonth: dto.expMonth,
        cvc: dto.cvc,
        expYear: dto.expYear,
      });

      const reference = generateReferenceUseCase();
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

      const requestType = await this.requestTypeService.findOneByName(
        RequestTypeNames.PURCHASE,
      );

      const transactionEntity = this.transactionRepository.create({
        customer: { id: dto.customerId },
        reference_number: reference,
        requestType: { id: requestType.id },
        paymentResponse: response.data,
      });

      const transaction =
        await this.transactionRepository.save(transactionEntity);

      const orderEntity = await this.orderService.create({
        customerId: dto.customerId,
        transactionId: transaction.id,
        deliveryAddress: '',
        status: OrderStatus.PENDING,
        total: dto.amountInCents * dto.quantity,
      });

      await this.orderItemService.create({
        orderId: orderEntity.id,
        productId: dto.productId,
        quantity: dto.quantity,
        subtotal:
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
