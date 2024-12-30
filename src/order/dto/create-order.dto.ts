import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { StatusTransaction } from '@/wompi/utils/enums.util';

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
  status: StatusTransaction;

  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @IsDecimal()
  @Max(99999999.99, { message: 'total must not exceed 99999999.99' })
  total: number;
}
