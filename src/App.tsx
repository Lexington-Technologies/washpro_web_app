import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Wrapper from "./components/wrapper";
import Dashboard from "./pages/dashboard/dashboard";

export default function App() {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Dashboard />}index />
        </Routes>
      </Wrapper>
    </Router>
  );
}
