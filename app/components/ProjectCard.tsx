import { Link } from "react-router";

interface ProjectCardProps {
  slug: string;
  title: string;
  summary: string;
  coverSrc: string;
  coverIsPortrait: boolean;
}

export function ProjectCard({
  slug,
  title,
  summary,
  coverSrc,
  coverIsPortrait,
}: ProjectCardProps) {
  return (
    <article className="border border-rule">
      <Link to={`/projects/${slug}`} className="block">
        <div className="aspect-4/3 w-full bg-panel">
          <img
            src={coverSrc}
            alt={title}
            loading="lazy"
            className={`h-full w-full ${
              coverIsPortrait ? "object-contain" : "object-cover"
            }`}
          />
        </div>
      </Link>
      <div className="border-t border-rule p-4">
        <h3 className="font-serif text-lg">
          <Link
            to={`/projects/${slug}`}
            className="text-ink hover:text-navy hover:underline hover:underline-offset-4"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-body">{summary}</p>
      </div>
    </article>
  );
}
