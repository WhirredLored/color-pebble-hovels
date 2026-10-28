import { Link } from "react-router";

import {
  BUSINESS_DOMAIN,
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  SERVICE_AREA,
} from "~/utils/business-contact-info";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule bg-panel">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="font-serif text-base text-ink">{BUSINESS_NAME}</p>
            <p className="mt-2 text-muted">
              Residential exterior finishing, rot repair, and custom architectural millwork in {SERVICE_AREA}.
            </p>
            <p className="mt-3">
              <Link
                to="/custom-millwork"
                className="text-navy underline underline-offset-4 text-xs"
              >
                Custom Carving & Architectural Millwork →
              </Link>
            </p>
          </div>

          <div>
            <p className="text-muted">Contact</p>
            <ul className="mt-2 space-y-1">
              <li>
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="text-navy underline underline-offset-4"
                >
                  {BUSINESS_EMAIL}
                </a>
              </li>
              {BUSINESS_PHONE && BUSINESS_PHONE_HREF && (
                <li>
                  <a
                    href={BUSINESS_PHONE_HREF}
                    className="text-navy underline underline-offset-4"
                  >
                    {BUSINESS_PHONE}
                  </a>
                </li>
              )}
              <li>
                <Link
                  to="/contact"
                  className="text-navy underline underline-offset-4"
                >
                  Contact form
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-rule pt-6 text-muted">
          {BUSINESS_NAME} · {BUSINESS_DOMAIN}
        </p>
      </div>
    </footer>
  );
}
