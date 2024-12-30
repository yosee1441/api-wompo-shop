import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  LoggerService,
  InternalServerErrorException,
  UnprocessableEntityException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { ProductService } from '@/product/product.service';
import { CustomerService } from '@/customer/customer.service';
import { StockService } from '@/stock/stock.service';
import { OrderService } from '@/order/order.service';
import { OrderItemService } from '@/order-item/order-item.service';
import { StatusTransaction } from '@/wompi/utils/enums.util';
import { RequestTypeNames } from '@/request-type/entities';
import { RequestTypeService } from '@/request-type/request-type.service';
import { Transaction } from './entities';
import { CreateTransactionDto } from './dto';
import { WompiService } from '@/wompi/wompi.service';
import { wompiErrorStatusCode } from '@/wompi/utils';
import {
  generateReferenceUseCase,
  generateHashUseCase,
  generateTokenUseCase,
} from './use-cases';
import { envs } from '@/common/config/envs';
import { isInRange } from './utils';
import { calculateTax, convertToCents } from '@/utils';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly wompiService: WompiService,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly requestTypeService: RequestTypeService,
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly stockService: StockService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log(
        'Transaction creation started in dto',
        dto,
        TransactionService.name,
      );

      const customer = await this.customerService.findOne(dto.customerId);
      const product = await this.productService.findOneById(dto.productId);

      const subtotal = product.price * dto.quantity;
      const subtotalInCents = convertToCents(subtotal);
      const taxAmount = calculateTax(subtotal, product.iva);
      const taxAmountInCents = convertToCents(taxAmount);
      const total = subtotalInCents + taxAmountInCents;

      this.logger.log(`Calculated total: ${total}`, TransactionService.name);

      const address = dto?.shippingAddress?.addressLine1 || customer.address;

      const orderEntity = await this.orderService.createWithQueryRunner(
        queryRunner,
        {
          customerId: dto.customerId,
          transactionId: null,
          deliveryAddress: address,
          status: StatusTransaction.PENDING,
          total,
        },
      );

      this.logger.log('Order created:', orderEntity, TransactionService.name);

      const orderItemEntity = await this.orderItemService.createWithQueryRunner(
        queryRunner,
        {
          orderId: orderEntity.id,
          productId: dto.productId,
          quantity: dto.quantity,
          subtotal,
        },
      );

      this.logger.log(
        `Order Item created: ${JSON.stringify(orderItemEntity)}`,
        TransactionService.name,
      );

      const isStockAvailability =
        await this.stockService.checkStockAvailability(
          dto.productId,
          dto.sizeId,
          dto.quantity,
        );
      this.logger.log(
        `Check stock availability: ${isStockAvailability.available}`,
        TransactionService.name,
      );

      if (!isStockAvailability.available) {
        throw new BadRequestException('Stock not available');
      }

      await this.stockService.updateAvailableQuantityWithQueryRunner(
        queryRunner,
        {
          productId: dto.productId,
          sizeId: dto.sizeId,
          quantity: dto.quantity,
        },
      );
      const reference = generateReferenceUseCase();
      this.logger.log(
        `Generated reference: ${reference}`,
        TransactionService.name,
      );

      const requestType = await this.requestTypeService.findOneByName(
        RequestTypeNames.PURCHASE,
      );
      this.logger.log(`requestType:`, requestType, TransactionService.name);

      const transactionEntity = this.transactionRepository.create({
        customer: { id: dto.customerId },
        reference_number: reference,
        requestType: { id: requestType.id },
        paymentResponse: {},
      });

      const transaction = await queryRunner.manager.save(transactionEntity);
      this.logger.log(
        `Transaction entity saved: ${JSON.stringify(transaction)}`,
        TransactionService.name,
      );

      const tokenResponse = await generateTokenUseCase(this.wompiService, {
        cardNumber: dto.cardNumber,
        cardHolder: dto.cardHolder,
        expMonth: dto.expMonth,
        cvc: dto.cvc,
        expYear: dto.expYear,
      }).catch((error) => {
        this.logger.error(
          `Token generated response error: `,
          error,
          TransactionService.name,
        );
        if (isInRange(error.response.status, 400, 499)) {
          throw new BadRequestException(error.response.statusText);
        }
        throw new InternalServerErrorException('An unexpected error occurred');
      });

      this.logger.log(
        `Token generated: ${JSON.stringify(tokenResponse)}`,
        TransactionService.name,
      );

      const signature = generateHashUseCase({
        transactionReference: reference,
        amountInCents: total,
        currency: dto.currency,
        integritySecret: envs.apiKeyIntegrityWompo,
      });

      this.logger.log(
        `Signature generated:`,
        signature,
        TransactionService.name,
      );

      const phoneNumber = dto?.customerData?.phoneNumber || customer.phone;
      const response = await this.wompiService
        .createTransaction({
          acceptanceToken: dto.acceptanceToken,
          acceptPersonalAuth: dto.acceptPersonalAuth,
          amountInCents: total,
          currency: dto.currency,
          customerEmail: dto?.customerEmail || customer.email,
          reference,
          signature,
          paymentMethod: {
            type: dto.paymentMethod.type,
            token: tokenResponse.data.id,
            installments: dto.paymentMethod.installments,
          },
          taxes: [
            {
              type: 'VAT',
              amountInCents: taxAmountInCents,
            },
          ],
          customerData: {
            phoneNumber,
            fullName: dto?.customerData?.fullName || customer.name,
            legalId: dto?.customerData?.legalId || customer.legalId,
            legalIdType: dto?.customerData?.legalIdType || customer.legalIdType,
          },
          shippingAddress: {
            addressLine1: address,
            country: dto?.shippingAddress?.country || customer.country,
            region: dto?.shippingAddress?.region || customer.region,
            city: dto?.shippingAddress?.city || customer.city,
            phoneNumber,
          },
          redirectUrl: dto.redirectUrl,
        })
        .catch((error) => {
          this.logger.error(
            'Transaction response error',
            error,
            TransactionService.name,
          );
          const errorsMapping = {
            [wompiErrorStatusCode.INVALID_ACCESS_TOKEN]: (typeErrorMessage) =>
              new UnauthorizedException(typeErrorMessage),
            [wompiErrorStatusCode.NOT_FOUND_ERROR]: (typeErrorMessage) =>
              new NotFoundException(typeErrorMessage),
            [wompiErrorStatusCode.INPUT_VALIDATION_ERROR]: (typeErrorMessage) =>
              new UnprocessableEntityException(typeErrorMessage),
          };

          throw error?.response?.status &&
            errorsMapping[error?.response?.status]
            ? errorsMapping[error?.response?.status](
                error?.response?.data?.error?.type,
              )
            : new InternalServerErrorException('Internal server error');
        });

      this.logger.log(
        `Transaction response: `,
        response,
        TransactionService.name,
      );

      await this.orderService.updateTransactionIdWithQueryRunner(
        queryRunner,
        orderEntity.id,
        {
          transactionId: transaction.id,
        },
      );

      await queryRunner.manager.update(Transaction, transaction.id, {
        paymentResponse: {
          ...response,
          items: [
            {
              sizeId: dto.sizeId,
              productId: dto.productId,
            },
          ],
        },
      });

      await queryRunner.commitTransaction();

      this.logger.log(
        'Transaction successfully completed',
        TransactionService.name,
      );

      return {
        order_item_id: orderItemEntity.id,
        order_id: orderEntity.id,
        payment_id: response.data.id,
        order: orderEntity,
        order_item: orderItemEntity,
        product: product,
      };
    } catch (error) {
      this.logger.error(
        'Error occurred during transaction',
        error,
        TransactionService.name,
      );
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.logger.log(
        'Transaction resources released',
        TransactionService.name,
      );
    }
  }

  getMerchants() {
    return this.wompiService.getMerchants();
  }
}
