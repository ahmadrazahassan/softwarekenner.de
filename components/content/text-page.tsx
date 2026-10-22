import type { ReactNode } from "react";

import type { Crumb } from "@/components/layout/breadcrumbs";

import { PageHeader } from "./page-parts";

/** Simple text page: header plus a reading column with the brand prose styles. */
export function TextPage({
  crumbs,
  title,
  lead,
  children,
  before,
  after,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  /** Rendered above the prose, outside of it (notes, cards). */
  before?: ReactNode;
  /** Rendered below the prose, outside of it (forms). */
  after?: ReactNode;
}) {
  return (
    <>
      <PageHeader crumbs={crumbs} title={title} lead={lead} />
      <div className="container-reading flex flex-col gap-8 pb-20">
        {before}
        <div className="prose-brand">{children}</div>
        {after}
      </div>
    </>
  );
}
