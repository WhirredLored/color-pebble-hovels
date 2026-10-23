// =============================================================================
// Contact Inquiry Input Validation
// =============================================================================
// Zod schema for the public contact form. Applied on the server, in the route
// action, before anything is written to the database.
// =============================================================================

import { z } from "zod";

export const contactInquiryInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(100, "Name is too long."),
  email: z
    .email("Enter a valid email address.")
    .trim()
    .max(200, "Email address is too long."),
  phone: z
    .string()
    .trim()
    .max(40, "Phone number is too long.")
    .optional()
    .transform((value) => (value ? value : null)),
  address: z
    .string()
    .trim()
    .max(200, "Address is too long.")
    .optional()
    .transform((value) => (value ? value : null)),
  message: z
    .string()
    .trim()
    .min(1, "Tell us what you need done.")
    .max(4000, "Message is too long."),
});

export type ContactInquiryInput = z.infer<typeof contactInquiryInputSchema>;

/** Field-keyed error messages, as rendered next to each input. */
export type ContactInquiryFieldErrors = Partial<
  Record<keyof ContactInquiryInput, string>
>;
