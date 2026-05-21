import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  User,
  Shield,
  Users,
  LogIn,
  UserPlus,
  LogOut,
  Zap,
} from "lucide-react";

import { useAuth } from "../utils/authContext";

const API = import.meta.env.VITE_API_URL;

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  function NavButton({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] text-white/60 hover:text-white hover:bg-white/10 px-2 sm:px-2.5 py-1.5 rounded-md transition-all"
      >
        {children}
      </button>
    );
  }

  return (
    <header className="bg-[#0a0a0a] text-white border-b border-white/[0.06] px-3 sm:px-6 md:px-8 py-2.5 flex flex-row items-center justify-between gap-2">
      
      {/* Logo */}
      <div
        className="flex items-center gap-1.5 cursor-pointer shrink-0"
        onClick={() => navigate("/")}
      >
        <div className="w-[26px] h-[26px] bg-red-500 rounded-md flex items-center justify-center">
          <Zap size={14} color="white" fill="white" />
        </div>
        <span className="text-[14px] sm:text-[15px] font-semibold tracking-tight hidden xs:block sm:block">
          MiApp
        </span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-0.5 sm:gap-1">
        <NavButton onClick={() => navigate("/")}>
          <Home size={15} />
          <span className="hidden sm:block">Home</span>
        </NavButton>
        {user?.rol === "cliente" && (
          <NavButton onClick={() => navigate("/perfil")}>
            <User size={15} />
            <span className="hidden sm:block">Perfil</span>
          </NavButton>
        )}
        {user?.rol === "admin" && (
          <>
            <NavButton onClick={() => navigate("/admin")}>
              <Shield size={15} />
              <span className="hidden sm:block">Admin</span>
            </NavButton>
            <NavButton onClick={() => navigate("/users")}>
              <Users size={15} />
              <span className="hidden sm:block">Usuarios</span>
            </NavButton>
          </>
        )}
      </nav>

      {/* Auth */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] text-white/75 border border-white/20 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/10 hover:border-white/35 transition-all"
            >
              <LogIn size={14} />
              <span className="hidden sm:block">Login</span>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] font-medium bg-red-500 hover:bg-red-600 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
            >
              <UserPlus size={14} />
              <span className="hidden sm:block">Registrarse</span>
            </button>
          </>
        ) : (
          <>
            {/* Avatar + nombre */}
            <div className="flex items-center gap-1.5">
              <div className="w-[28px] h-[28px] rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <User size={13} className="text-red-400" />
              </div>
              <span className="text-[12px] sm:text-[13px] text-white/70 hidden sm:block">
                Hola,{" "}
                <span className="text-white font-medium">{user.nombre}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px] text-white/60 border border-white/15 px-2 sm:px-3 py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-all"
            >
              <LogOut size={14} />
              <span className="hidden sm:block">Salir</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}