import { Order, Product } from '../types';

export function exportOrdersToCSV(orders: Order[]) {
  if (!orders || orders.length === 0) return;

  const headers = [
    'Order ID',
    'Customer Name',
    'Phone',
    'Email',
    'Delivery Address',
    'City',
    'State',
    'Pincode',
    'Total Amount (INR)',
    'Payment Method',
    'Status',
    'Created Date',
    'Items Summary',
    'Gift Wrapping',
    'Gift Note',
  ];

  const rows = orders.map((o) => {
    const itemsSummary = (o.items || [])
      .map((item) => `${item.name} (x${item.quantity}) - ₹${item.price}${item.customText ? ` [Custom: ${item.customText}]` : ''}`)
      .join('; ');

    const addr = o.customer || o.shippingAddress || ({} as any);

    return [
      `"${o.id}"`,
      `"${addr.fullName || o.customerName || 'Customer'}"`,
      `"${addr.phone || o.customerPhone || ''}"`,
      `"${addr.email || o.customerEmail || ''}"`,
      `"${(addr.streetAddress || '').replace(/"/g, '""')}"`,
      `"${addr.city || ''}"`,
      `"${addr.state || ''}"`,
      `"${addr.pincode || ''}"`,
      o.totalAmount || o.total || 0,
      `"${o.paymentMethod || 'Prepaid'}"`,
      `"${o.status || 'processing'}"`,
      `"${o.createdAt || new Date().toISOString().split('T')[0]}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      `"${o.isGiftWrapped || o.giftWrapping ? 'Yes (+₹99)' : 'No'}"`,
      `"${(o.giftNote || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, `divines_eternity_orders_${Date.now()}.csv`, 'text/csv');
}

export function exportProductsToCSV(products: Product[]) {
  if (!products || products.length === 0) return;

  const headers = [
    'Product ID',
    'Product Name',
    'Category',
    'Price (INR)',
    'MRP (INR)',
    'Stock Status',
    'Rating',
    'Badge',
    'Image URL',
    'Allows Personalization',
  ];

  const rows = products.map((p) => [
    `"${p.id}"`,
    `"${(p.name || '').replace(/"/g, '""')}"`,
    `"${p.category || ''}"`,
    p.price || 0,
    p.mrp || 0,
    `"${p.stockStatus || (p.inStock !== false ? 'in_stock' : 'out_of_stock')}"`,
    p.rating || 5.0,
    `"${p.badge || ''}"`,
    `"${(p.images && p.images[0]) || ''}"`,
    `"${p.allowsPersonalization ? 'Yes' : 'No'}"`,
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, `divines_eternity_catalog_${Date.now()}.csv`, 'text/csv');
}

export function exportCustomersToCSV(customers: any[]) {
  if (!customers || customers.length === 0) return;

  const headers = ['Customer ID', 'Full Name', 'Phone', 'Email', 'City', 'Total Orders', 'Total Spent (INR)'];

  const rows = customers.map((c) => [
    `"${c.id}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${c.phone || ''}"`,
    `"${c.email || ''}"`,
    `"${c.city || ''}"`,
    c.totalOrders || c.ordersCount || 1,
    c.totalSpent || 0,
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  downloadFile(csvContent, `divines_eternity_customers_${Date.now()}.csv`, 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
