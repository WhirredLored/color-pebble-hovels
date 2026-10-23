import { Form } from "react-router";

import type { Route } from "./+types/route";
import { submitContactInquiry } from "~/services/contact-inquiry-submission.server";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  SERVICE_AREA,
} from "~/utils/business-contact-info";

export function meta() {
  return [
    { title: `Contact | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `Contact ${BUSINESS_NAME} about exterior painting, siding and wood repair in ${SERVICE_AREA}.`,
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  return submitContactInquiry(formData);
}

const FIELD_CLASS =
  "mt-1 w-full rounded-[3px] border border-rule bg-bg px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none";

export default function ContactPage({ actionData }: Route.ComponentProps) {
  const fieldErrors =
    actionData?.status === "invalid" ? actionData.fieldErrors : {};
  const values = actionData?.status === "success" ? undefined : actionData?.values;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl">Contact</h1>

      <dl className="mt-8 divide-y divide-rule border-t border-b border-rule text-sm">
        {BUSINESS_PHONE && BUSINESS_PHONE_HREF && (
          <div className="py-4 sm:flex sm:gap-8">
            <dt className="text-muted sm:w-32 sm:shrink-0">Phone</dt>
            <dd className="mt-1 sm:mt-0">
              <a
                href={BUSINESS_PHONE_HREF}
                className="text-navy underline underline-offset-4"
              >
                {BUSINESS_PHONE}
              </a>
            </dd>
          </div>
        )}
        <div className="py-4 sm:flex sm:gap-8">
          <dt className="text-muted sm:w-32 sm:shrink-0">Email</dt>
          <dd className="mt-1 sm:mt-0">
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-navy underline underline-offset-4"
            >
              {BUSINESS_EMAIL}
            </a>
          </dd>
        </div>
        <div className="py-4 sm:flex sm:gap-8">
          <dt className="text-muted sm:w-32 sm:shrink-0">Service area</dt>
          <dd className="mt-1 sm:mt-0">{SERVICE_AREA}</dd>
        </div>
      </dl>

      {actionData?.status === "success" ? (
        <div className="mt-10 border border-rule bg-panel p-5">
          <h2 className="font-serif text-lg">Message received</h2>
          <p className="mt-2 text-sm">
            Your message has been recorded. We will get back to you at the email
            address you gave.
          </p>
        </div>
      ) : (
        <>
          <h2 className="mt-12 border-b border-rule pb-2 font-serif text-xl">
            Send a message
          </h2>

          {actionData?.status === "error" && (
            <p className="mt-6 border border-accent p-4 text-sm text-accent">
              Your message could not be saved. Please email{" "}
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="underline underline-offset-4"
              >
                {BUSINESS_EMAIL}
              </a>{" "}
              instead.
            </p>
          )}

          <Form method="post" className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="text-sm text-ink">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={values?.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={FIELD_CLASS}
              />
              {fieldErrors.name && (
                <p id="name-error" className="mt-1 text-sm text-accent">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={values?.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={FIELD_CLASS}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-accent">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="text-sm text-ink">
                Phone <span className="text-muted">(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={values?.phone}
                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                className={FIELD_CLASS}
              />
              {fieldErrors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-accent">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="text-sm text-ink">
                Address of the property{" "}
                <span className="text-muted">(optional)</span>
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={values?.address}
                aria-describedby={
                  fieldErrors.address ? "address-error" : undefined
                }
                className={FIELD_CLASS}
              />
              {fieldErrors.address && (
                <p id="address-error" className="mt-1 text-sm text-accent">
                  {fieldErrors.address}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-ink">
                What needs doing
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                defaultValue={values?.message}
                aria-describedby={
                  fieldErrors.message ? "message-error" : undefined
                }
                className={FIELD_CLASS}
              />
              {fieldErrors.message && (
                <p id="message-error" className="mt-1 text-sm text-accent">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="rounded-[3px] border border-navy bg-navy px-4 py-2 text-sm text-white hover:bg-ink"
            >
              Send
            </button>
          </Form>
        </>
      )}
    </div>
  );
}
