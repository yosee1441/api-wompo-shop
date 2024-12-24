import { IsDecimal, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { OrderStatus } from '@/order/entities';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty({ message: 'transactionId is required' })
  @Min(1, { message: 'transactionId must be a positive integer' })
  transactionId: number;

  @IsInt()
  @IsNotEmpty({ message: 'customerId is required' })
  @Min(1, { message: 'customerId must be a positive integer' })
  customerId: number;

  @IsString()
  @IsNotEmpty()
  status: OrderStatus;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsDecimal()
  total: number;
}
