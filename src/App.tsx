import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalculatorPage from "@/pages/CalculatorPage";
import HelpPage from "@/pages/HelpPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<CalculatorPage />} />
      </Routes>
    </Router>
  );
}
