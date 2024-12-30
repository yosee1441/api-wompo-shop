import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RequestType } from './entities';
import { findOneByNameUseCase } from './use-cases';

@Injectable()
export class RequestTypeService {
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
  ) {}

  async findOneByName(name: string): Promise<RequestType> {
    return await findOneByNameUseCase(this.requestTypeRepository, { name });
  }
}
