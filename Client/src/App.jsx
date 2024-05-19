import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CVETable from "./Components/CVETable/CVETable.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cves/list" />} />
        <Route path="/cves/list" element={<CVETable />} />
      </Routes>
    </BrowserRouter>
  );
}
