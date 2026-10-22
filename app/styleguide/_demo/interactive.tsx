"use client";

import {
  Building2,
  Clock,
  Info,
  Calculator,
  Users,
  Smartphone,
  Plug,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";

import { Button, IconButton } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { LocalVendorToggle, Select } from "@/components/ui/form";
import { Icon } from "@/components/ui/icon";
import {
  DialogContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SheetContent,
  Tooltip,
} from "@/components/ui/overlay";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { CompareTray } from "@/components/software/compare";
import { FilterBar, type FilterGroup, type FilterState } from "@/components/software/filter-bar";
import { Softwarefinder, type FinderAnswers } from "@/components/software/softwarefinder";
import { formatNumber } from "@/lib/format";

const FILTER_GROUPS: FilterGroup[] = [
  {
    id: "preis",
    label: "Preis",
    options: [
      { value: "kostenlos", label: "Kostenlose Version" },
      { value: "bis-20", label: "bis 20 € pro Monat" },
      { value: "bis-50", label: "bis 50 € pro Monat" },
    ],
  },
  {
    id: "groesse",
    label: "Unternehmensgröße",
    options: [
      { value: "solo", label: "Selbstständige" },
      { value: "1-9", label: "1 bis 9 Mitarbeitende" },
      { value: "10-49", label: "10 bis 49 Mitarbeitende" },
      { value: "50-249", label: "50 bis 249 Mitarbeitende" },
    ],
  },
  {
    id: "bereitstellung",
    label: "Bereitstellung",
    options: [
      { value: "cloud", label: "Cloud" },
      { value: "on-premises", label: "Eigener Server" },
    ],
  },
  {
    id: "server",
    label: "Serverstandort",
    options: [
      { value: "DE", label: "Deutschland" },
      { value: "EU", label: "EU" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    options: [
      { value: "gobd", label: "GoBD" },
      { value: "xrechnung", label: "XRechnung" },
      { value: "iso27001", label: "ISO 27001" },
    ],
  },
  {
    id: "schnittstellen",
    label: "Schnittstellen",
    options: [
      { value: "datev", label: "DATEV" },
      { value: "elster", label: "ELSTER" },
    ],
  },
  { id: "testphase", label: "Testphase", options: [{ value: "ja", label: "Mit Testphase" }] },
];

const SORT_OPTIONS = [
  { value: "empfohlen", label: "Empfohlen" },
  { value: "wertung", label: "Beste Wertung" },
  { value: "preis", label: "Preis aufsteigend" },
  { value: "name", label: "Name A bis Z" },
];

export function ResultsHeaderDemo() {
  const [filters, setFilters] = useState<FilterState>({});
  const [local, setLocal] = useState(false);
  const [sort, setSort] = useState("empfohlen");
  const active = Object.values(filters).flat().length;
  const count = Math.max(1, 20 - active * 3 - (local ? 6 : 0));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="type-h4 text-ink" aria-live="polite">
          {formatNumber(count)} Programme
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <LocalVendorToggle checked={local} onCheckedChange={setLocal} />
          <div className="flex items-center gap-2">
            <span className="type-label text-text-muted">Sortieren nach:</span>
            <Select
              options={SORT_OPTIONS}
              value={sort}
              onValueChange={setSort}
              className="h-11 w-48"
              triggerProps={{ "aria-label": "Sortieren nach" }}
            />
          </div>
        </div>
      </div>
      <FilterBar groups={FILTER_GROUPS} value={filters} onChange={setFilters} resultCount={count} />
    </div>
  );
}

export function CompareTrayDemo() {
  return <CompareTray onCompare={() => document.getElementById("vergleichstabelle")?.scrollIntoView()} />;
}

export function SoftwarefinderDemo() {
  const [result, setResult] = useState<FinderAnswers | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <Softwarefinder
        onComplete={setResult}
        steps={[
          {
            id: "kategorie",
            question: "Welche Software suchen Sie?",
            options: [
              { value: "buchhaltung", label: "Buchhaltung", icon: Calculator },
              { value: "hr-software", label: "HR-Software", icon: Users },
              { value: "zeiterfassung", label: "Zeiterfassung", icon: Clock },
            ],
          },
          {
            id: "groesse",
            question: "Wie groß ist Ihr Unternehmen?",
            options: [
              { value: "solo", label: "Selbstständig", icon: Building2 },
              { value: "1-9", label: "1 bis 9 Mitarbeitende", icon: Building2 },
              { value: "10-49", label: "10 bis 49 Mitarbeitende", icon: Building2 },
              { value: "50-249", label: "50 bis 249 Mitarbeitende", icon: Building2 },
            ],
          },
          {
            id: "anforderungen",
            question: "Was ist Ihnen besonders wichtig?",
            hint: "Mehrfachauswahl möglich",
            multiple: true,
            options: [
              { value: "server-de", label: "Server in Deutschland", icon: ShieldCheck },
              { value: "datev", label: "DATEV-Schnittstelle", icon: Plug },
              { value: "app", label: "Mobile App", icon: Smartphone },
            ],
          },
        ]}
      />
      {result && (
        <p role="status" className="type-small text-text-muted">
          Demo: Antworten {JSON.stringify(result)}. Die Auswertung folgt in Phase 4.
        </p>
      )}
    </div>
  );
}

function ToastButtons() {
  const toast = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        icon="none"
        onClick={() =>
          toast({
            tone: "positive",
            title: "Gespeichert",
            text: "Vielen Dank. Wir haben Ihre Anfrage erhalten und melden uns per E-Mail.",
          })
        }
      >
        Erfolgsmeldung zeigen
      </Button>
      <Button
        variant="outline"
        icon="none"
        onClick={() =>
          toast({
            tone: "negative",
            title: "Fehler",
            text: "Das hat leider nicht geklappt. Bitte versuchen Sie es in einem Moment erneut.",
          })
        }
      >
        Fehlermeldung zeigen
      </Button>
    </div>
  );
}

