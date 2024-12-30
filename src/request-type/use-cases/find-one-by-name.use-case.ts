import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { RequestType } from '@/request-type/entities';

interface Options {
  name: string;
}

export const findOneByNameUseCase = async (
  requestTypeRepository: Repository<RequestType>,
  options: Options,
): Promise<RequestType> => {
  const { name } = options;
  const response = await requestTypeRepository.findOne({ where: { name } });

  if (!response?.id) {
    throw new NotFoundException('Not found request type name');
  }

  return response;
};
