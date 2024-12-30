import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import {
  merchantResponseSchema,
  transactionResponseSchema,
} from './swagger/schemas';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/transactions')
  @ApiOperation({
    summary: 'Creation transactions',
  })
  @ApiResponse({
    status: 201,
    description: 'Successful Response',
    schema: {
      example: transactionResponseSchema,
    },
  })
  createTransaction(@Body() dto: CreateTransactionDto) {
    const response = this.transactionService.createTransaction(dto);
    return response;
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
