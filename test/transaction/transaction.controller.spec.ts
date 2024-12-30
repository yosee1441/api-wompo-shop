import { Test, TestingModule } from '@nestjs/testing';

import { TransactionController } from '@/transaction/transaction.controller';
import { TransactionService } from '@/transaction/transaction.service';
import { CreateTransactionDto } from '@/transaction/dto';

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  const mockTransactionService = {
    createTransaction: jest.fn(),
    getMerchants: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should call transactionService.createTransaction and return the result', async () => {
      const dto: CreateTransactionDto = {
        acceptanceToken: 'acceptanceToken',
        acceptPersonalAuth: 'acceptPersonalAuth',
        cardHolder: 'cardHolder',
        cardNumber: 'cardNumber',
        currency: 'COP',
        productId: 1,
        customerId: 1,
        sizeId: 1,
        cvc: 'cvc',
        expMonth: '02',
        expYear: '28',
        paymentMethod: {
          installments: 1,
          type: 'CARD',
        },
        quantity: 1,
        redirectUrl: 'redirectUrl',
        customerData: {
          fullName: 'fullName',
          legalId: '1234567890',
          legalIdType: 'CC',
          phoneNumber: '3012345678',
        },
        customerEmail: 'example@co.com',
        shippingAddress: {
          addressLine1: 'addressLine1',
          city: 'city',
          country: 'country',
          phoneNumber: '3012345678',
        },
      };
      const mockResponse = {
        id: 'transaction-123',
        status: 'success',
      };

      mockTransactionService.createTransaction.mockResolvedValue(mockResponse);

      const result = await transactionController.createTransaction(dto);

      expect(transactionService.createTransaction).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getMerchants', () => {
    it('should call transactionService.getMerchants and return the result', async () => {
      const mockMerchants = [
        { id: 'merchant-1', name: 'Merchant One' },
        { id: 'merchant-2', name: 'Merchant Two' },
      ];

      mockTransactionService.getMerchants.mockResolvedValue(mockMerchants);

      const result = await transactionController.getMerchants();

      expect(transactionService.getMerchants).toHaveBeenCalled();
      expect(result).toEqual(mockMerchants);
    });
  });
});
