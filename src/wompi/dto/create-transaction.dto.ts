import {
  IsNotEmpty,
  IsString,
  Matches,
  IsNumber,
  Min,
  IsEmail,
  ValidateNested,
  IsObject,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { REGEX_FORMAT_REFERENCE, REGEX_FORMAT_SIGNATURE } from '@/wompi/utils';

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

class TaxesDto {
  @IsString()
  @IsNotEmpty()
  type: string = 'VAT';

  @IsNumber()
  @Min(1)
  amountInCents: number;
}

class CustomerDataDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  legalId: string;

  @IsString()
  @IsNotEmpty()
  legalIdType: string;
}

class ShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  region: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class CreateTransactionDto {
  @IsUrl()
  @IsNotEmpty()
  redirectUrl: string;

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

  @IsString()
  @Matches(REGEX_FORMAT_SIGNATURE, {
    message:
      'The signature must be a valid SHA256 hash (64 hexadecimal characters)',
  })
  signature: string;

  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @IsString()
  @Matches(REGEX_FORMAT_REFERENCE, {
    message:
      'The reference must be in the format TRX-YYYYMMDD-XXXX1234 (e.g., TRX-20241220-ABCD1234)',
  })
  reference: string;

  @ValidateNested()
  @IsObject()
  @Type(() => PaymentMethodDto)
  paymentMethod: PaymentMethodDto;

  @ValidateNested()
  @IsObject()
  @Type(() => TaxesDto)
  taxes: TaxesDto[];

  @ValidateNested()
  @IsObject()
  @Type(() => CustomerDataDto)
  customerData: CustomerDataDto;

  @ValidateNested()
  @IsObject()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
