import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from '@/customer/entities';
import { findOneByIdUseCase } from '@/customer/use-cases';

const mockRepository = () => ({
  findOne: jest.fn(),
});

describe('findOneByIdUseCase', () => {
  let customerRepository: jest.Mocked<Repository<Customer>>;

  beforeEach(() => {
    customerRepository = mockRepository() as unknown as jest.Mocked<
      Repository<Customer>
    >;
  });

  it('should return a customer if the ID is found', async () => {
    const mockCustomer = { id: 1, name: 'John Doe' } as Customer;
    customerRepository.findOne.mockResolvedValue(mockCustomer);

    const result = await findOneByIdUseCase(customerRepository, { id: 1 });

    expect(customerRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(mockCustomer);
  });

  it('should throw a NotFoundException if the customer is not found', async () => {
    customerRepository.findOne.mockResolvedValue(null);

    await expect(
      findOneByIdUseCase(customerRepository, { id: 999 }),
    ).rejects.toThrow(new NotFoundException('Not found customer'));

    expect(customerRepository.findOne).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });
});
