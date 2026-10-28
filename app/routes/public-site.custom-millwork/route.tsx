import { Link } from "react-router";

import type { Route } from "./+types/route";
import {
  BUSINESS_EMAIL,
  BUSINESS_NAME,
  BUSINESS_PHONE,
  BUSINESS_PHONE_HREF,
  SERVICE_AREA,
} from "~/utils/business-contact-info";
import { photoWebPath } from "~/utils/photo-web-path";

export function meta() {
  return [
    { title: `Custom Carving & Architectural Millwork | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `Custom-fabricated architectural woodwork, cabinet doors, historic ornament reproduction, custom mouldings, and precision windowsills from ${BUSINESS_NAME} in ${SERVICE_AREA}.`,
    },
  ];
}

const FARMHOUSE_SLUG = "farmhouse-siding-and-window-restoration";

export async function loader() {
  return {
    photos: {
      profileShaping: {
        src: photoWebPath(FARMHOUSE_SLUG, "Tablesaw profile skillz 1.JPG"),
        caption: "Custom profile milling using dedicated jigs and tooling.",
      },
      bitTesting: {
        src: photoWebPath(FARMHOUSE_SLUG, "Testing sill Bit 1.jpg"),
        caption: "Testing custom sill cutter bit profile on test stock.",
      },
      layoutSills: {
        src: photoWebPath(FARMHOUSE_SLUG, "Bay Sills Layout 1.jpg"),
        caption: "Laying out replacement sills from on-site opening measurements.",
      },
      finishedWindow: {
        src: photoWebPath(FARMHOUSE_SLUG, "Window 1 Complete 1.JPG"),
        caption:
          "Finished installation: milled replacement sill, custom casing, and matching head cornice.",
      },
    },
  };
}

export default function CustomMillworkPage({ loaderData }: Route.ComponentProps) {
  const { photos } = loaderData;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-2 text-muted">
          <li>
            <Link to="/services" className="text-navy underline underline-offset-4">
              Services
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-body">Custom Carving & Architectural Millwork</li>
        </ol>
      </nav>

      {/* Main Header */}
      <header className="mt-6">
        <h1 className="font-serif text-3xl sm:text-4xl">
          Custom Carving & Architectural Millwork
        </h1>
        <p className="mt-4 text-lg text-ink font-serif leading-relaxed">
          Custom-fabricated architectural woodwork for restoration, replacement,
          and new construction. From a single missing ornament to a complete run
          of matching windowsills or cabinet doors, we produce components to fit
          the dimensions, profiles, and character of the project.
        </p>
      </header>

      {/* Primary Service Offerings */}
      <section className="mt-12">
        <h2 className="border-b border-rule pb-2 font-serif text-2xl">
          What We Fabricate
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="border border-rule bg-panel p-6">
            <h3 className="font-serif text-lg text-ink">
              Custom Cabinet Doors & Panels
            </h3>
            <p className="mt-2 text-sm text-body leading-relaxed">
              Custom cabinet door fronts, decorative panels, raised and recessed
              profiles, carved designs, and replacement components. Ideal for
              period restorations, custom built-in cabinetry, and replicating
              discontinued or non-standard door styles where stock products do
              not match.
            </p>
          </div>

          <div className="border border-rule bg-panel p-6">
            <h3 className="font-serif text-lg text-ink">
              Architectural Ornament Replication
            </h3>
            <p className="mt-2 text-sm text-body leading-relaxed">
              Reproduction of missing or damaged historic wooden ornament,
              including decorative appliqués, rosettes, brackets, carved motifs,
              and architectural details. We work from surviving originals,
              measurements, photographs, or drawings where feasible.
            </p>
          </div>

          <div className="border border-rule bg-panel p-6">
            <h3 className="font-serif text-lg text-ink">
              Cornices & Decorative Mouldings
            </h3>
            <p className="mt-2 text-sm text-body leading-relaxed">
              Custom wooden cornices, window and door head details, pediments,
              crown mouldings, specialty trim profiles, and decorative
              architectural components milled to match original woodwork that is
              no longer commercially available.
            </p>
          </div>

          <div className="border border-rule bg-panel p-6">
            <h3 className="font-serif text-lg text-ink">
              Custom Windowsills & Window Trim
            </h3>
            <p className="mt-2 text-sm text-body leading-relaxed">
              Precision-milled replacement windowsills, matching historic
              profiles, casing, returns, and specialty window components. Milled
              with correct drainage bevels, drip kerfs, and horn extensions to
              integrate seamlessly with historic wall assemblies.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities & Methods */}
      <section className="mt-14 border-t border-rule pt-10">
        <h2 className="font-serif text-2xl">Fabrication Capabilities & Process</h2>
        <p className="mt-3 text-sm text-body leading-relaxed">
          We combine computer-controlled CNC machining with dedicated moulding
          setups and traditional bench joinery. CNC-assisted machining enables
          exact digital tooling paths, symmetrical ornamental carving, and tight
          tolerances across repeated components. Traditional shop setups and
          profile knives allow us to run matching architectural mouldings and
          deep sill bevels in solid lumber.
        </p>

        <div className="mt-6 border border-rule bg-bg p-5 text-sm">
          <h3 className="font-serif text-base text-ink">Feasibility & Evaluation</h3>
          <p className="mt-2 text-body leading-relaxed">
            Every reproduction project begins with a careful evaluation. We do not
            promise that every design, material, or reproduction is possible
            without reviewing the piece first. We inspect the wood species,
            grain orientation, condition of remaining originals, structural
            demands, and required cutter tooling before quoting and accepting a
            custom job.
          </p>
        </div>
      </section>

      {/* How to Order / What Customers Can Provide */}
      <section className="mt-14 border-t border-rule pt-10">
        <h2 className="font-serif text-2xl">What You Can Provide For An Estimate</h2>
        <p className="mt-3 text-sm text-body">
          You do not need finished architectural blueprints to get started. We
          can evaluate your project from any of the following:
        </p>

        <ul className="mt-6 space-y-4 text-sm">
          <li className="flex gap-3">
            <span className="font-serif text-base text-muted shrink-0">•</span>
            <div>
              <strong className="text-ink">Surviving original piece:</strong>{" "}
              Even a broken or rotted sample provides invaluable cross-sectional
              profiles, knife angles, and wood species identification.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-base text-muted shrink-0">•</span>
            <div>
              <strong className="text-ink">Clear photographs:</strong> Photos of
              the piece in place, close-ups of profiles from multiple angles, and
              shots with a tape measure held alongside for scale.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-base text-muted shrink-0">•</span>
            <div>
              <strong className="text-ink">Drawings or sketches:</strong>{" "}
              Hand sketches with dimensions, architect drawings, or digital CAD /
              vector files.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-base text-muted shrink-0">•</span>
            <div>
              <strong className="text-ink">Field measurements:</strong> Exact
              opening heights, widths, jamb depths, and sill projections.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-base text-muted shrink-0">•</span>
            <div>
              <strong className="text-ink">Description of need:</strong> If an
              original is entirely missing, describe the style, period of the
              structure, and what adjoining elements look like.
            </div>
          </li>
        </ul>
      </section>

      {/* Photographic Project Evidence from Farmhouse Restoration */}
      <section className="mt-14 border-t border-rule pt-10">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl">Documented Millwork In The Field</h2>
            <p className="mt-2 text-sm text-muted">
              Actual fabrication and installation photography from our documented
              restoration work.
            </p>
          </div>
          <Link
            to={`/projects/${FARMHOUSE_SLUG}`}
            className="mt-2 text-sm text-navy underline underline-offset-4 sm:mt-0"
          >
            View full farmhouse restoration project →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure className="border border-rule bg-panel p-3">
            <img
              src={photos.profileShaping.src}
              alt="Shaping profile with custom table saw fence"
              className="w-full border border-rule object-cover"
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted">
              {photos.profileShaping.caption}
            </figcaption>
          </figure>

          <figure className="border border-rule bg-panel p-3">
            <img
              src={photos.bitTesting.src}
              alt="Testing custom sill cutter bit"
              className="w-full border border-rule object-cover"
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted">
              {photos.bitTesting.caption}
            </figcaption>
          </figure>

          <figure className="border border-rule bg-panel p-3">
            <img
              src={photos.layoutSills.src}
              alt="Laying out bay sills"
              className="w-full border border-rule object-cover"
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted">
              {photos.layoutSills.caption}
            </figcaption>
          </figure>

          <figure className="border border-rule bg-panel p-3">
            <img
              src={photos.finishedWindow.src}
              alt="Finished window with custom sill and cornice"
              className="w-full border border-rule object-cover"
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted">
              {photos.finishedWindow.caption}
            </figcaption>
          </figure>
        </div>

        <div className="mt-6 border border-rule bg-panel p-5 text-sm">
          <p className="text-body leading-relaxed">
            On our{" "}
            <Link
              to={`/projects/${FARMHOUSE_SLUG}`}
              className="text-navy underline underline-offset-4"
            >
              Farmhouse re-side project
            </Link>
            , we milled 18 replacement windowsills on site to match the original
            historic profiles, along with custom-fabricated head cornices and
            corner caps. Each window received custom-cut returns and horned ends
            to suit individual opening dimensions.
          </p>
        </div>
      </section>

      {/* CTA Box */}
      <section className="mt-14 border border-navy bg-panel p-8 text-center sm:text-left">
        <div className="sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="font-serif text-2xl text-ink">
              Have a piece that needs reproducing?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-body">
              Send us photographs, measurements, drawings, or drop off a sample for
              evaluation. We will review feasibility, material options, and provide
              a detailed estimate.
            </p>
            <p className="mt-3 text-xs text-muted">
              Serving homeowners, builders, and restoration contractors in {SERVICE_AREA}.
            </p>
          </div>

          <div className="mt-6 shrink-0 sm:mt-0">
            <Link
              to="/contact"
              className="inline-block rounded-[3px] bg-navy px-5 py-3 text-sm font-medium text-white hover:bg-ink focus:outline-none"
            >
              Request a Custom Fabrication Estimate
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-rule pt-4 text-xs text-muted sm:flex sm:gap-6">
          {BUSINESS_PHONE && BUSINESS_PHONE_HREF && (
            <div>
              Phone:{" "}
              <a
                href={BUSINESS_PHONE_HREF}
                className="text-navy underline underline-offset-4"
              >
                {BUSINESS_PHONE}
              </a>
            </div>
          )}
          <div>
            Email:{" "}
            <a
              href={`mailto:${BUSINESS_EMAIL}`}
              className="text-navy underline underline-offset-4"
            >
              {BUSINESS_EMAIL}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
