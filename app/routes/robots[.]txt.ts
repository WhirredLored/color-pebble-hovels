export function loader() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://huestonehomes.com/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
