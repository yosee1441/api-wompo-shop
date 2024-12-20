import { PartialType } from '@nestjs/swagger';
import { CreateRequestTypeDto } from './create-request_type.dto';

export class UpdateRequestTypeDto extends PartialType(CreateRequestTypeDto) {}
