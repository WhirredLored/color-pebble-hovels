// =============================================================================
// Business Contact Information
// =============================================================================
// Every name, phone number, address and service-area string rendered anywhere
// on the public site comes from here. Values marked TODO are placeholders that
// have not been confirmed by the business yet — fill them in here and they
// update everywhere at once.
// =============================================================================

export const BUSINESS_NAME = "Huestones Paint Restoration LLC";

export const BUSINESS_EMAIL = "estimates@huestonehomes.com";

/**
 * TODO: replace with the real business phone number.
 * Rendered as text and as the tel: link on the contact page. While it is null
 * the site shows the email instead and no phone line is rendered.
 */
export const BUSINESS_PHONE = null as string | null;

/**
 * TODO: confirm the service area. "Iowa" is the only claim the business has
 * confirmed; narrow this to the counties or towns actually covered.
 */
export const SERVICE_AREA = "Iowa";

/** Used once, in the footer. */
export const BUSINESS_DOMAIN = "huestonehomes.com";

/** Digits only, for the tel: href. Null whenever BUSINESS_PHONE is null. */
export const BUSINESS_PHONE_HREF: string | null = BUSINESS_PHONE
  ? `tel:${BUSINESS_PHONE.replace(/\D/g, "")}`
  : null;
