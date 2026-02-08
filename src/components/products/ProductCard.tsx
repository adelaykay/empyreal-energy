import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    await addItem(product.id);
    setIsAdding(false);
  };

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full flex flex-col group cursor-pointer">
        {/* Image */}
        <div className="relative w-full h-48 mb-4 bg-dark-bg rounded-xl overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              No Image
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {!product.inStock && (
              <Badge variant="danger">Out of Stock</Badge>
            )}
            {discount > 0 && (
              <Badge variant="warning">-{discount}%</Badge>
            )}
            {product.featured && (
              <Badge variant="primary">Featured</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="font-orbitron font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
            {product.name}
          </h3>
          
          <p className="text-text-muted text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary-green">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-text-muted line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          isLoading={isAdding}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </Card>
    </Link>
  );
};
