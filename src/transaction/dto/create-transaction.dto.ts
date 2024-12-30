import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  registerDecorator,
  ValidateNested,
  ValidationOptions,
  IsPhoneNumber,
} from 'class-validator';
import {
  REGEX_FORMAT_CSV,
  REGEX_FORMAT_MASTERCARD,
  REGEX_FORMAT_VISA,
} from '@/transaction/utils/regex.util';
import {
  expMonthTransform,
  expYearTransform,
} from '@/transaction/utils/helpers.util';

class PaymentMethodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(12)
  installments: number;
}

class CustomerDataDto {
  @ApiPropertyOptional({
    description: 'Número de teléfono asociado a la dirección de envío.',
    example: '573109990001',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('CO', {
    message: 'El número de teléfono no es válido para Colombia.',
  })
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(6, 10, {
    message: 'La identificación legal debe tener entre 6 y 10 dígitos.',
  })
  legalId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  legalIdType?: string;
}

class ShippingAddressDto {
  @ApiPropertyOptional({
    description: 'Línea de dirección principal.',
    example: 'Calle 34 # 56 - 78',
  })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiPropertyOptional({
    description: 'Código del país (ISO 3166-1 alpha-2).',
    example: 'CO',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Región o departamento.',
    example: 'Cundinamarca',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Ciudad.',
    example: 'Bogotá',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono asociado a la dirección de envío.',
    example: '573109990001',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('CO', {
    message: 'El número de teléfono no es válido para Colombia.',
  })
  phoneNumber?: string;
}

function IsVisaOrMasterCard(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVisaOrMasterCard',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            (REGEX_FORMAT_MASTERCARD.test(value) ||
              REGEX_FORMAT_VISA.test(value))
          );
        },
        defaultMessage() {
          return `El número de tarjeta debe ser una tarjeta válida Visa o Mastercard.`;
        },
      },
    });
  };
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(20)
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'customerId is required' })
  @Min(1, { message: 'customerId must be a positive integer' })
  customerId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'productId is required' })
  @Min(1, { message: 'productId must be a positive integer' })
  productId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty({ message: 'sizeId is required' })
  @Min(1, { message: 'sizeId must be a positive integer' })
  sizeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  @IsVisaOrMasterCard({
    message: 'El número de tarjeta debe ser válido para Visa o Mastercard',
  })
  cardNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  redirectUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Transform(expMonthTransform)
  expMonth: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  @Transform(expYearTransform)
  expYear: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 4)
  @Matches(REGEX_FORMAT_CSV, {
    message: 'El CVC debe tener 3 o 4 dígitos numéricos',
  })
  cvc: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  acceptanceToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  acceptPersonalAuth: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  @IsNotEmpty()
  customerEmail?: string;

  @ApiProperty()
  @ValidateNested()
  @IsObject()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @ApiPropertyOptional({
    description: 'Información del cliente.',
  })
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => CustomerDataDto)
  customerData?: CustomerDataDto;

  @ApiPropertyOptional({
    description: 'Dirección de envío.',
  })
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ShippingAddressDto)
  shippingAddress?: ShippingAddressDto;
}
