"use client";

import { CircleAlert, CircleCheck, Download } from "lucide-react";
import { useState } from "react";

import type { ConfirmResult } from "@/app/actions/forms";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/components/ui/button-base";
import { Notice } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";

const BUTTON: Record<"newsletter" | "download" | "review", string> = {
  newsletter: "Anmeldung bestätigen",
  download: "E-Mail bestätigen und Leitfaden öffnen",
  review: "Bewertung bestätigen",
};

/**
 * Double opt in confirmation. The link only opens this page; the confirmation itself needs a click,
 * so mail scanners that open links cannot confirm for anyone.
 */
export function ConfirmPanel({
  token,
  purpose,
  action,
}: {
  token: string;
  purpose: "newsletter" | "download" | "review";
  action: (token: string) => Promise<ConfirmResult>;
}) {
  const [state, setState] = useState<"idle" | "sending" | ConfirmResult>("idle");

  if (typeof state === "object" && state.ok) {
    return (
      <div role="status" className="flex flex-col gap-5">
        <Notice tone="positive" icon={CircleCheck} title="Vielen Dank, bestätigt.">
          {state.purpose === "newsletter" && "Sie erhalten unseren Newsletter ab der nächsten Ausgabe."}
          {state.purpose === "review" &&
            "Wir prüfen Ihre Bewertung jetzt anhand unserer Richtlinien und veröffentlichen sie danach."}
          {state.purpose === "download" &&
            state.download &&
            `Ihr Leitfaden „${state.download.title}“ steht bereit.`}
        </Notice>
        {state.purpose === "download" && state.download && (
          <a
            href={state.download.file}
            download
            className={buttonClass({ icon: "none", className: "gap-2 self-start" })}
          >
            <Icon icon={Download} size={20} />
            <span>PDF herunterladen</span>
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {typeof state === "object" && !state.ok && (
        <Notice tone="negative" icon={CircleAlert}>
          {state.message}
        </Notice>
      )}
      <Button
        className="self-start"
        loading={state === "sending"}
        onClick={async () => {
          setState("sending");
          setState(await action(token));
        }}
      >
        {BUTTON[purpose]}
      </Button>
    </div>
  );
}
