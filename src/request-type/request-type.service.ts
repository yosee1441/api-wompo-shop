import { Injectable } from '@nestjs/common';
import { CreateRequestTypeDto } from './dto/create-request_type.dto';
import { UpdateRequestTypeDto } from './dto/update-request_type.dto';

@Injectable()
export class RequestTypeService {
  create(createRequestTypeDto: CreateRequestTypeDto) {
    return 'This action adds a new requestType';
  }

  findAll() {
    return `This action returns all requestType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} requestType`;
  }

  update(id: number, updateRequestTypeDto: UpdateRequestTypeDto) {
    return `This action updates a #${id} requestType`;
  }

  remove(id: number) {
    return `This action removes a #${id} requestType`;
  }
}
