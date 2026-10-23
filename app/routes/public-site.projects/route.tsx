import type { Route } from "./+types/route";
import { ProjectCard } from "~/components/ProjectCard";
import { getAllProjects } from "~/repositories/project-catalog-queries.server";
import { BUSINESS_NAME } from "~/utils/business-contact-info";
import { photoWebPath } from "~/utils/photo-web-path";

export function meta() {
  return [
    { title: `Projects | ${BUSINESS_NAME}` },
    {
      name: "description",
      content: `Completed exterior painting, siding and wood repair projects by ${BUSINESS_NAME}.`,
    },
  ];
}

export async function loader() {
  return {
    projects: getAllProjects().map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      coverSrc: photoWebPath(project.slug, project.coverFile),
      coverIsPortrait: project.coverIsPortrait,
    })),
  };
}

export default function ProjectsPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-3xl">Projects</h1>
      <p className="mt-3 text-sm text-muted">
        Each project is shown in the order the work happened.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loaderData.projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </div>
  );
}
