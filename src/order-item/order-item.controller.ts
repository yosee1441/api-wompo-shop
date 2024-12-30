import { Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { OrderItemService } from './order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Patch(':paymentTransactionId')
  @ApiOperation({
    summary: 'Get find merchants',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    schema: {
      example: {},
    },
  })
  findOneByPaymentTransactionId(
    @Param('paymentTransactionId') paymentTransactionId: string,
  ) {
    return this.orderItemService.findOneByPaymentTransactionId(
      paymentTransactionId,
    );
  }
}
