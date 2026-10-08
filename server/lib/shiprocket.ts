import { BUSINESS_CONFIG } from '../../src/config/business';

interface ShiprocketAuthToken {
  token: string;
  expiresAt: number;
}

let cachedAuthToken: ShiprocketAuthToken | null = null;

const email = process.env.SHIPROCKET_EMAIL;
const password = process.env.SHIPROCKET_PASSWORD;

export function isShiprocketConfigured(): boolean {
  return Boolean(email && password && email.length > 3 && password.length > 3);
}

async function getAuthToken(): Promise<string | null> {
  if (!isShiprocketConfigured()) return null;

  if (cachedAuthToken && Date.now() < cachedAuthToken.expiresAt - 60000) {
    return cachedAuthToken.token;
  }

  try {
    const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        cachedAuthToken = {
          token: data.token,
          expiresAt: Date.now() + 9 * 24 * 3600 * 1000, // Valid 10 days
        };
        return data.token;
      }
    }
  } catch (err) {
    console.warn('[Shiprocket Auth Error]', err);
  }

  return null;
}

export async function checkPincodeServiceability(pincode: string, weightKg: number = 0.5): Promise<{
  serviceable: boolean;
  courierName?: string;
  estimatedDays?: string;
  error?: string;
}> {
  const token = await getAuthToken();
  if (!token) {
    // Fallback if Shiprocket is unconfigured: allow delivery with default 3-5 days estimate
    const clean = pincode.replace(/\D/g, '');
    if (clean.length === 6) {
      return { serviceable: true, courierName: 'Delhivery Express', estimatedDays: '3-5 days' };
    }
    return { serviceable: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
  }

  try {
    const pickupPincode = '400050'; // Mumbai Atelier
    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&weight=${weightKg}&cod=1`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
        const topCourier = data.data.available_courier_companies[0];
        const days = topCourier.etd || '3-5 days';
        return {
          serviceable: true,
          courierName: topCourier.courier_name,
          estimatedDays: typeof days === 'number' ? `${days} days` : days,
        };
      }
    }
  } catch (e: any) {
    console.warn('[Shiprocket Serviceability Warning]', e.message);
  }

  // Safe fallback
  return { serviceable: true, courierName: 'Express Courier', estimatedDays: '3-5 days' };
}

export async function createShiprocketShipment(order: any): Promise<{
  success: boolean;
  awbCode?: string;
  courierName?: string;
  labelUrl?: string;
  error?: string;
}> {
  const token = await getAuthToken();
  if (!token) {
    return { success: false, error: 'Shiprocket environment variables not configured.' };
  }

  try {
    const customer = order.customer || {};
    const items = order.items || [];

    const orderPayload = {
      order_id: order.id,
      order_date: new Date(order.created_at || Date.now()).toISOString().split('T')[0],
      pickup_location: 'Mumbai Atelier',
      billing_customer_name: customer.fullName || 'Valued Patron',
      billing_last_name: '',
      billing_address: customer.address || 'Address',
      billing_address_2: customer.apartment || '',
      billing_city: customer.city || 'Mumbai',
      billing_pincode: customer.pincode || '400050',
      billing_state: customer.state || 'Maharashtra',
      billing_country: 'India',
      billing_email: customer.email || 'guest@divineseternity.com',
      billing_phone: customer.phone || '9353652043',
      shipping_is_billing: true,
      order_items: items.map((it: any, idx: number) => ({
        name: it.name || `Keepsake #${idx + 1}`,
        sku: it.productId || `SKU-${idx + 1}`,
        units: it.quantity || 1,
        selling_price: it.price || 500,
      })),
      payment_method: order.payment_method === 'COD' ? 'COD' : 'Prepaid',
      sub_total: order.total_amount || 999,
      length: 15,
      breadth: 15,
      height: 10,
      weight: 0.5,
    };

    const res = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (res.ok) {
      const data = await res.json();
      const shipmentId = data.shipment_id;
      const awbCode = data.awb_code || `AWB${data.order_id}`;
      return {
        success: true,
        awbCode,
        courierName: data.courier_name || 'Delhivery Express',
        labelUrl: `https://apiv2.shiprocket.in/v1/external/courier/generate/label?shipment_id=${shipmentId}`,
      };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  return { success: false, error: 'Shiprocket order creation failed' };
}

export async function trackShiprocketShipment(awbCode: string): Promise<{
  status?: string;
  activities?: Array<{ date: string; activity: string; location: string }>;
}> {
  const token = await getAuthToken();
  if (!token || !awbCode) return {};

  try {
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      const trackingData = data.tracking_data;
      if (trackingData && trackingData.shipment_track) {
        const track = trackingData.shipment_track[0];
        const activities = (trackingData.shipment_track_activities || []).map((act: any) => ({
          date: act.date,
          activity: act.activity,
          location: act.location,
        }));
        return {
          status: track.current_status,
          activities,
        };
      }
    }
  } catch (e) {
    console.warn('[Shiprocket Tracking Error]', e);
  }

  return {};
}
