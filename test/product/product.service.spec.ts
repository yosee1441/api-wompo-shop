import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductService } from '@/product/product.service';
import { Product } from '@/product/entities';
import {
  paginatedProductsUseCase,
  buildPaginationResponseUseCase,
  findProductBySlugUseCase,
  transformProductsUseCase,
  transformProductUseCase,
  calculateStockForSizesUseCase,
  findOneByIdUseCase,
} from '@/product/use-cases';
import { PaginationDto } from '@/common/pagination';

jest.mock('@/product/use-cases');

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: Repository<Product>;

  const mockProductRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a product by id', async () => {
      const id = 1;
      const mockProduct = { id, title: 'Sample Product' } as Product;

      (findOneByIdUseCase as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.findOneById(id);

      expect(findOneByIdUseCase).toHaveBeenCalledWith(productRepository, {
        id,
      });
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findOneBySlug', () => {
    it('should return a transformed product by slug', async () => {
      const slug = 'sample-product';
      const mockProduct = { id: 1, title: 'Sample Product', slug } as Product;
      const transformedProduct = { ...mockProduct, stock: 10 };

      (findProductBySlugUseCase as jest.Mock).mockResolvedValue(mockProduct);
      (calculateStockForSizesUseCase as jest.Mock).mockReturnValue(mockProduct);
      (transformProductUseCase as jest.Mock).mockReturnValue(
        transformedProduct,
      );

      const result = await productService.findOneBySlug(slug);

      expect(findProductBySlugUseCase).toHaveBeenCalledWith(productRepository, {
        slug,
      });
      expect(calculateStockForSizesUseCase).toHaveBeenCalledWith(mockProduct);
      expect(transformProductUseCase).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(transformedProduct);
    });
  });

  describe('findAllPagination', () => {
    it('should return paginated and transformed products', async () => {
      const dto: PaginationDto = { page: 1, limit: 10 };
      const mockProducts = [{ id: 1, title: 'Sample Product' }] as Product[];
      const transformedProducts = [
        { id: 1, title: 'Sample Product', stock: 10 },
      ];
      const total = 1;

      (paginatedProductsUseCase as jest.Mock).mockResolvedValue([
        mockProducts,
        total,
      ]);
      (transformProductsUseCase as jest.Mock).mockReturnValue(
        transformedProducts,
      );
      (buildPaginationResponseUseCase as jest.Mock).mockReturnValue({
        items: transformedProducts,
        meta: {
          totalItems: total,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });

      const result = await productService.findAllPagination(dto);

      expect(paginatedProductsUseCase).toHaveBeenCalledWith(
        productRepository,
        dto,
      );
      expect(transformProductsUseCase).toHaveBeenCalledWith(mockProducts);
      expect(buildPaginationResponseUseCase).toHaveBeenCalledWith(
        transformedProducts,
        {
          total,
          page: dto.page,
        },
      );
      expect(result).toEqual({
        items: transformedProducts,
        meta: {
          totalItems: total,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      });
    });
  });
});
