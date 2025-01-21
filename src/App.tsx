import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./routes";
import LoadingAnimation from "./components/LoadingAnimation";

export default function App() {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
