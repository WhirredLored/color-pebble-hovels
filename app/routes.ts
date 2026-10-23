import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/public-site/route.tsx", [
    index("routes/public-site.home/route.tsx"),
    route("services", "routes/public-site.services/route.tsx"),
    route("projects", "routes/public-site.projects/route.tsx"),
    route("projects/:slug", "routes/public-site.project-detail/route.tsx"),
    route("process", "routes/public-site.process/route.tsx"),
    route("contact", "routes/public-site.contact/route.tsx"),
  ]),
] satisfies RouteConfig;
