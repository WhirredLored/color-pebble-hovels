import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import { BUSINESS_DOMAIN, BUSINESS_NAME } from "~/utils/business-contact-info";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap",
  },
];

export function meta() {
  return [
    { title: BUSINESS_NAME },
    {
      name: "description",
      content: `${BUSINESS_NAME}. Exterior painting, siding and wood repair.`,
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const canonicalUrl = `https://${BUSINESS_DOMAIN}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} />
        <Meta />
        <Links />
      </head>
      <body className="bg-bg text-body font-sans antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = "Something went wrong";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    heading = error.status === 404 ? "Page not found" : "Something went wrong";
    details =
      error.status === 404
        ? "That page does not exist."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-serif text-3xl text-ink">{heading}</h1>
      <p className="mt-4 text-body">{details}</p>
      <p className="mt-6">
        <a className="text-navy underline underline-offset-4" href="/">
          Back to the home page
        </a>
      </p>
      {stack && (
        <pre className="mt-8 w-full overflow-x-auto border border-rule bg-panel p-4 text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
