import {
  Banknote,
  Boxes,
  Calculator,
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

import type { CategoryData } from "./schemas";

/** Approved category icons (Section 5.7), keyed by the name stored in content. */
export const CATEGORY_ICONS: Record<CategoryData["icon"], LucideIcon> = {
  Calculator,
  ReceiptText,
  Banknote,
  Users,
  Clock,
  SquareKanban,
  Handshake,
  Boxes,
  ShoppingBag,
  MessagesSquare,
  FolderOpen,
  Mail,
  CreditCard,
  Signature,
};
