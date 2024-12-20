import { Injectable } from '@nestjs/common';

import { CreateRequestTypeDto, UpdateRequestTypeDto } from './dto';

@Injectable()
export class RequestTypeService {
  create(createRequestTypeDto: CreateRequestTypeDto) {
    return createRequestTypeDto;
  }

  findAll() {
    return `This action returns all requestType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestType`;
  }

  update(id: number, updateRequestTypeDto: UpdateRequestTypeDto) {
    return { id, updateRequestTypeDto };
  }

  remove(id: number) {
    return `This action removes a #${id} requestType`;
  }
}
