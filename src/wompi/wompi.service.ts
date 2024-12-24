import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { envs } from '@/common/config';
import { CreateTokenDto, CreateTransactionDto } from './dto';
import { CreateTokenResponse, MerchantResponse } from './interfaces';

@Injectable()
export class WompiService {
  constructor(private readonly httpService: HttpService) {}

  async createToken(dto: CreateTokenDto): Promise<CreateTokenResponse> {
    const { cardNumber, expMonth, expYear, cvc, cardHolder } = dto;
    const response = await firstValueFrom(
      this.httpService.post<CreateTokenResponse>(
        `${envs.urlBase}/tokens/cards`,
        {
          number: cardNumber,
          cvc,
          exp_month: expMonth,
          exp_year: expYear,
          card_holder: cardHolder,
        },
        {
          headers: {
            Authorization: `Bearer ${envs.apiKeyPubWompo}`,
          },
        },
      ),
    );
    return response.data;
  }

  async createTransaction(
    dto: CreateTransactionDto,
  ): Promise<CreateTokenResponse> {
    const {
      acceptPersonalAuth,
      acceptanceToken,
      amountInCents,
      currency,
      customerEmail,
      reference,
      paymentMethod,
      signature,
    } = dto;
    const response = await firstValueFrom(
      this.httpService.post<CreateTokenResponse>(
        `${envs.urlBase}/tokens/cards`,
        {
          accept_personal_auth: acceptPersonalAuth,
          acceptance_token: acceptanceToken,
          amount_in_cents: amountInCents,
          currency,
          customer_email: customerEmail,
          reference,
          signature,
          payment_method: paymentMethod,
          redirect_url: dto.redirectUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${envs.apiKeyPubWompo}`,
          },
        },
      ),
    );
    return response.data;
  }

  async getMerchants(): Promise<MerchantResponse> {
    const response = await firstValueFrom(
      this.httpService.get<MerchantResponse>(
        `${envs.urlBase}/merchants/${envs.apiKeyPubWompo}`,
      ),
    );
    return response.data;
  }
}
