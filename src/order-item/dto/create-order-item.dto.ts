import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty({ message: 'orderId is required' })
  @Min(1, { message: 'orderId must be a positive integer' })
  orderId: number;

  @IsInt()
  @IsNotEmpty({ message: 'productId is required' })
  @Min(1, { message: 'productId must be a positive integer' })
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  @Max(99999999.99, { message: 'subtotal must not exceed 99999999.99' })
  subtotal: number;
}
