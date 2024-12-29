import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wrapper from "./components/wrapper";
import Dashboard from "./pages/dashboard/dashboard";
import DumpSites from "./pages/dump-site/DumpSite";
import LocationInfo from "./pages/location-info/Location-info";
import PublicSpaceTypes from "./pages/public-space-type/PublicSpaceTypes";
import ToiletFacilities from "./pages/toilet-facilities/ToiletFacilities";
import WaterSourceInfo from "./pages/water-source-info/WaterSourceInfo";

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
        </Routes>
      </Wrapper>
    </Router>
  );
}
