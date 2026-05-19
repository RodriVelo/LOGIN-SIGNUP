import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/home";
import Header from "./componentes/header";
import Footer from "./componentes/footer";

import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";

import ProtectedRoute from "./utils/protectedRoute";

import Perfil from "./pages/user/perfil";

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
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;