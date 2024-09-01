"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        icon,
        description,
        action,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className="w-max rounded-xl bg-grey-dark px-6 py-4 shadow-[0px_0px_32px_0px_#0000001A]"
          >
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title && (
                  <span className="heading-s text-grey-light">{title}</span>
                )}
              </div>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
