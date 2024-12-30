import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RequestType } from '@/request-type/entities';
import { findOneByNameUseCase } from '@/request-type/use-cases';

const mockRepository = () => ({
  findOne: jest.fn(),
});

describe('findOneByNameUseCase', () => {
  let requestTypeRepository: jest.Mocked<Repository<RequestType>>;

  beforeEach(() => {
    requestTypeRepository = mockRepository() as unknown as jest.Mocked<
      Repository<RequestType>
    >;
  });

  it('should return a request type if the name is found', async () => {
    const name = 'John Doe';
    const mockCustomer = { id: 1, name: 'John Doe' } as RequestType;
    requestTypeRepository.findOne.mockResolvedValue(mockCustomer);

    const result = await findOneByNameUseCase(requestTypeRepository, {
      name,
    });

    expect(requestTypeRepository.findOne).toHaveBeenCalledWith({
      where: { name },
    });
    expect(result).toEqual(mockCustomer);
  });

  it('should throw a NotFoundException if the request type is not found', async () => {
    requestTypeRepository.findOne.mockResolvedValue(null);

    await expect(
      findOneByNameUseCase(requestTypeRepository, { name: 'non-existent' }),
    ).rejects.toThrow(new NotFoundException('Not found request type name'));

    expect(requestTypeRepository.findOne).toHaveBeenCalledWith({
      where: { name: 'non-existent' },
    });
  });
});
