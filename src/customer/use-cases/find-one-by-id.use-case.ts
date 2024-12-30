import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Customer } from '@/customer/entities';

interface Options {
  id: number;
}

export const findOneByIdUseCase = async (
  customerRepository: Repository<Customer>,
  options: Options,
): Promise<Customer> => {
  const { id } = options;
  const customer = await customerRepository.findOne({ where: { id: id } });

  if (!customer) {
    throw new NotFoundException('Not found customer');
  }

  return customer;
};
