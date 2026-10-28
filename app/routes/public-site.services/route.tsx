import { Link } from "react-router";

import type { Route } from "./+types/route";
import { getAllServices } from "~/repositories/service-catalog-queries.server";
import { BUSINESS_NAME } from "~/utils/business-contact-info";

export function meta() {
  return [
    { title: `Services | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `Exterior painting, surface preparation, siding, rot repair, and custom carving & architectural millwork from ${BUSINESS_NAME}.`,
    },
  ];
}

export async function loader() {
  return { services: getAllServices() };
}

export default function ServicesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl">Services</h1>

      <dl className="mt-8 divide-y divide-rule border-t border-b border-rule">
        {loaderData.services.map((service) => (
          <div key={service.name} className="py-5 sm:flex sm:gap-8">
            <dt className="font-serif text-base text-ink sm:w-56 sm:shrink-0">
              {service.href ? (
                <Link
                  to={service.href}
                  className="text-navy hover:underline underline-offset-4"
                >
                  {service.name}
                </Link>
              ) : (
                service.name
              )}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0">
              <p className="leading-relaxed">{service.description}</p>
              {service.href && (
                <p className="mt-2 text-sm">
                  <Link
                    to={service.href}
                    className="text-navy underline underline-offset-4"
                  >
                    {service.detailLabel || "Detailed capabilities & estimate info"} →
                  </Link>
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Prominent Custom Millwork Callout Section */}
      <section className="mt-10 border border-rule bg-panel p-6">
        <h2 className="font-serif text-xl text-ink">
          Custom Carving & Architectural Millwork
        </h2>
        <p className="mt-2 text-sm text-body leading-relaxed">
          Need a missing historic bracket, replica cornice, custom cabinet door,
          or precision-milled windowsills? Using CNC-assisted machining, dedicated
          shaper setups, and bench craftsmanship, we reproduce components to
          match surviving originals or custom specifications.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <Link
            to="/contact"
            className="rounded-[3px] bg-navy px-4 py-2 font-medium text-white hover:bg-ink"
          >
            Request a Custom Fabrication Estimate
          </Link>
          <Link
            to="/custom-millwork"
            className="text-navy underline underline-offset-4"
          >
            View dedicated millwork page →
          </Link>
        </div>
      </section>

      <p className="mt-8 text-sm">
        <Link to="/projects" className="text-navy underline underline-offset-4">
          See this work on recent projects
        </Link>
      </p>
    </div>
  );
}
