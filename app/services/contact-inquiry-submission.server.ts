// =============================================================================
// Contact Inquiry Submission
// =============================================================================
// Validates a contact form submission and stores it. Returns a typed result
// rather than throwing, so the route action can render the outcome inline.
// =============================================================================

import { createContactInquiry } from "~/repositories/contact-inquiry-mutations.server";
import {
  contactInquiryInputSchema,
  type ContactInquiryFieldErrors,
  type ContactInquiryInput,
} from "~/validators/contact-inquiry-input";

export type ContactInquiryResult =
  | { status: "success" }
  | { status: "invalid"; fieldErrors: ContactInquiryFieldErrors; values: RawValues }
  | { status: "error"; values: RawValues };

type RawValues = Record<keyof ContactInquiryInput, string>;

function readValues(formData: FormData): RawValues {
  const read = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  return {
    name: read("name"),
    email: read("email"),
    phone: read("phone"),
    address: read("address"),
    message: read("message"),
  };
}

export async function submitContactInquiry(
  formData: FormData
): Promise<ContactInquiryResult> {
  const values = readValues(formData);
  const parsed = contactInquiryInputSchema.safeParse(values);

  if (!parsed.success) {
    const fieldErrors: ContactInquiryFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof ContactInquiryInput | undefined;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return { status: "invalid", fieldErrors, values };
  }

  try {
    await createContactInquiry(parsed.data);
    return { status: "success" };
  } catch (error) {
    console.error("Failed to store contact inquiry", error);
    return { status: "error", values };
  }
}
