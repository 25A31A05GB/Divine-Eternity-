import type { Request, Response } from 'express';
import { supabaseAdmin, verifyUserToken } from './_lib/supabaseAdmin';
import { BUSINESS_CONFIG } from '../src/config/business';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const orderId = (req.query.orderId || req.body?.orderId || '').toString().trim().toUpperCase();
    const phone = (req.query.phone || req.body?.phone || '').toString().replace(/\D/g, '').slice(-10);
    const authHeader = req.headers.authorization;

    if (!orderId) {
      return res.status(400).send('Order ID is required');
    }

    if (!supabaseAdmin) {
      return res.status(500).send('Database connection unavailable');
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).send('Order not found');
    }

    // Access authorization check: Admin / Staff, OR order owner, OR guest with matching phone
    const { user, role } = await verifyUserToken(authHeader);
    const isAdmin = role === 'admin' || role === 'staff';
    const isOwner = user && order.user_id === user.id;

    const customer = order.customer || {};
    const orderPhone = String(customer.phone || '').replace(/\D/g, '').slice(-10);
    const isPhoneMatched = phone && phone.length === 10 && phone === orderPhone;

    if (!isAdmin && !isOwner && !isPhoneMatched) {
      return res.status(403).send('Unauthorized to access this tax invoice');
    }

    // If order doesn't have an invoice_number, generate sequential invoice number
    let invoiceNumber = order.invoice_number;
    if (!invoiceNumber) {
      try {
        const { data: invRes } = await supabaseAdmin.rpc('get_next_invoice_number');
        if (invRes) {
          invoiceNumber = invRes;
          await supabaseAdmin.from('orders').update({ invoice_number: invoiceNumber }).eq('id', orderId);
        }
      } catch (err) {
        invoiceNumber = `DE/2026-27/${order.id.slice(-4)}`;
      }
    }

    // Tax Math: Inclusive 18% GST calculation
    const items = Array.isArray(order.items) ? order.items : [];
    const isIntraState = (customer.state || '').trim().toLowerCase() === 'maharashtra';

    let totalTaxableValue = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    const itemRowsHtml = items.map((item: any, idx: number) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      const lineTotal = price * qty;
      const gstRate = 18; // default 18% GST for fashion jewelry/keepsakes
      const taxable = lineTotal / (1 + gstRate / 100);
      const tax = lineTotal - taxable;

      totalTaxableValue += taxable;
      if (isIntraState) {
        totalCgst += tax / 2;
        totalSgst += tax / 2;
      } else {
        totalIgst += tax;
      }

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE;">
            <strong>${item.name || 'Personalized Keepsake'}</strong>
            ${item.customText ? `<br/><small style="color: #666;">Engraved: "${item.customText}"</small>` : ''}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: center;">7117</td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: center;">${qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: right;">₹${taxable.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: center;">${gstRate}%</td>
          <td style="padding: 10px; border-bottom: 1px solid #EFE7DE; text-align: right;">₹${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>TAX INVOICE — ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #211D1C; background: #FFF; margin: 0; padding: 24px; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #D4AF37; padding: 24px; border-radius: 8px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #FF2E93; padding-bottom: 16px; }
    .title { font-size: 22px; font-weight: bold; color: #FF2E93; margin: 0; }
    .subtitle { font-size: 11px; text-transform: uppercase; color: #666; margin-top: 4px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
    .box { background: #FAF7F2; border: 1px solid #EFE7DE; padding: 12px; border-radius: 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #211D1C; color: #FFF; padding: 8px; font-size: 11px; text-transform: uppercase; }
    .totals-table { width: 300px; margin-left: auto; margin-top: 16px; }
    .totals-table td { padding: 6px; font-size: 12px; }
    .footer { font-size: 10px; text-align: center; color: #777; margin-top: 30px; border-top: 1px solid #DDD; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="title">${BUSINESS_CONFIG.brandName}</h1>
        <div class="subtitle">${BUSINESS_CONFIG.legalName}</div>
        <div style="margin-top: 6px; color: #444; font-size: 11px;">
          ${BUSINESS_CONFIG.address}<br/>
          GSTIN: <strong>${BUSINESS_CONFIG.gstin}</strong> | Support: ${BUSINESS_CONFIG.supportPhoneDisplay}
        </div>
      </div>
      <div style="text-align: right;">
        <h2 style="font-size: 18px; color: #211D1C; margin: 0;">TAX INVOICE</h2>
        <div style="font-size: 13px; font-weight: bold; color: #FF2E93; margin-top: 4px;">${invoiceNumber}</div>
        <div style="font-size: 11px; color: #555; margin-top: 2px;">Date: ${(order.created_at || new Date().toISOString()).split('T')[0]}</div>
      </div>
    </div>

    <div class="meta-grid">
      <div class="box">
        <strong style="color: #FF2E93; font-size: 11px; text-transform: uppercase;">BILLED TO (BUYER):</strong>
        <div style="font-weight: bold; font-size: 13px; margin-top: 4px;">${customer.fullName || 'Valued Patron'}</div>
        <div>${customer.address || ''} ${customer.apartment || ''}</div>
        <div>${customer.city || ''}, ${customer.state || ''} - ${customer.pincode || ''}</div>
        <div>Phone: ${customer.phone || ''} | Email: ${customer.email || 'N/A'}</div>
      </div>
      <div class="box">
        <strong style="color: #FF2E93; font-size: 11px; text-transform: uppercase;">ORDER & PAYMENT DETAILS:</strong>
        <div style="margin-top: 4px;"><strong>Order Ref:</strong> #${order.id}</div>
        <div><strong>Payment Method:</strong> ${order.payment_method || 'Prepaid'}</div>
        <div><strong>Payment Status:</strong> ${order.payment_status || 'Paid'}</div>
        <div><strong>Place of Supply:</strong> ${customer.state || 'Maharashtra'}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item Description</th>
          <th>HSN</th>
          <th>Qty</th>
          <th>Taxable Value</th>
          <th>GST Rate</th>
          <th>Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        ${itemRowsHtml}
      </tbody>
    </table>

    <table class="totals-table">
      <tr>
        <td>Subtotal (Taxable):</td>
        <td style="text-align: right;">₹${totalTaxableValue.toFixed(2)}</td>
      </tr>
      ${isIntraState ? `
      <tr>
        <td>CGST (9%):</td>
        <td style="text-align: right;">₹${totalCgst.toFixed(2)}</td>
      </tr>
      <tr>
        <td>SGST (9%):</td>
        <td style="text-align: right;">₹${totalSgst.toFixed(2)}</td>
      </tr>
      ` : `
      <tr>
        <td>IGST (18%):</td>
        <td style="text-align: right;">₹${totalIgst.toFixed(2)}</td>
      </tr>
      `}
      <tr>
        <td>Shipping & Delivery:</td>
        <td style="text-align: right;">${Number(order.shipping_fee) > 0 ? `₹${order.shipping_fee}` : 'FREE'}</td>
      </tr>
      ${Number(order.discount_total) > 0 ? `
      <tr>
        <td style="color: #E05A47;">Discount:</td>
        <td style="text-align: right; color: #E05A47;">-₹${order.discount_total}</td>
      </tr>
      ` : ''}
      <tr style="font-weight: bold; font-size: 14px; border-top: 2px solid #211D1C;">
        <td>Total Paid:</td>
        <td style="text-align: right; color: #FF2E93;">₹${order.total_amount}</td>
      </tr>
    </table>

    <div class="footer">
      This is a computer-generated tax invoice issued by ${BUSINESS_CONFIG.legalName} under Indian GST Rules.
      <br/>Thank you for shopping at ${BUSINESS_CONFIG.brandName}!
    </div>
  </div>
</body>
</html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(invoiceHtml);
  } catch (err: any) {
    return res.status(500).send(`Invoice generation error: ${err.message}`);
  }
}
