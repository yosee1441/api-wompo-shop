import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { RequestType } from '@/request-type/entities/request-type.entity';
import { RequestTypeService } from '@/request-type/request-type.service';
import { NotFoundException } from '@nestjs/common';

describe('RequestTypeService', () => {
  let service: RequestTypeService;
  let mockRepository: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestTypeService,
        {
          provide: getRepositoryToken(RequestType),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RequestTypeService>(RequestTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByName', () => {
    it('should return a RequestType if the name exists', async () => {
      const name = 'example';
      const mockRequestType: RequestType = { id: 1, name } as RequestType;

      mockRepository.findOne.mockResolvedValue(mockRequestType);

      const result = await service.findOneByName(name);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
      expect(result).toEqual(mockRequestType);
    });

    it('should return null if the name does not exist', async () => {
      const name = 'non-existent';

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByName(name)).rejects.toThrow(
        new NotFoundException('Not found request type name'),
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name },
      });
    });
  });
});