export function OverlayDemo() {
  return (
    <ToastProvider>
      <div className="flex flex-wrap items-center gap-3">
        <DialogPrimitive.Root>
          <DialogPrimitive.Trigger asChild>
            <Button variant="outline" icon="none">
              Dialog öffnen
            </Button>
          </DialogPrimitive.Trigger>
          <DialogContent title="Bewertung melden" description="Warum möchten Sie diese Bewertung melden?">
            <div className="flex flex-col gap-4">
              <Field label="Begründung">{(a11y) => <Input {...a11y} />}</Field>
              <DialogPrimitive.Close asChild>
                <Button>Meldung senden</Button>
              </DialogPrimitive.Close>
            </div>
          </DialogContent>
        </DialogPrimitive.Root>

        <DialogPrimitive.Root>
          <DialogPrimitive.Trigger asChild>
            <Button variant="outline" icon="none">
              Seitenleiste öffnen
            </Button>
          </DialogPrimitive.Trigger>
          <SheetContent
            title="Seitenleiste"
            footer={
              <Button block icon="none">
                12 Ergebnisse anzeigen
              </Button>
            }
          >
            <p className="type-body text-text-muted">Inhalt einer Seitenleiste, zum Beispiel alle Filter.</p>
          </SheetContent>
        </DialogPrimitive.Root>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" icon="none">
              Popover öffnen
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="type-small text-ink">Kurzer Zusatzinhalt in einem Popover.</p>
          </PopoverContent>
        </Popover>

        <Tooltip content={"Netto heißt: zuzüglich 19 % Mehrwertsteuer."}>
          <button
            type="button"
            className="btn btn-ghost size-11 rounded-full p-0"
            aria-label="Was bedeutet netto?"
          >
            <Icon icon={Info} size={20} />
          </button>
        </Tooltip>
      </div>
      <div className="mt-6">
        <ToastButtons />
      </div>
    </ToastProvider>
  );
}

export function IconButtonDemo() {
  return (
    <>
      <IconButton icon={ChevronRight} label="Nächste Folien" />
      <IconButton icon={ChevronRight} label="Nächste Folien, deaktiviert" disabled />
    </>
  );
}
