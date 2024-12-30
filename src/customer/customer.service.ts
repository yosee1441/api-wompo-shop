import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Customer } from './entities';
import { Repository } from 'typeorm';
import { findOneByIdUseCase } from './use-cases';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findOne(id: number): Promise<Customer> {
    return await findOneByIdUseCase(this.customerRepository, { id });
  }
}
