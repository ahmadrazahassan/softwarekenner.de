"use client";

import "@/styles/globals.css";

import { fontVariables } from "./fonts";

/** Last resort error page when the root layout itself fails. Renders its own html and body. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="de" className={`${fontVariables} antialiased`}>
      <body className="min-h-dvh">
        <main className="container-content flex flex-col gap-6 py-24">
          <h1 className="type-h1 text-ink">Das hat leider nicht geklappt.</h1>
          <p className="measure type-lead text-text-muted">
            Die Seite konnte nicht geladen werden. Bitte versuchen Sie es in einem Moment erneut.
          </p>
          <div>
            <button type="button" onClick={reset} className="btn btn-primary btn-no-icon">
              <span>Erneut versuchen</span>
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
