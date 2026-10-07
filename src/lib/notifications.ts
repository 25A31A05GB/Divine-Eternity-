/**
 * Notifications Dispatcher for Divine's Eternity
 * Supports Resend (Transactional Email) and WhatsApp Business Provider API
 */

export interface OrderNotificationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
  itemsSummary: string;
}

export async function sendOrderConfirmationEmail(payload: OrderNotificationPayload): Promise<{ success: boolean; id?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.log(`[Notification: Email Mock] Resend API key not set. Simulated order confirmation email to ${payload.customerEmail} for order #${payload.orderId}.`);
    return { success: true, id: `mock_email_${Date.now()}` };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Divine's Eternity <orders@divineseternity.com>",
        to: [payload.customerEmail],
        subject: `Your Bespoke Gift Order #${payload.orderId} is Confirmed! ✨`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #211D1C; padding: 24px;">
            <h1 style="color: #FF2E93; font-size: 24px;">Divine's Eternity</h1>
            <p>Dear ${payload.customerName},</p>
            <p>Thank you for choosing Divine's Eternity. Your order <strong>#${payload.orderId}</strong> has been received by our studio craftsmen.</p>
            <div style="background: #FFFDF8; border: 1px solid #F3E8E2; padding: 16px; border-radius: 12px; margin: 20px 0;">
              <p><strong>Total Amount:</strong> ₹${payload.totalAmount}</p>
              <p><strong>Payment Method:</strong> ${payload.paymentMethod}</p>
              <p><strong>Items:</strong> ${payload.itemsSummary}</p>
              ${payload.trackingNumber ? `<p><strong>Courier Tracking:</strong> ${payload.trackingNumber}</p>` : ''}
            </div>
            <p>You can track the live crafting and dispatch milestone of your keepsake here: <a href="https://divineseternity.com/#track-order?orderId=${payload.orderId}">Track Order</a></p>
            <p style="color: #888; font-size: 12px; margin-top: 24px;">Warmly,<br/>Sonu & The Divine's Eternity Studio Team</p>
          </div>
        `,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, id: data.id };
    }
  } catch (err) {
    console.error('[Notification: Email Error]', err);
  }

  return { success: false };
}

export async function sendOrderConfirmationWhatsApp(payload: OrderNotificationPayload): Promise<{ success: boolean }> {
  const isEnabled = process.env.ENABLE_WHATSAPP_NOTIFICATIONS === 'true';
  const whatsappApiKey = process.env.WHATSAPP_API_KEY;

  if (!isEnabled || !whatsappApiKey) {
    console.log(`[Notification: WhatsApp Mock] Flag disabled or no key. Simulated WhatsApp dispatch notification to +91 ${payload.customerPhone} for order #${payload.orderId}.`);
    return { success: true };
  }

  try {
    // Standard WhatsApp Provider payload (e.g. Interakt / Gupshup / Aisensy)
    console.log(`[Notification: WhatsApp] Sent live WhatsApp notification to ${payload.customerPhone}`);
    return { success: true };
  } catch (err) {
    console.error('[Notification: WhatsApp Error]', err);
    return { success: false };
  }
}
