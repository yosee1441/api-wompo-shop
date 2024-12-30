import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { envs } from '@/common/config';
import { CreateTokenDto, CreateTransactionDto } from './dto';
import {
  CreateTokenResponse,
  MerchantResponse,
  TransactionResponse,
  CreateTransactionResponse,
} from './interfaces';
import {
  createTransactionReponseAdapter,
  createTransactionRequestAdapter,
} from './adapters/create-transation.adapter';

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
  ): Promise<CreateTransactionResponse> {
    const params = JSON.stringify(createTransactionRequestAdapter(dto));
    const response = await firstValueFrom(
      this.httpService.post<TransactionResponse>(
        `${envs.urlBase}/transactions`,
        params,
        {
          headers: {
            Authorization: `Bearer ${envs.apiKeyPubWompo}`,
          },
        },
      ),
    );
    return createTransactionReponseAdapter(response.data);
    // return Promise.resolve(
    //   createTransactionReponseAdapter({
    //     data: {
    //       id: '117690-1735312193-23894',
    //       created_at: '2024-12-27T15:09:53.896Z',
    //       finalized_at: null,
    //       amount_in_cents: 30057000,
    //       reference: 'sk8-FJFX6-USHC6NC-FL0U',
    //       customer_email: 'mauricioft@93gmail.com',
    //       currency: 'COP',
    //       payment_method_type: 'CARD',
    //       payment_method: {
    //         type: 'CARD',
    //         extra: {
    //           bin: '424242',
    //           name: 'VISA-4242',
    //           brand: 'VISA',
    //           exp_year: '27',
    //           card_type: 'CREDIT',
    //           exp_month: '02',
    //           last_four: '4242',
    //           card_holder: 'Mauricio Flor',
    //           is_three_ds: false,
    //           three_ds_auth_type: null,
    //         },
    //         installments: 2,
    //       },
    //       status: 'PENDING',
    //       status_message: null,
    //       billing_data: null,
    //       shipping_address: {
    //         address_line_1: 'Calle 34 # 56 - 78',
    //         country: 'CO',
    //         region: 'Cundinamarca',
    //         city: 'Bogotá',
    //         phone_number: '573307654321',
    //       },
    //       redirect_url: 'https://mitienda.com.co/pago/resultado',
    //       payment_source_id: null,
    //       payment_link_id: null,
    //       customer_data: {
    //         legal_id: '1234567890',
    //         full_name: 'Juan Alfonso Pérez Rodríguez',
    //         phone_number: '573307654321',
    //         legal_id_type: 'CC',
    //       },
    //       bill_id: null,
    //       taxes: [
    //         {
    //           type: 'VAT',
    //           amount_in_cents: 57000,
    //         },
    //       ],
    //       tip_in_cents: null,
    //     },
    //     meta: {},
    //   }),
    // );
  }

  async getMerchants(): Promise<MerchantResponse> {
    const response = await firstValueFrom(
      this.httpService.get<MerchantResponse>(
        `${envs.urlBase}/merchants/${envs.apiKeyPubWompo}`,
      ),
    );
    return response.data;
  }

  async findOneById(id: string): Promise<TransactionResponse> {
    const response = await firstValueFrom(
      this.httpService.get<TransactionResponse>(
        `${envs.urlBase}/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${envs.apiKeyPubWompo}`,
          },
        },
      ),
    );
    return response.data;
  }
}
