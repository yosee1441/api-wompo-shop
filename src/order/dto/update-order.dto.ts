import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsInt()
  @IsNotEmpty({ message: 'transactionId is required' })
  @Min(1, { message: 'transactionId must be a positive integer' })
  transactionId: number;
}
