"use client";

import { StackProvider as StackAuthProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/lib/stack-client";

export function StackProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackAuthProvider app={stackClientApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackAuthProvider>
  );
}
