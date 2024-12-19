import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 20;
}
