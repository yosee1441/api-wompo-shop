import { IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  id: number;
}
