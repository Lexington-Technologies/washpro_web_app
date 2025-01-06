import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wrapper from "./components/wrapper";
import Dashboard from "./pages/dashboard/dashboard";
import DumpSites from "./pages/dump-site/DumpSite";
import Interventions from "./pages/interventions/Interventions";
import PublicSpaceTypes from "./pages/public-space-type/PublicSpaceTypes";
import ToiletFacilities from "./pages/toilet-facilities/ToiletFacilities";
import Gutters from "./pages/gutters/Gutters";
import SoakAways from "./pages/soak-aways/SoakAways";
import WaterSourceRiskMonitoring from "./pages/monitor/WaterSourceRiskMonitoring";
import OpenDefication from "./pages/open-defecation/OpenDefication";
import WaterSources from "./pages/water-sources/WaterSources";
import NeedAndMaintainers from "./pages/needs-and-maintainers/needs-and-maintainers";
import Sanitation from "./pages/sanitation/Sanitation";
import Monitoring from "./pages/field-monitoring/FieldMonitoring";
import Wash from "./pages/wash/Wash";
import Admin from "./pages/admin/Admin";
import Enumerator from "./pages/enumerator/Enumerator";
import SignIn from "./pages/authentication/sign-in";
import AccountSetUp from "./pages/account-set-up/account-setup";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />

        <Route
          path="/*"
          element={
            <Wrapper>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/interventions" element={<Interventions />} />
                <Route path="/account-setup" element={<AccountSetUp />} />
                <Route path="/wash" element={<Wash />} />
                <Route path="/public-space-types" element={<PublicSpaceTypes />} />
                <Route path="/water-sources" element={<WaterSources />} />
                <Route path="/toilet-facilities" element={<ToiletFacilities />} />
                <Route path="/dump-sites" element={<DumpSites />} />
                <Route path="/gutters" element={<Gutters />} />
                <Route path="/soak-aways" element={<SoakAways />} />
                <Route path="/monitor" element={<WaterSourceRiskMonitoring />} />
                <Route path="/open-defecation" element={<OpenDefication />} />
                <Route path="/needs-and-maintainers" element={<NeedAndMaintainers />} />
                <Route path="/sanitation" element={<Sanitation />} />
                <Route path="/field-monitoring" element={<Monitoring />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/enumerator" element={<Enumerator />} />
              </Routes>
            </Wrapper>
          }
        />
      </Routes>
    </Router>
  );
}
