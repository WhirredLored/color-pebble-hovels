import { Link } from "react-router";

import type { Route } from "./+types/route";
import { ProjectPhotoGallery } from "~/components/ProjectPhotoGallery";
import { getProjectBySlug } from "~/repositories/project-catalog-queries.server";
import { BUSINESS_NAME } from "~/utils/business-contact-info";
import { sequenceProjectPhotos } from "~/utils/project-photo-sequence";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData.title} | ${BUSINESS_NAME}` },
    { name: "description", content: loaderData.summary },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    throw new Response("Project not found", { status: 404 });
  }

  return {
    title: project.title,
    summary: project.summary,
    photos: sequenceProjectPhotos(project),
  };
}

export default function ProjectDetailPage({ loaderData }: Route.ComponentProps) {
  const { title, summary, photos } = loaderData;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm">
        <Link to="/projects" className="text-navy underline underline-offset-4">
          Projects
        </Link>
      </p>

      <h1 className="mt-4 font-serif text-3xl">{title}</h1>
      <p className="mt-3 max-w-2xl">{summary}</p>
      <p className="mt-6 text-sm text-muted">
        {photos.length} photographs, numbered in the order the work was done.
      </p>

      <ProjectPhotoGallery photos={photos} />
    </div>
  );
}
