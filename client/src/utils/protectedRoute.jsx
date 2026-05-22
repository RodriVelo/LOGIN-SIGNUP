import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl shadow-lg">
        <LoaderCircle className="w-14 h-14 text-red-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-800">
            Verificando sesión
          </h2>
          <p className="text-sm text-slate-500">
            Espera un momento...
          </p>
        </div>
      </div>
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
