import { Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { merchantResponseSchema } from './swagger/schemas';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/transactions')
  createTransaction(dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }

  @Get('/merchants')
  @ApiOperation({
    summary: 'Get find merchants',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    schema: {
      example: merchantResponseSchema,
    },
  })
  getMerchants() {
    return this.transactionService.getMerchants();
  }
}
