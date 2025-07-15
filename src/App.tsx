import { RouterProvider } from "react-router-dom";
import { Suspense, useEffect } from "react";
import router from "./routes";
import LoadingAnimation from "./components/LoadingAnimation";
import { useAuthStore } from "./store";
import { LocationFilterProvider } from './contexts/LocationFilterContext';

export default function App() {
  const { initializeZitadel, zitadel, setAuthenticated } = useAuthStore();

  useEffect(() => {
    initializeZitadel({
      authority: "https://zitadel.lexdev.ng",
      client_id: "322517876609187854",
      redirect_uri: "https://app.washpro.ng/callback",
      post_logout_redirect_uri: "https://app.washpro.ng",
      scope: "openid email profile, urn:zitadel:iam:org:projects:roles",
    });
  }, [initializeZitadel]);

  useEffect(() => {
    zitadel?.userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

  return (
    <LocationFilterProvider>
      <Suspense fallback={<LoadingAnimation />}>
        <RouterProvider router={router} />
      </Suspense>
    </LocationFilterProvider>
  );
}

