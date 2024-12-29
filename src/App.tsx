import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wrapper from "./components/wrapper";
import Dashboard from "./pages/dashboard/dashboard";
import DumpSites from "./pages/dump-site/DumpSite";
import LocationInfo from "./pages/location-info/Location-info";
import PublicSpaceTypes from "./pages/public-space-type/PublicSpaceTypes";
import ToiletFacilities from "./pages/toilet-facilities/ToiletFacilities";
import WaterSourceInfo from "./pages/water-source-info/WaterSourceInfo";
import Gutters from "./pages/gutters/Gutters";
import SoakAways from "./pages/soak-aways/SoakAways";
import DistanceMonitor from "./pages/monitor/DistanceMointor";
import OpenDefication from "./pages/open-defecation/OpenDefication";
import NeedAndRecommendation from "./pages/needs-and-recommendation/NeedAndRecommendation";

export default function App() {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} index />
          <Route path="/dump-sites" element={<DumpSites />} />
          <Route path="/location-info" element={<LocationInfo />} />
          <Route path="/public-space-types" element={<PublicSpaceTypes />} />
          <Route path="/toilet-facilities" element={<ToiletFacilities />} />
          <Route path="/water-source-info" element={<WaterSourceInfo />} />
          <Route path="/gutters" element={<Gutters />} />
          <Route path="/soak-aways" element={<SoakAways />} />
          <Route path="/distance-monitor" element={<DistanceMonitor />} />
          <Route path="/open-defecation" element={<OpenDefication />} />
          <Route path="/needs-and-recommendation" element={<NeedAndRecommendation />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}
