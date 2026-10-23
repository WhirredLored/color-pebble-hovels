import { Link } from "react-router";

import type { Route } from "./+types/route";
import { ProjectCard } from "~/components/ProjectCard";
import {
  getAllProjects,
  getProjectBySlug,
  HOME_CENTERPIECE,
} from "~/repositories/project-catalog-queries.server";
import { getFeaturedServices } from "~/repositories/service-catalog-queries.server";
import { BUSINESS_NAME, SERVICE_AREA } from "~/utils/business-contact-info";
import { photoWebPath, photoWebPathLarge } from "~/utils/photo-web-path";

export function meta() {
  return [
    { title: `${BUSINESS_NAME} | Exterior painting, siding and wood repair` },
    {
      name: "description",
      content: `${BUSINESS_NAME}. Exterior painting, siding and wood repair. Residential work in ${SERVICE_AREA}.`,
    },
  ];
}

export async function loader() {
  const centerpieceProject = getProjectBySlug(HOME_CENTERPIECE.projectSlug);

  return {
    serviceArea: SERVICE_AREA,
    services: getFeaturedServices(),
    projects: getAllProjects().map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      coverSrc: photoWebPath(project.slug, project.coverFile),
      coverIsPortrait: project.coverIsPortrait,
    })),
    centerpiece: {
      src: photoWebPathLarge(HOME_CENTERPIECE.projectSlug, HOME_CENTERPIECE.file),
      projectSlug: HOME_CENTERPIECE.projectSlug,
      projectTitle: centerpieceProject?.title ?? "",
    },
  };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { serviceArea, services, projects, centerpiece } = loaderData;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-3xl sm:text-4xl">
        Exterior painting, siding and wood repair
      </h1>
      <p className="mt-3 text-lg">Residential work in {serviceArea}.</p>

      <figure className="mt-10">
        <img
          src={centerpiece.src}
          alt={`${centerpiece.projectTitle}, finished`}
          className="mx-auto max-h-[36rem] w-auto border border-rule"
        />
        <figcaption className="mt-2 text-center text-sm text-muted">
          <Link
            to={`/projects/${centerpiece.projectSlug}`}
            className="text-navy underline underline-offset-4"
          >
            {centerpiece.projectTitle}
          </Link>
        </figcaption>
      </figure>

      <section className="mt-16">
        <h2 className="border-b border-rule pb-2 font-serif text-xl">
          Recent projects
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} {...project} />
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link to="/projects" className="text-navy underline underline-offset-4">
            All projects
          </Link>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="border-b border-rule pb-2 font-serif text-xl">Services</h2>
        <dl className="mt-6 divide-y divide-rule border-b border-rule">
          {services.map((service) => (
            <div key={service.name} className="py-4 sm:flex sm:gap-8">
              <dt className="font-serif text-base text-ink sm:w-56 sm:shrink-0">
                {service.name}
              </dt>
              <dd className="mt-1 text-sm sm:mt-0">{service.description}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm">
          <Link to="/services" className="text-navy underline underline-offset-4">
            All services
          </Link>
        </p>
      </section>
    </div>
  );
}
