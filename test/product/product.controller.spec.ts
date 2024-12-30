import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from '@/common/pagination';

import { ProductController } from '@/product/product.controller';
import { ProductService } from '@/product/product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    findOneBySlug: jest.fn(),
    findAllPagination: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('findOneBySlug', () => {
    it('should return a product by slug', async () => {
      const slug = 'sample-product';
      const mockProduct = { id: 1, name: 'Sample Product', slug };

      mockProductService.findOneBySlug.mockResolvedValue(mockProduct);

      const result = await productController.findOneBySlug(slug);

      expect(productService.findOneBySlug).toHaveBeenCalledWith(slug);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAllPagination', () => {
    it('should return paginated products', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockPaginatedProducts = {
        items: [{ id: 1, name: 'Sample Product' }],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      mockProductService.findAllPagination.mockResolvedValue(
        mockPaginatedProducts,
      );

      const result = await productController.findAllPagination(paginationDto);

      expect(productService.findAllPagination).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(result).toEqual(mockPaginatedProducts);
    });
  });
});
