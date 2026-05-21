import { User, FileText, Mail, Phone, BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";
import PerfilEdit from "../../componentes/perfil/perfilEdit";

import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function Perfil() {
  const [user, setUser] = useState({
    id: "",
    nombre: "",
    apellido: "",
    nro_documento: "",
    email: "",
    telefono: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${API}/user/getUser`, {
          withCredentials: true,
        });

        if (response.data.success) {
          console.log(response.data.user);
          setUser(response.data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getUser();
  }, []);

  const initials = `${user.nombre?.[0] || ""}${user.apellido?.[0] || ""}`;

  const fields = [
    {
      label: "Nombre",
      value: user.nombre,
      icon: User,
    },
    {
      label: "Apellido",
      value: user.apellido,
      icon: User,
    },
    {
      label: "Nro. Documento",
      value: user.nro_documento,
      icon: FileText,
    },
    {
      label: "Email",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Teléfono",
      value: user.telefono,
      icon: Phone,
    },
  ];

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  async function handleSaveProfile(updatedData) {
    try {
      const response = await axios.put(`${API}/user/updateUser`, updatedData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isEditing) {
    return (
      <section>
        <PerfilEdit
          userData={user}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
          loading={loading}
        />
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-md">
        {/* Header card */}
        <div className="relative bg-[oklch(21%_0.006_285.885)] border border-slate-700 rounded-2xl p-8 mb-4 overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full" />
          <div className="absolute top-0 right-0 w-12 h-12 bg-red-500/20 rounded-bl-full" />

          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-xl bg-red-500 flex items-center justify-center text-slate-950 text-xl font-bold tracking-tight shadow-lg shadow-red-500/30">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <BadgeCheck
                  size={11}
                  className="text-slate-900"
                  strokeWidth={3}
                />
              </div>
            </div>

            {/* Name & status */}
            <div>
              <h1 className="text-white text-xl font-semibold tracking-tight leading-tight">
                {user.nombre} {user.apellido}
              </h1>
              <p className="text-slate-500 text-xs mt-1 tracking-widest uppercase">
                Perfil de usuario
              </p>
              <span className="inline-flex items-center gap-1.5 mt-2 text-red-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                Activo
              </span>
            </div>
          </div>
        </div>

        {/* Info fields */}
        <div className="bg-[oklch(21%_0.006_285.885)] border border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {fields.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-6 py-4 group hover:bg-red-900/50 transition-colors duration-150"
            >
              <div className="shrink-0 w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-emerald-500/15 border border-slate-700 group-hover:border-emerald-500/30 flex items-center justify-center transition-all duration-150">
                <Icon
                  size={15}
                  className="text-slate-500 group-hover:text-red-400 transition-colors duration-150"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs tracking-widest uppercase mb-0.5">
                  {label}
                </p>
                <p className="text-slate-100 text-sm font-medium truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-700 text-xs mt-4 tracking-widest uppercase">
          ID · {user.nro_documento}
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-red-500 hover:bg-red-900 text-white font-semibold py-2 rounded-lg transition-all active:scale-95"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
