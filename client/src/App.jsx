import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import InwardRegister from "./components/InwardRegister";
import SppMaster from "./components/SppMaster";
import HodDashboard from "./components/HodDashboard";
import Navbar from "./components/Navbar";

// The layout wrapper for all authenticated pages
const MainLayout = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />
      <div className="flex-grow-1">
        <Outlet /> {/* The child routes will render here */}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Application Routes wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inward-register" element={<InwardRegister />} />
          <Route path="/spp-master" element={<SppMaster />} />
          <Route path="/hod-dashboard" element={<HodDashboard />} />
        </Route>

        {/* Catch-all route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
