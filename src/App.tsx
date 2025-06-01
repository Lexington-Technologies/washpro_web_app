import { RouterProvider } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import router from "./routes";
import LoadingAnimation from "./components/LoadingAnimation";
import { useAuthStore } from "./store";

export default function App() {
  const { initializeZitadel, zitadel, setAuthenticated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initializeZitadel({
      authority: "https://zitadel.lexdev.ng",
      client_id: "322517876609187854",
      redirect_uri: "http://localhost:5173/callback",
      post_logout_redirect_uri: "http://localhost:5173",
      scope: "openid email profile, urn:zitadel:iam:org:projects:roles",
    });
  }, [initializeZitadel]);

  useEffect(() => {
    zitadel?.userManager.getUser().then((user) => {
      console.log('user', user);
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);


  return (
    <Suspense fallback={<LoadingAnimation />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

