import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RequestType } from './entities';

@Injectable()
export class RequestTypeService {
  constructor(
    @InjectRepository(RequestType)
    private readonly requestTypeRepository: Repository<RequestType>,
  ) {}

  findOneByName(name: string): Promise<RequestType> {
    return this.requestTypeRepository.findOne({ where: { name } });
  }
}
