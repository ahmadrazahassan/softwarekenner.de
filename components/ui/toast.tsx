"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Icon } from "./icon";

type ToastItem = { id: number; title: string; text?: string; tone: "positive" | "negative" };
type ShowToast = (toast: Omit<ToastItem, "id">) => void;

const ToastContext = createContext<ShowToast | null>(null);

/** Toast region (Section 7.4). Wrap the app once; call `useToast()` to show a message. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback<ShowToast>((toast) => {
    setToasts((current) => [...current, { ...toast, id: Date.now() + Math.random() }]);
  }, []);

  return (
    <ToastContext value={show}>
      <ToastPrimitive.Provider swipeDirection="right" duration={6000} label="Benachrichtigung">
        {children}
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            type={toast.tone === "negative" ? "foreground" : "background"}
            onOpenChange={(open) => !open && setToasts((current) => current.filter((t) => t.id !== toast.id))}
            className="flex animate-pop-in items-start gap-3 rounded-md border border-line bg-white p-4 shadow-lg data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)"
          >
            <Icon
              icon={toast.tone === "positive" ? CircleCheck : CircleAlert}
              size={20}
              className={cn(
                "mt-0.5 flex-none",
                toast.tone === "positive" ? "text-positive" : "text-negative",
              )}
            />
            <div className="flex-1">
              <ToastPrimitive.Title className="type-label font-semibold text-ink">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.text && (
                <ToastPrimitive.Description className="mt-1 type-small text-text-muted">
                  {toast.text}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              aria-label="Schließen"
              className="btn btn-ghost -mt-2 -mr-2 size-11 rounded-full p-0"
            >
              <Icon icon={X} size={16} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-[60] flex w-full max-w-md flex-col gap-3 p-4 outline-none sm:p-6" />
      </ToastPrimitive.Provider>
    </ToastContext>
  );
}

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast muss innerhalb von ToastProvider verwendet werden.");
  return show;
}
