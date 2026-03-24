import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginView";
import Dashboard from "./pages/DashboardView";
import ClientsView from "./pages/ClientsView";
import MyProfileView from "./pages/MyProfileView";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsView />} />
        <Route path="/profile" element={<MyProfileView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;