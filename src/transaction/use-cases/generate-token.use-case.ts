import { ForbiddenException } from '@nestjs/common';

import { WompiService } from '@/wompi/wompi.service';
import { createTokenStatus } from '@/transaction/utils/enums.util';

interface Options {
  cardNumber: string;
  cardHolder: string;
  expMonth: string;
  cvc: string;
  expYear: string;
}

export const generateTokenUseCase = async (
  wompiService: WompiService,
  options: Options,
) => {
  const response = await wompiService.createToken({
    cardNumber: options.cardNumber,
    cardHolder: options.cardHolder,
    expMonth: options.expMonth,
    cvc: options.cvc,
    expYear: options.expYear,
  });

  if (response.status !== createTokenStatus.CREATED) {
    throw new ForbiddenException('Forbidden');
  }

  return response;
};
