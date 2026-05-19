import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Home, User, Shield, Users, LogIn, UserPlus, LogOut, Zap } from "lucide-react";

import { useAuth } from "../utils/authContext";
const API = import.meta.env.VITE_API_URL;

export default function Header() {
  const navigate = useNavigate();

  const { user , logout} = useAuth();

  console.log(user)

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
      className="flex items-center gap-1.5 text-[13px] text-white/60 hover:text-white hover:bg-white/7 px-3 py-1.5 rounded-md transition-all"
    >
      {children}
    </button>
  );
}
  return (
    <header className="bg-[#0a0a0a] text-white px-8 h-[60px] flex items-center justify-between border-b border-white/[0.06]">

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="w-[26px] h-[26px] bg-red-500 rounded-md flex items-center justify-center">
          <Zap size={14} color="white" fill="white" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">MiApp</span>
      </div>

      {/* Navegación */}
      <nav className="flex items-center gap-0.5">
        <NavButton onClick={() => navigate("/")}>
          <Home size={14} />
          Home
        </NavButton>

        {user?.rol === "cliente" && (
          <NavButton onClick={() => navigate("/perfil")}>
            <User size={14} />
            Perfil
          </NavButton>
        )}

        {user?.rol === "admin" && (
          <>
            <NavButton onClick={() => navigate("/admin")}>
              <Shield size={14} />
              Admin
            </NavButton>
            <NavButton onClick={() => navigate("/usuarios")}>
              <Users size={14} />
              Usuarios
            </NavButton>
          </>
        )}
      </nav>

      {/* Auth */}
      <div className="flex items-center gap-2">
        {!user ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-[13px] text-white/75 border border-white/20 px-4 py-1.5 rounded-lg hover:bg-white/8 hover:border-white/35 transition-all"
            >
              <LogIn size={14} />
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-1.5 text-[13px] font-medium bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg transition-colors"
            >
              <UserPlus size={14} />
              Registrarse
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-[30px] h-[30px] rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <User size={15} className="text-red-400" />
              </div>
              <span className="text-[13px] text-white/70">
                Hola, <span className="text-white font-medium">{user.nombre}</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[13px] text-white/60 border border-white/15 px-3.5 py-1.5 rounded-lg hover:text-white hover:border-white/30 transition-all"
            >
              <LogOut size={14} />
              Salir
            </button>
          </>
        )}
      </div>
    </header>
  );
}
