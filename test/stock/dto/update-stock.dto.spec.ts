import { validate } from 'class-validator';
import { UpdateStockDto } from '@/stock/dto/update-stock.dto';

describe('UpdateStockDto', () => {
  let dto: UpdateStockDto;

  beforeEach(() => {
    dto = new UpdateStockDto();
  });

  it('should be valid when all fields are correct', async () => {
    dto.productId = 1;
    dto.sizeId = 2;
    dto.quantity = 10;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should return an error when `productId` is empty', async () => {
    dto.sizeId = 2;
    dto.quantity = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productId');
    expect(errors[0].constraints?.isNotEmpty).toBe('productId is required');
  });

  it('should return an error when `productId` is not a positive integer', async () => {
    dto.productId = -1;
    dto.sizeId = 2;
    dto.quantity = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('productId');
    expect(errors[0].constraints?.min).toBe(
      'productId must be a positive integer',
    );
  });

  it('should return an error when `sizeId` is empty', async () => {
    dto.productId = 1;
    dto.quantity = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sizeId');
    expect(errors[0].constraints?.isNotEmpty).toBe('sizeId is required');
  });

  it('should return an error when `sizeId` is not a positive integer', async () => {
    dto.productId = 1;
    dto.sizeId = 0;
    dto.quantity = 10;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('sizeId');
    expect(errors[0].constraints?.min).toBe(
      'sizeId must be a positive integer',
    );
  });

  it('should return an error when `quantity` is empty', async () => {
    dto.productId = 1;
    dto.sizeId = 2;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should return an error when `quantity` is not an integer', async () => {
    dto.productId = 1;
    dto.sizeId = 2;
    dto.quantity = NaN;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quantity');
    expect(errors[0].constraints?.isInt).toBeDefined();
  });
});
