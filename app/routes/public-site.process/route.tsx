import type { Route } from "./+types/route";
import { getProcessSteps } from "~/repositories/process-steps-queries.server";
import { BUSINESS_NAME } from "~/utils/business-contact-info";

export function meta() {
  return [
    { title: `Process | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `How a job runs with ${BUSINESS_NAME}, from the first site visit to the final walkthrough.`,
    },
  ];
}

export async function loader() {
  return { steps: getProcessSteps() };
}

export default function ProcessPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl">Process</h1>
      <p className="mt-3">How a job runs, start to finish.</p>

      <ol className="mt-8 divide-y divide-rule border-t border-b border-rule">
        {loaderData.steps.map((step, index) => (
          <li key={step.name} className="flex gap-4 py-5">
            <span className="w-6 shrink-0 font-serif text-base text-muted">
              {index + 1}.
            </span>
            <div>
              <h2 className="font-serif text-base text-ink">{step.name}</h2>
              <p className="mt-1 text-sm">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
