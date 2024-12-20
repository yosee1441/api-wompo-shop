import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { RequestTypeService } from './request-type.service';
import { CreateRequestTypeDto, UpdateRequestTypeDto } from './dto';

@Controller('request-type')
export class RequestTypeController {
  constructor(private readonly requestTypeService: RequestTypeService) {}

  @Post()
  create(@Body() createRequestTypeDto: CreateRequestTypeDto) {
    return this.requestTypeService.create(createRequestTypeDto);
  }

  @Get()
  findAll() {
    return this.requestTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequestTypeDto: UpdateRequestTypeDto,
  ) {
    return this.requestTypeService.update(+id, updateRequestTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestTypeService.remove(+id);
  }
}
