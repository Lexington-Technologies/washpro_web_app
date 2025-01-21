import { createBrowserRouter } from "react-router-dom";
import Wrapper from "../components/wrapper";
import Dashboard from "../pages/dashboard/dashboard";
import DumpSites from "../pages/dump-site/DumpSite";
import Interventions from "../pages/interventions/Interventions";
import PublicSpaceTypes from "../pages/public-space-type/PublicSpaceTypes";
import ToiletFacilities from "../pages/toilet-facilities/ToiletFacilities";
import Gutters from "../pages/gutters/Gutters";
import SoakAways from "../pages/soak-aways/SoakAways";
import WaterSourceRiskMonitoring from "../pages/monitor/WaterSourceRiskMonitoring";
import OpenDefication from "../pages/open-defecation/OpenDefication";
import WaterSources from "../pages/water-sources/WaterSources";
import NeedAndMaintainers from "../pages/needs-and-maintainers/needs-and-maintainers";
import Sanitation from "../pages/sanitation/Sanitation";
import Monitoring from "../pages/field-monitoring/FieldMonitoring";
import Wash from "../pages/wash/Wash";
import Enumerator from "../pages/enumerator/Enumerator";
import SignIn from "../pages/authentication/sign-in";
import AccountSetUp from "../pages/authentication/account-setup";
import NotFound from "../pages/error/NotFound";
import ErrorBoundary from "../pages/error/ErrorBoundary";
import UserPage from "../pages/admin/Admin";
import ForgotPassword from "../pages/authentication/forgot-password";
import WaterDetails from "../pages/water-sources/WaterDetails";
import DumpSitesDetails from "../pages/dump-site/DumpSiteDetails";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <SignIn />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/account-setup",
    element: <AccountSetUp />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: <Wrapper />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "interventions",
        element: <Interventions />,
      },
      {
        path: "wash",
        element: <Wash />,
      },
      {
        path: "public-space-types",
        element: <PublicSpaceTypes />,
      },
      {
        path: "water-sources",
        children: [
          {
            index: true,
            element: <WaterSources />,
          },
          {
            path: ":id",
            element: <WaterDetails />,
          },
        ],
      },
      {
        path: "toilet-facilities",
        element: <ToiletFacilities />,
      },
      {
        path: "dump-sites",
        children: [
          {
            index: true,
            element: <DumpSites />,
          },
          {
            path: ":id",
            element: <DumpSitesDetails />,
          },
        ],
      },
      {
        path: "gutters",
        element: <Gutters />,
      },
      {
        path: "soak-aways",
        element: <SoakAways />,
      },
      {
        path: "monitor",
        element: <WaterSourceRiskMonitoring />,
      },
      {
        path: "open-defecation",
        element: <OpenDefication />,
      },
      {
        path: "needs-and-maintainers",
        element: <NeedAndMaintainers />,
      },
      {
        path: "sanitation",
        element: <Sanitation />,
      },
      {
        path: "field-monitoring",
        element: <Monitoring />,
      },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "enumerator",
        element: <Enumerator />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router; 