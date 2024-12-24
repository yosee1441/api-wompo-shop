import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @IsNotEmpty({ message: 'productId is required' })
  @Min(1, { message: 'productId must be a positive integer' })
  productId: number;

  @IsInt()
  @IsNotEmpty({ message: 'sizeId is required' })
  @Min(1, { message: 'sizeId must be a positive integer' })
  sizeId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
