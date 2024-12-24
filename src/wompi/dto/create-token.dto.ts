import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { REGEX_FORMAT_CSV } from '@/wompi/utils';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  @Length(16, 16)
  cardNumber: string;

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
}
