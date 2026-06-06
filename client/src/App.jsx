import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Header from "./componentes/header";
import Footer from "./componentes/footer";

import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";

import ProtectedRoute from "./utils/protectedRoute";

import Perfil from "./pages/user/perfil";
import PanelAdmin from "./pages/admin/panelAdmin";
import PanelAdminUsers from "./pages/admin/panelAdminUsers";
import Canchas from "./pages/canchas/canchas";
import { AuthProvider } from "./utils/authContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
         <Route
            path="/admin"
            element={
              <ProtectedRoute rolPermitido="admin">
                <PanelAdmin />
              </ProtectedRoute>
            }
/>
          <Route
            path="/users"
            element={
              <ProtectedRoute rolPermitido="admin">
                <PanelAdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/canchas"
            element={
             
                <Canchas />
              
            }
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;