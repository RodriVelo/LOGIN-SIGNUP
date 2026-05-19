import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children, rolPermitido }) => {
  const [loading, setLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  const location = useLocation();

  const checkAuth = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          withCredentials: true,
        },
      );

      const userData = response.data.user;

      // Verificar roles si se especifican
      if (rolPermitido) {
        const rolesPermitidos = Array.isArray(rolPermitido)
          ? rolPermitido
          : [rolPermitido];

        let tienePermiso = false;

        for (const rol of rolesPermitidos) {
          if (rol === "admin" && userData.rol === 1) {
            tienePermiso = true;
            break;
          }

          if (rol === "cliente" && userData.rol === 2) {
            tienePermiso = true;
            break;
          }
        }

        if (!tienePermiso) {
          setIsAuthenticated(false);
          return;
        }
      }

      setUser(userData);

      setIsAuthenticated(true);
    } catch (error) {
      console.log("No autenticado", error);

      setIsAuthenticated(false);

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Verificando sesión...</h1>
      </div>
    );
  }

  // No autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Autenticado
  return children;
};

export default ProtectedRoute;
