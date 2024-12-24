import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { REGEX_FORMAT_CSV } from '@/transaction/utils/regex.util';

class PaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty({ message: 'customerId is required' })
  @Min(1, { message: 'customerId must be a positive integer' })
  customerId: number;

  @IsInt()
  @IsNotEmpty({ message: 'productId is required' })
  @Min(1, { message: 'productId must be a positive integer' })
  productId: number;

  @IsInt()
  @IsNotEmpty({ message: 'sizeId is required' })
  @Min(1, { message: 'sizeId must be a positive integer' })
  sizeId: number;

  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  cardNumber: string;

  @IsUrl()
  @IsNotEmpty()
  redirectUrl: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Transform(({ value }) => value.padStart(2, '0'))
  @Min(1)
  @Max(12)
  expMonth: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Transform(({ value }) => Number(value))
  @Min(new Date().getFullYear() % 100)
  @Max(99)
  expYear: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  @Matches(REGEX_FORMAT_CSV, {
    message: 'El CVC debe tener 3 o 4 dígitos numéricos',
  })
  cvc: string;

  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @IsString()
  @IsNotEmpty()
  acceptanceToken: string;

  @IsString()
  @IsNotEmpty()
  acceptPersonalAuth: string;

  @IsNumber()
  @Min(1)
  amountInCents: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ValidateNested()
  @IsObject()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;
}
