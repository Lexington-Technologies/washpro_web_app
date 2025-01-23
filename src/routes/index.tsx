import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import ForgotPassword from "../pages/authentication/forgot-password";
import WaterDetails from "../pages/water-sources/WaterDetails";
import DumpSiteDetails from "../pages/dump-site/DumpSiteDetails";
import Reports from "../pages/reports/Reports";
import GutterDetails from "../pages/gutters/GutterDetails";
import SoakAwayDetails from "../pages/soak-aways/SoakAwayDetails";
import OpenDeficationDetails from "../pages/open-defecation/OpenDeficationDetails";
// import Wrapper from "../components/wrapper";
// import Dashboard from "../pages/dashboard/dashboard";
// import DumpSites from "../pages/dump-site/DumpSite";
// import Interventions from "../pages/interventions/Interventions";
// import PublicSpaceTypes from "../pages/public-space-type/PublicSpaceTypes";
// import ToiletFacilities from "../pages/toilet-facilities/ToiletFacilities";
// import Gutters from "../pages/gutters/Gutters";
// import SoakAways from "../pages/soak-aways/SoakAways";
// import WaterSourceRiskMonitoring from "../pages/monitor/WaterSourceRiskMonitoring";
// import OpenDefication from "../pages/open-defecation/OpenDefication";
// import WaterSources from "../pages/water-sources/WaterSources";
// import NeedAndMaintainers from "../pages/needs-and-maintainers/needs-and-maintainers";
// import Sanitation from "../pages/sanitation/Sanitation";
// import Monitoring from "../pages/field-monitoring/FieldMonitoring";
// import Wash from "../pages/wash/Wash";
// import Enumerator from "../pages/enumerator/Enumerator";
// import SignIn from "../pages/authentication/sign-in";
// import AccountSetUp from "../pages/authentication/account-setup";
// import NotFound from "../pages/error/NotFound";
// import ErrorBoundary from "../pages/error/ErrorBoundary";
// import UserPage from "../pages/admin/Admin";
// import AIChatPage from "../pages/ai-assistant/AIChatPage";

// Lazy load components
const Wrapper = lazy(() => import("../components/wrapper"));
const Dashboard = lazy(() => import("../pages/dashboard/dashboard"));
const DumpSites = lazy(() => import("../pages/dump-site/DumpSite"));
const Interventions = lazy(() => import("../pages/interventions/Interventions"));
const PublicSpaceTypes = lazy(() => import("../pages/public-space-type/PublicSpaceTypes"));
const ToiletFacilities = lazy(() => import("../pages/toilet-facilities/ToiletFacilities"));
const Gutters = lazy(() => import("../pages/gutters/Gutters"));
const SoakAways = lazy(() => import("../pages/soak-aways/SoakAways"));
const WaterSourceRiskMonitoring = lazy(() => import("../pages/monitor/WaterSourceRiskMonitoring"));
const OpenDefication = lazy(() => import("../pages/open-defecation/OpenDefication"));
const WaterSources = lazy(() => import("../pages/water-sources/WaterSources"));
const NeedAndMaintainers = lazy(() => import("../pages/needs-and-maintainers/needs-and-maintainers"));
const Sanitation = lazy(() => import("../pages/sanitation/Sanitation"));
const Monitoring = lazy(() => import("../pages/field-monitoring/FieldMonitoring"));
const Wash = lazy(() => import("../pages/wash/Wash"));
const Enumerator = lazy(() => import("../pages/enumerator/Enumerator"));
const SignIn = lazy(() => import("../pages/authentication/sign-in"));
const AccountSetUp = lazy(() => import("../pages/authentication/account-setup"));
const NotFound = lazy(() => import("../pages/error/NotFound"));
const ErrorBoundary = lazy(() => import("../pages/error/ErrorBoundary"));
const UserPage = lazy(() => import("../pages/admin/Admin"));
const AIChatPage = lazy(() => import("../pages/ai-assistant/AIChatPage"));
const KnowledgeBase = lazy(() => import("../pages/knowledge-base/KnowledgeBase"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <SignIn />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingAnimation />}>
        <ErrorBoundary />
      </Suspense>
    ),
  },
  {
    path: "/account-setup",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <AccountSetUp />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingAnimation />}>
        <ErrorBoundary />
      </Suspense>
    ),
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <Wrapper />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<LoadingAnimation />}>
        <ErrorBoundary />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "interventions",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Interventions />
          </Suspense>
        ),
      },
      {
        path: "wash",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Wash />
          </Suspense>
        ),
      },
      {
        path: "public-space-types",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <PublicSpaceTypes />
          </Suspense>
        ),
      },
      {
        path: "water-sources",
        children: [
          {
            index: true,
            element: (
            <Suspense fallback={<LoadingAnimation />}>
              <WaterSources />
            </Suspense>
            )
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingAnimation />}>
                <WaterDetails />
              </Suspense>
              )
            },
        ],
      },      
      {
        path: "toilet-facilities",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <ToiletFacilities />
          </Suspense>
        ),
      },
      {
        path: "dump-sites",
        children: [
          {
            index: true,
            element:(
          <Suspense fallback={<LoadingAnimation />}>
            <DumpSites />
          </Suspense>
            )
          },
          {
            path: ":id",
            element:(
              <Suspense fallback={<LoadingAnimation />}>
                <DumpSiteDetails />
              </Suspense>
                )
              },
        ],
      },      
      {
        path: "gutters",
        children: [
          {
            index: true,
            element:(
          <Suspense fallback={<LoadingAnimation />}>
            <Gutters />
          </Suspense>
            )
          },
          {
            path: ":id",
            element:(
              <Suspense fallback={<LoadingAnimation />}>
                <GutterDetails />
              </Suspense>
                )
              },
        ],
      },
      {
        path: "soak-aways",
        children: [
          {
            index: true,
            element:(
          <Suspense fallback={<LoadingAnimation />}>
            <SoakAways />
          </Suspense>
            )
          },
          {
            path: ":id",
            element:(
              <Suspense fallback={<LoadingAnimation />}>
                <SoakAwayDetails />
              </Suspense>
                )
              },
        ],
      },
      {
        path: "monitor",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <WaterSourceRiskMonitoring />
          </Suspense>
        ),
      },
      {
        path: "open-defecation",
        children: [
          {
            index: true,
            element:(
          <Suspense fallback={<LoadingAnimation />}>
            <OpenDefication />
          </Suspense>
            )
          },
          {
            path: ":id",
            element:(
              <Suspense fallback={<LoadingAnimation />}>
                <OpenDeficationDetails />
              </Suspense>
                )
              },
        ],
      },
      {
        path: "needs-and-maintainers",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <NeedAndMaintainers />
          </Suspense>
        ),
      },
      {
        path: "sanitation",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Sanitation />
          </Suspense>
        ),
      },
      {
        path: "field-monitoring",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Monitoring />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <UserPage />
          </Suspense>
        ),
      },
      {
        path: "enumerator",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Enumerator />
          </Suspense>
        ),
      },
      {
        path: "ai-assistant",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <AIChatPage />
          </Suspense>
        ),
      },
      {
        path: "knowledge-base",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <KnowledgeBase />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <Reports />
          </Suspense>
        ),
      }
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default router; 