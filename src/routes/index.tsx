import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import ForgotPassword from "../pages/authentication/forgot-password";
import WaterDetails from "../pages/water-sources/WaterDetails";
import DumpSiteDetails from "../pages/dump-site/DumpSiteDetails";
import Reports from "../pages/reports/Reports";
import SoakAwayDetails from "../pages/soak-aways/SoakAwayDetails";
import OpenDeficationDetails from "../pages/open-defecation/OpenDeficationDetails";
import GutterDetails from "../pages/gutters/GutterDetails";
import WaterSourceRisk from "../pages/water-source-risk/WaterSourceRisk";
import RoutineActivies from "../pages/routine-activites/RoutineActivies";
import ToiletFacilitiesDetails from "../pages/toilet-facilities/ToiletFacilitiesDetails";
import CalendarPage from '../pages/calendar/CalendarPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import HouseHold from "../pages/household/HouseHold";
import SchoolDashboard from "../pages/school/School";
import HealthDashboard from "../pages/health-facilities/Health";
import TsangayaDashboard from "../pages/tsangaya/Tsangaya";
import CholeraOutbreak from "../pages/outbreak/CholeraOutbreak";
import RiskAnalysisDashboard from "../pages/risk/Risk";
import FinancialSummary from "../pages/finance/Financial";
import ActivitesDashboard from "../pages/activities/Activies";
import ChlorinationDashboard from "../pages/chlorination/Chlorination";
import IssuesLogDashboard from "../pages/issues/Issues";
import LAMReportingDashboard from "../pages/lam/LamReport";
import WashStatus from "../pages/wash/wash-status/WashStatus";
import HygeineFacilities from "../pages/hygeine-facilities/HygeineFacilities";
import HygeineFacilitiesDetails from "../pages/hygeine-facilities/HygeineFacilitiesDetails";
import WaterSourceRiskDetails from "../pages/water-source-risk/WaterSourceRiskDetails";
import Dashboard from "../pages/dashboard/dashboard";
import Callback from "../pages/callback";

// Lazy load components
const Wrapper = lazy(() => import("../components/wrapper"));
const DumpSites = lazy(() => import("../pages/dump-site/DumpSite"));
const Interventions = lazy(() => import("../pages/interventions/Interventions"));
const PublicSpaceTypes = lazy(() => import("../pages/public-space-type/PublicSpaceTypes"));
const ToiletFacilities = lazy(() => import("../pages/toilet-facilities/ToiletFacilities"));
const Gutters = lazy(() => import("../pages/gutters/Gutters"));
const SoakAways = lazy(() => import("../pages/soak-aways/SoakAways"));
const WaterSourceRiskMonitoring = lazy(() => import("../pages/water-source-risk/WaterSourceRisk"));
const OpenDefication = lazy(() => import("../pages/open-defecation/OpenDefication"));
const WaterSources = lazy(() => import("../pages/water-sources/WaterSources"));
const NeedAndMaintainers = lazy(() => import("../pages/needs-and-maintainers/needs-and-maintainers"));
const Sanitation = lazy(() => import("../pages/sanitation/Sanitation"));
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
    path: "/callback",
    element: (
      <Suspense fallback={<LoadingAnimation />}>
        <Callback />
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
      // <Suspense fallback={<LoadingAnimation />}>
        <Wrapper />
      // </Suspense>
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
          // <Suspense fallback={<LoadingAnimation />}>
            <Dashboard />
          // </Suspense>
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
        path: "household",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <HouseHold />
          </Suspense>
        ),
      },
      {
        path: "activities",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <ActivitesDashboard />
          </Suspense>
        ),
      },
      {
        path: "chlorination",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <ChlorinationDashboard />
          </Suspense>
        ),
      },
      {
        path: "wash-status",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <WashStatus />
          </Suspense>
        ),
      },
      {
        path: "issues-log",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <IssuesLogDashboard />
          </Suspense>
        ),
      },
      {
        path: "lam-report",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <LAMReportingDashboard />
          </Suspense>
        ),
      },
      {
        path: "School",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <SchoolDashboard />
          </Suspense>
        ),
      },
      {
        path: "health-facilities",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <HealthDashboard />
          </Suspense>
        ),
      },
      {
        path: "tsangaya",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <TsangayaDashboard />
          </Suspense>
        ),
      },
      {
        path: "risk-analysis",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <RiskAnalysisDashboard />
          </Suspense>
        ),
      },
      {
        path: "financial-summary",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <FinancialSummary />
          </Suspense>
        ),
      },
      {
        path: "cholera-outbreak",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <CholeraOutbreak />
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
        path: "water-source-risk",
        children: [
          {
            index: true,
            element: (
            <Suspense fallback={<LoadingAnimation />}>
              <WaterSourceRisk/>
            </Suspense>
            )
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingAnimation />}>
                <WaterSourceRiskDetails />
              </Suspense>
              )
            },
        ],
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
        children: [
          {
            index: true,
            element: (
            <Suspense fallback={<LoadingAnimation />}>
              <ToiletFacilities />
            </Suspense>
            )
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingAnimation />}>
                <ToiletFacilitiesDetails />
              </Suspense>
              )
            },
        ],
      },
      {
        path: "hygeine-facilities",
        children: [
          {
            index: true,
            element: (
            <Suspense fallback={<LoadingAnimation />}>
              <HygeineFacilities />
            </Suspense>
            )
          },
          {
            path: ":id",
            element: (
              <Suspense fallback={<LoadingAnimation />}>
                <HygeineFacilitiesDetails />
              </Suspense>
              )
            },
        ],
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
        path: "routine-activities",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <RoutineActivies />
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
      },
      {
        path: "calendar",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <CalendarPage />
          </Suspense>
        ),
      },
      {
        path: "analytics",
        element: (
          <Suspense fallback={<LoadingAnimation />}>
            <AnalyticsPage />
          </Suspense>
        ),
      },
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