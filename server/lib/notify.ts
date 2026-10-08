import { supabaseAdmin } from './supabaseAdmin';
import {
  getOrderConfirmedEmail,
  getOrderShippedEmail,
  getOrderDeliveredEmail,
  getReturnUpdateEmail,
  getPersonalizationProofEmail,
} from './emailTemplates';

interface NotifyParams {
  orderId: string;
  eventType: 'order_confirmed' | 'shipped' | 'delivered' | 'return_update' | 'proof_sent';
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount?: number;
  paymentMethod?: string;
  itemsSummary?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  returnReason?: string;
  refundAmount?: number;
  refundReference?: string;
  proofLink?: string;
}

export async function notifyOrderStatus(params: NotifyParams): Promise<{ success: boolean; logId?: string }> {
  const { orderId, eventType, customerName, customerEmail, customerPhone } = params;

  let emailSubject = '';
  let emailHtml = '';

  switch (eventType) {
    case 'order_confirmed': {
      const template = getOrderConfirmedEmail(params);
      emailSubject = template.subject;
      emailHtml = template.html;
      break;
    }
    case 'shipped': {
      const template = getOrderShippedEmail(params);
      emailSubject = template.subject;
      emailHtml = template.html;
      break;
    }
    case 'delivered': {
      const template = getOrderDeliveredEmail(params);
      emailSubject = template.subject;
      emailHtml = template.html;
      break;
    }
    case 'return_update': {
      const template = getReturnUpdateEmail(params);
      emailSubject = template.subject;
      emailHtml = template.html;
      break;
    }
    case 'proof_sent': {
      const template = getPersonalizationProofEmail(params);
      emailSubject = template.subject;
      emailHtml = template.html;
      break;
    }
  }

  let emailStatus = 'skipped';
  let emailError: string | null = null;

  // 1. Send Email via Resend if RESEND_API_KEY is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (customerEmail && emailHtml) {
    if (resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Divine's Eternity <orders@divineseternity.com>",
            to: [customerEmail],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (res.ok) {
          emailStatus = 'sent';
        } else {
          const errData = await res.json();
          emailStatus = 'failed';
          emailError = errData.message || 'Resend HTTP error';
        }
      } catch (err: any) {
        emailStatus = 'failed';
        emailError = err.message || 'Email dispatch exception';
      }
    } else {
      emailStatus = 'simulated';
      console.log(`[notifyOrderStatus] Resend API key missing. Simulated email to ${customerEmail}: "${emailSubject}"`);
    }
  }

  // 2. WhatsApp Notification if ENABLE_WHATSAPP_NOTIFICATIONS is true
  let waStatus = 'skipped';
  if (process.env.ENABLE_WHATSAPP_NOTIFICATIONS === 'true' && customerPhone) {
    waStatus = 'simulated';
    console.log(`[notifyOrderStatus] WhatsApp notification triggered for ${customerPhone} (event: ${eventType})`);
  }

  // 3. Record in notification_log table in Supabase
  let logId: string | undefined;
  if (supabaseAdmin) {
    try {
      const { data } = await supabaseAdmin.from('notification_log').insert({
        order_id: orderId,
        channel: customerEmail ? 'email' : 'whatsapp',
        event_type: eventType,
        recipient: customerEmail || customerPhone || 'N/A',
        status: emailStatus === 'sent' ? 'sent' : emailStatus === 'simulated' ? 'simulated' : 'failed',
        error: emailError,
        metadata: {
          customerName,
          emailSubject,
          waStatus,
        },
      }).select('id').maybeSingle();

      if (data) logId = data.id;
    } catch (e) {
      console.warn('[notifyOrderStatus] Could not record notification log:', e);
    }
  }

  return { success: emailStatus === 'sent' || emailStatus === 'simulated', logId };
}
