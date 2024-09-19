import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import MainNavigation from "./components/MainNavigation"; // Adjust the path as necessary

export const meta = () => [
  {
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // Obsługa błędów odpowiedzi HTTP
  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title>
            {error.status} {error.statusText}
          </title>
        </head>
        <body>
          <main className="error">
            <h1>
              {error.status}: {error.statusText}
            </h1>
            <p>{error.data?.message || "Something went wrong!"}</p>
            <p>
              <Link to="/">Back to main page</Link>
            </p>
          </main>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  // Obsługa innych błędów (np. błędy runtime)
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>An error occurred</title>
      </head>
      <body>
        <main className="error">
          <h1>An unexpected error occurred!</h1>
          <p>{(error as Error).message}</p>
          <p>
            <Link to="/">Back to main page</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Opcjonalnie możesz dodać CatchBoundary do obsługi specyficznych błędów HTTP
export function CatchBoundary() {
  const caught = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>
          {(caught as { status: number; statusText: string }).status}{" "}
          {(caught as { status: number; statusText: string }).statusText}
        </title>
      </head>
      <body>
        <main className="error">
          <h1>
            {(caught as { status: number; statusText: string }).status}:{" "}
            {(caught as { status: number; statusText: string }).statusText}
          </h1>
          <p>
            {(caught as { data?: { message?: string } }).data?.message ||
              "Something went wrong!"}
          </p>
          <p>
            <Link to="/">Back to main page</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
