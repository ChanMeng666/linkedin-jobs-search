import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
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
