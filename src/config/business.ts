/**
 * Divine's Eternity - Authoritative Business Configuration
 * [REVIEW WITH LAWYER] Single source of truth for all legal entity details,
 * contact channels, policies, statutory numbers, and grievance redressal officer.
 */

export const BUSINESS_CONFIG = {
  legalName: "Divine’s Eternity Retail Ventures LLP",
  brandName: "Divine’s Eternity",
  tagline: "Gifts That Stay In Hearts",
  subTagline: "Handcrafted Luxury Jewellery & Bespoke Keepsakes",
  address: "402, Signature Luxury Atelier, Bandra West, Mumbai, Maharashtra 400050, India",
  gstin: "27AAACD8921K1Z4",
  supportEmail: "support@divineseternity.com",
  supportPhone: "+91 93536 52043",
  supportPhoneDisplay: "+91 93536 52043",
  whatsappNumber: "+919353652043",
  whatsappDisplay: "+91 93536 52043",
  domain: "https://divineseternity.com",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 499,
  giftWrappingFee: 99,
  returnWindowDays: 7,

  // Statutory Grievance Redressal Officer under Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 & Consumer Protection (E-Commerce) Rules, 2020
  grievanceOfficer: {
    name: "Sonu Sharma",
    designation: "Grievance Redressal Officer",
    email: "grievance@divineseternity.com",
    phone: "+91 93536 52043",
    address: "402, Signature Luxury Atelier, Bandra West, Mumbai, Maharashtra 400050, India",
    workingHours: "Monday to Saturday, 10:00 AM – 6:00 PM IST",
    redressalTimeline: "Acknowledgement within 48 hours; resolution within 15 working days [REVIEW WITH LAWYER]",
  },

  socialLinks: {
    instagram: "https://instagram.com/divineseternity",
    whatsapp: "https://wa.me/919353652043",
    facebook: "https://facebook.com/divineseternity",
    youtube: "https://youtube.com/@divineseternity",
  },
} as const;

export type BusinessConfig = typeof BUSINESS_CONFIG;
