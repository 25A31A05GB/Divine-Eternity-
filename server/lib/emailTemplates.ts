import { BUSINESS_CONFIG } from '../../src/config/business';

interface EmailTemplateData {
  orderId: string;
  customerName: string;
  itemsSummary?: string;
  totalAmount?: number;
  paymentMethod?: string;
  courierName?: string;
  trackingNumber?: string;
  trackingLink?: string;
  returnReason?: string;
  refundAmount?: number;
  refundReference?: string;
  proofUrl?: string;
  proofLink?: string;
}

const BRAND_HEADER = `
  <div style="background-color: #211D1C; padding: 24px; text-align: center; border-bottom: 3px solid #FF2E93;">
    <h1 style="color: #FF2E93; font-family: Georgia, serif; font-size: 26px; margin: 0; letter-spacing: 1px;">
      ${BUSINESS_CONFIG.brandName}
    </h1>
    <p style="color: #FFD94A; font-size: 11px; text-transform: uppercase; tracking: 2px; margin: 4px 0 0 0;">
      ${BUSINESS_CONFIG.tagline}
    </p>
  </div>
`;

const BRAND_FOOTER = `
  <div style="background-color: #FAF7F2; padding: 20px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #F3E8E2; margin-top: 30px;">
    <p style="margin: 0 0 8px 0; font-weight: bold; color: #211D1C;">${BUSINESS_CONFIG.legalName}</p>
    <p style="margin: 0 0 4px 0;">${BUSINESS_CONFIG.address}</p>
    <p style="margin: 0 0 8px 0;">WhatsApp Support: ${BUSINESS_CONFIG.supportPhoneDisplay} | Email: ${BUSINESS_CONFIG.supportEmail}</p>
    <p style="margin: 0; color: #A8A29E;">GSTIN: ${BUSINESS_CONFIG.gstin} | Built for Timeless Moments</p>
  </div>
`;

export function getOrderConfirmedEmail(data: EmailTemplateData): { subject: string; html: string } {
  return {
    subject: `Order Confirmed #${data.orderId} — ${BUSINESS_CONFIG.brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #F3E8E2;">
        ${BRAND_HEADER}
        <div style="padding: 24px; color: #211D1C;">
          <h2 style="font-family: Georgia, serif; color: #211D1C; font-size: 20px; margin-top: 0;">
            Thank you, ${data.customerName}! 🌸
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
            Your order <strong>#${data.orderId}</strong> has been successfully placed and received by our studio craftsmen.
          </p>

          <div style="background-color: #FFF9EB; border: 1px solid #F5E6CE; padding: 18px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Order ID:</strong> #${data.orderId}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Total Amount:</strong> ₹${data.totalAmount || 0}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Payment Method:</strong> ${data.paymentMethod || 'Online Payment'}</p>
            <p style="margin: 0; font-size: 13px;"><strong>Items:</strong> ${data.itemsSummary || 'Handcrafted Keepsakes'}</p>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${BUSINESS_CONFIG.domain}/track-order?orderId=${data.orderId}" 
               style="background-color: #FF2E93; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block;">
               Track Your Order Status
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    `,
  };
}

export function getOrderShippedEmail(data: EmailTemplateData): { subject: string; html: string } {
  return {
    subject: `Your Order #${data.orderId} Has Been Dispatched! 🚀 — ${BUSINESS_CONFIG.brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #F3E8E2;">
        ${BRAND_HEADER}
        <div style="padding: 24px; color: #211D1C;">
          <h2 style="font-family: Georgia, serif; color: #211D1C; font-size: 20px; margin-top: 0;">
            Great news, ${data.customerName}! ✨
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
            Your luxury order <strong>#${data.orderId}</strong> has been carefully packed in our signature satin box and handed over to our shipping partner.
          </p>

          <div style="background-color: #F0FDF4; border: 1px solid #BBF7D0; padding: 18px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Courier Partner:</strong> ${data.courierName || 'Delhivery Express'}</p>
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Tracking AWB:</strong> ${data.trackingNumber || 'N/A'}</p>
            <p style="margin: 0; font-size: 13px;"><strong>Status:</strong> Dispatched & In Transit</p>
          </div>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${data.trackingLink || `${BUSINESS_CONFIG.domain}/track-order?orderId=${data.orderId}`}" 
               style="background-color: #211D1C; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block;">
               Live Courier Tracking
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    `,
  };
}

export function getOrderDeliveredEmail(data: EmailTemplateData): { subject: string; html: string } {
  return {
    subject: `Order #${data.orderId} Delivered! 🎁 — ${BUSINESS_CONFIG.brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #F3E8E2;">
        ${BRAND_HEADER}
        <div style="padding: 24px; color: #211D1C;">
          <h2 style="font-family: Georgia, serif; color: #211D1C; font-size: 20px; margin-top: 0;">
            Delivered with Love, ${data.customerName}! ❤️
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
            Your parcel for Order <strong>#${data.orderId}</strong> has been delivered. We hope it brings a big smile to your face!
          </p>

          <p style="font-size: 13px; color: #57534E;">
            If you loved your gift, we would be honored if you left a verified review on our atelier website!
          </p>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${BUSINESS_CONFIG.domain}/account" 
               style="background-color: #FF2E93; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block;">
               Write a Review in My Account
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    `,
  };
}

export function getReturnUpdateEmail(data: EmailTemplateData): { subject: string; html: string } {
  return {
    subject: `Return / Cancellation Update for Order #${data.orderId} — ${BUSINESS_CONFIG.brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #F3E8E2;">
        ${BRAND_HEADER}
        <div style="padding: 24px; color: #211D1C;">
          <h2 style="font-family: Georgia, serif; color: #211D1C; font-size: 20px; margin-top: 0;">
            Hello ${data.customerName},
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
            This is an update regarding your request for Order <strong>#${data.orderId}</strong>.
          </p>

          <div style="background-color: #FFF9EB; border: 1px solid #F5E6CE; padding: 18px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Request Reason:</strong> ${data.returnReason || 'Cancellation / Replacement'}</p>
            ${data.refundAmount ? `<p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Refund Amount:</strong> ₹${data.refundAmount}</p>` : ''}
            ${data.refundReference ? `<p style="margin: 0; font-size: 13px;"><strong>Transaction Reference:</strong> ${data.refundReference}</p>` : ''}
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    `,
  };
}

export function getPersonalizationProofEmail(data: EmailTemplateData): { subject: string; html: string } {
  return {
    subject: `Review & Approve Your Artisan Proof for #${data.orderId} ✨ — ${BUSINESS_CONFIG.brandName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #F3E8E2;">
        ${BRAND_HEADER}
        <div style="padding: 24px; color: #211D1C;">
          <h2 style="font-family: Georgia, serif; color: #211D1C; font-size: 20px; margin-top: 0;">
            Hello ${data.customerName}! 🎨
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #44403C;">
            Our atelier craftsmen have prepared the digital proof for your personalized keepsake in Order <strong>#${data.orderId}</strong>!
          </p>

          <p style="font-size: 13px; color: #57534E;">
            Please click the button below to review your design proof and approve it so we can proceed with engraving & handcrafting:
          </p>

          <div style="text-align: center; margin-top: 28px;">
            <a href="${data.proofLink || `${BUSINESS_CONFIG.domain}/proof/${data.orderId}`}" 
               style="background-color: #FF2E93; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; display: inline-block;">
               Review & Approve Design Proof
            </a>
          </div>
        </div>
        ${BRAND_FOOTER}
      </div>
    `,
  };
}
