import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginView";
import Dashboard from "./pages/DashboardView";
import ClientsView from "./pages/ClientsView";
import MyProfileView from "./pages/MyProfileView";
import ReportsView from "./pages/ReportsVIew";
import QuotesView from "./pages/QuotesView";
import LogsView from "./pages/LogsView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<MyProfileView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/quotes" element={<QuotesView />} />
        <Route path="/logs" element={<LogsView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;