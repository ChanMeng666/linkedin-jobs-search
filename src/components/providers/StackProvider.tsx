"use client";

import { StackProvider as StackAuthProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

export function StackProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackAuthProvider app={stackServerApp}>
      <StackTheme>
        {children}
      </StackTheme>
    </StackAuthProvider>
  );
}
