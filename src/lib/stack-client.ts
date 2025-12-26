"use client";

import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    home: "/",
    signIn: "/login",
    afterSignIn: "/dashboard",
    afterSignOut: "/",
    signUp: "/login",
    afterSignUp: "/dashboard",
  },
});
