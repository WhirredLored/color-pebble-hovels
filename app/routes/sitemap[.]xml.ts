import { getAllProjects } from "~/repositories/project-catalog-queries.server";
import { BUSINESS_DOMAIN } from "~/utils/business-contact-info";

export function loader() {
  // Always advertise the canonical production origin, even when served from
  // workers.dev or the www host.
  const domain = `https://${BUSINESS_DOMAIN}`;

  const staticRoutes = [
    { loc: `${domain}/`, priority: "1.0", changefreq: "weekly" },
    { loc: `${domain}/services`, priority: "0.9", changefreq: "monthly" },
    { loc: `${domain}/projects`, priority: "0.9", changefreq: "weekly" },
    { loc: `${domain}/process`, priority: "0.8", changefreq: "monthly" },
    { loc: `${domain}/contact`, priority: "0.8", changefreq: "monthly" },
  ];

  const projects = getAllProjects();
  const projectRoutes = projects.map((project) => ({
    loc: `${domain}/projects/${project.slug}`,
    priority: "0.85",
    changefreq: "monthly",
  }));

  const allUrls = [...staticRoutes, ...projectRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
