import {
  Boxes,
  Calculator,
  Banknote,
  Clock,
  CreditCard,
  FolderOpen,
  Handshake,
  Mail,
  MessagesSquare,
  ReceiptText,
  ShoppingBag,
  Signature,
  SquareKanban,
  Users,
  type LucideIcon,
} from "lucide-react";

export type CategoryNav = { slug: string; name: string; shortName: string; icon: LucideIcon };

/** Launch categories in launch order (Section 16.1) with the approved icons (Section 5.7). */
export const CATEGORIES: CategoryNav[] = [
  { slug: "buchhaltung", name: "Buchhaltungssoftware", shortName: "Buchhaltung", icon: Calculator },
  {
    slug: "rechnungsprogramme",
    name: "Rechnungsprogramme und E-Rechnung",
    shortName: "Rechnungen",
    icon: ReceiptText,
  },
  { slug: "lohnabrechnung", name: "Lohnabrechnung", shortName: "Lohn", icon: Banknote },
  { slug: "hr-software", name: "HR-Software", shortName: "HR", icon: Users },
  { slug: "zeiterfassung", name: "Zeiterfassung", shortName: "Zeiterfassung", icon: Clock },
  { slug: "projektmanagement", name: "Projektmanagement", shortName: "Projekte", icon: SquareKanban },
  { slug: "crm", name: "CRM-Software", shortName: "CRM", icon: Handshake },
  { slug: "erp", name: "ERP und Warenwirtschaft", shortName: "ERP", icon: Boxes },
  { slug: "shopsysteme", name: "Shopsysteme", shortName: "Shopsysteme", icon: ShoppingBag },
  {
    slug: "kollaboration",
    name: "Kollaboration und Kommunikation",
    shortName: "Kollaboration",
    icon: MessagesSquare,
  },
  { slug: "dokumentenmanagement", name: "Dokumentenmanagement", shortName: "DMS", icon: FolderOpen },
  { slug: "e-mail-marketing", name: "E-Mail-Marketing", shortName: "E-Mail-Marketing", icon: Mail },
  { slug: "kassensysteme", name: "Kassensysteme", shortName: "Kassen", icon: CreditCard },
  { slug: "e-signatur", name: "E-Signatur", shortName: "E-Signatur", icon: Signature },
];

export type NavItem = { href: string; label: string };

/** Main navigation. Ratgeber and Leitfäden only appear while they have content (getSiteChrome). */
export const MAIN_NAV: NavItem[] = [
  { href: "/software", label: "Software" },
  { href: "/vergleich", label: "Vergleiche" },
  { href: "/ratgeber", label: "Ratgeber" },
  { href: "/leitfaeden", label: "Leitfäden" },
  { href: "/fuer-anbieter", label: "Für Anbieter" },
];

export const FOOTER_COMPANY = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/redaktion", label: "Redaktion" },
  { href: "/methodik", label: "Methodik" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/fuer-anbieter", label: "Für Anbieter" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookie-einstellungen", label: "Cookie-Einstellungen" },
  { href: "/transparenz", label: "Transparenz" },
  { href: "/barrierefreiheit", label: "Barrierefreiheit" },
] as const;

export const categoryHref = (slug: string) => `/kategorien/${slug}`;
