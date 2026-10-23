// =============================================================================
// Contact Inquiry Mutations
// =============================================================================
// Writes for contact form submissions.
// =============================================================================

import { prisma } from "~/utils/prisma-client.server";
import type { ContactInquiryInput } from "~/validators/contact-inquiry-input";

export async function createContactInquiry(
  input: ContactInquiryInput
): Promise<{ id: string }> {
  const inquiry = await prisma.contactInquiry.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      message: input.message,
    },
    select: { id: true },
  });

  return inquiry;
}
