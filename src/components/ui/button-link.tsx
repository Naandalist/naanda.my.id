import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  external?: boolean;
};

export function ButtonLink({ href, external = false, className, ...props }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={cn("button-link", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}
