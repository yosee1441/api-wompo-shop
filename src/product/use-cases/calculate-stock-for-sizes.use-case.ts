import { Product } from '@/product/entities';

export const calculateStockForSizesUseCase = (product: Product) => {
  if (!product?.sizes) return product;

  product.sizes = product.sizes.map((size) => {
    const stockForSize = product.stocks.filter(
      (stock) => stock.size.id === size.id,
    );
    const totalStockForSize = stockForSize.reduce(
      (sum, stock) => sum + stock.available_quantity,
      0,
    );

    return {
      ...size,
      stock_quantity: totalStockForSize,
    };
  });

  return product;
};
