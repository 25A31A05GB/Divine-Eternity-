import React from 'react';
import { AdminDashboard } from './AdminDashboard';
import { Product } from '../types';

interface SecretAdminPortalProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onBulkUpdateProducts?: (products: Product[]) => void;
  onDeleteProduct: (productId: string) => void;
  onReturnToStore: () => void;
}

export const SecretAdminPortal: React.FC<SecretAdminPortalProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onBulkUpdateProducts,
  onDeleteProduct,
  onReturnToStore,
}) => {
  return (
    <AdminDashboard
      products={products}
      onAddProduct={onAddProduct}
      onUpdateProduct={onUpdateProduct}
      onBulkUpdateProducts={onBulkUpdateProducts}
      onDeleteProduct={onDeleteProduct}
      onReturnToStore={onReturnToStore}
      initialRole="director"
    />
  );
};
