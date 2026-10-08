import { BUSINESS_CONFIG } from './business';

/**
 * Backward compatibility alias for BRAND_CONFIG.
 * Prefer importing BUSINESS_CONFIG directly.
 */
export const BRAND_CONFIG = {
  name: BUSINESS_CONFIG.brandName,
  tagline: BUSINESS_CONFIG.tagline,
  subTagline: BUSINESS_CONFIG.subTagline,
  legalEntityName: BUSINESS_CONFIG.legalName,
  domain: BUSINESS_CONFIG.domain,
  supportEmail: BUSINESS_CONFIG.supportEmail,
  adminEmail: "admin@divineseternity.com",
  phone: BUSINESS_CONFIG.supportPhone,
  whatsappNumber: BUSINESS_CONFIG.whatsappNumber,
  whatsappDisplay: BUSINESS_CONFIG.whatsappDisplay,
  registeredAddress: BUSINESS_CONFIG.address,
  gstin: BUSINESS_CONFIG.gstin,
  currency: BUSINESS_CONFIG.currency,
  currencySymbol: BUSINESS_CONFIG.currencySymbol,
  freeShippingThreshold: BUSINESS_CONFIG.freeShippingThreshold,
  giftWrappingFee: BUSINESS_CONFIG.giftWrappingFee,
  codFee: 0,
  returnWindowDays: BUSINESS_CONFIG.returnWindowDays,
  socialLinks: BUSINESS_CONFIG.socialLinks,
  grievanceOfficer: BUSINESS_CONFIG.grievanceOfficer,
};
