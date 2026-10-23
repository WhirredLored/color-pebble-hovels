import { Link } from "react-router";

import type { Route } from "./+types/route";
import { getAllServices } from "~/repositories/service-catalog-queries.server";
import { BUSINESS_NAME } from "~/utils/business-contact-info";

export function meta() {
  return [
    { title: `Services | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `Exterior painting, surface preparation, siding, wood and rot repair, trim and millwork from ${BUSINESS_NAME}.`,
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
              {service.name}
            </dt>
            <dd className="mt-1 text-sm sm:mt-0">{service.description}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 text-sm">
        <Link to="/projects" className="text-navy underline underline-offset-4">
          See this work on recent projects
        </Link>
      </p>
    </div>
  );
}
