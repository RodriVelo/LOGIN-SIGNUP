import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function PerfilEdit({ userData, onSave, onCancel, loading , avisoTelefono}) {
  const userSession = JSON.parse(sessionStorage.getItem("userData"));
  const user = userSession?.userData || userSession;

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    nro_documento: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: String(userData.nombre || ""),
        apellido: String(userData.apellido || ""),
        email: String(userData.email || ""),
        nro_documento: String(userData.nro_documento || ""),
        telefono: String(userData.telefono || ""),
      });
    }
  }, [userData]);

  const validateForm = () => {
    const newErrors = {};
    const nombre = String(formData.nombre || "").trim();
    if (!nombre) newErrors.nombre = "El nombre es obligatorio";

    const apellido = String(formData.apellido || "").trim();
    if (!apellido) newErrors.apellido = "El apellido es obligatorio";

    const email = String(formData.email || "").trim();
    if (!email) newErrors.email = "El email es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Formato de email inválido";

    const nro_documento = String(formData.nro_documento || "").trim();
    if (!nro_documento) newErrors.nro_documento = "El DNI es obligatorio";
    else if (!/^\d{8}$/.test(nro_documento))
      newErrors.nro_documento = "El DNI debe tener 8 dígitos";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "turno") {
      setFormData((prev) => ({ ...prev, turno: value, id_trainer: null }));

      // Actualizar sessionStorage inmediatamente
      const session = JSON.parse(sessionStorage.getItem("userData"));
      if (session?.userData) {
        session.userData.turno = value;
        sessionStorage.setItem("userData", JSON.stringify(session));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: String(value || ""),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) onSave(formData);
    else toast.error("Por favor corrige los errores en el formulario");
  };

  return (
 

    <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] flex items-center justify-center p-6 font-mono">
   
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
  
  {/* Banner aviso teléfono */}
  {avisoTelefono && (
    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
      <span className="text-amber-400 text-xs">
        ⚠️ Completá tu teléfono y DNi para poder hacer reservas.
      </span>
    </div>
  )}
     <form onSubmit={handleSubmit} className="space-y-5">
  {/* Nombre + Apellido */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Nombre */}
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-200">
        Nombre *
      </label>

      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        placeholder="Ingrese su nombre"
        className={`
          w-full
          rounded-xl
          border
          bg-white/10
          px-4 py-3
          text-white
          placeholder:text-gray-400
          outline-none
          transition
          focus:ring-2
          focus:ring-red-500/30
          ${
            errors.nombre
              ? "border-red-500"
              : "border-white/10 focus:border-red-400"
          }
        `}
      />

      {errors.nombre && (
        <span className="text-red-400 text-sm mt-1">
          {errors.nombre}
        </span>
      )}
    </div>

    {/* Apellido */}
    <div className="flex flex-col">
      <label className="mb-2 font-medium text-gray-200">
        Apellido *
      </label>

      <input
        type="text"
        name="apellido"
        value={formData.apellido}
        onChange={handleInputChange}
        placeholder="Ingrese su apellido"
        className={`
          w-full
          rounded-xl
          border
          bg-white/10
          px-4 py-3
          text-white
          placeholder:text-gray-400
          outline-none
          transition
          focus:ring-2
          focus:ring-red-500/30
          ${
            errors.apellido
              ? "border-red-500"
              : "border-white/10 focus:border-red-400"
          }
        `}
      />

      {errors.apellido && (
        <span className="text-red-400 text-sm mt-1">
          {errors.apellido}
        </span>
      )}
    </div>
  </div>

  {/* Email */}
 <input
  type="email"
  name="email"
  value={formData.email}
  disabled
  placeholder="correo@ejemplo.com"
  className={`
    w-full
    rounded-xl
    border
    bg-white/10
    px-4 py-3
    text-white
    placeholder:text-gray-400
    outline-none
    transition
    focus:ring-2
    focus:ring-red-500/30
    disabled:opacity-60
    disabled:cursor-not-allowed
    ${
      errors.email
        ? "border-red-500"
        : "border-white/10 focus:border-red-400"
    }
  `}
/>

  {/* DNI */}
  <div className="flex flex-col">
    <label className="mb-2 font-medium text-gray-200">
      D.N.I *
    </label>

    <input
      type="text"
      name="nro_documento"
      maxLength="8"
      value={formData.nro_documento}
      onChange={handleInputChange}
      placeholder="12345678"
      className={`
        w-full
        rounded-xl
        border
        bg-white/10
        px-4 py-3
        text-white
        placeholder:text-gray-400
        outline-none
        transition
        focus:ring-2
        focus:ring-red-500/30
        ${
          errors.nro_documento
            ? "border-red-500"
            : "border-white/10 focus:border-red-400"
        }
      `}
    />

    {errors.nro_documento && (
      <span className="text-red-400 text-sm mt-1">
        {errors.nro_documento}
      </span>
    )}
  </div>

  {/* Telefono */}
  <div className="flex flex-col">
    <label className="mb-2 font-medium text-gray-200">
      Teléfono
    </label>

    <input
      type="text"
      name="telefono"
      value={formData.telefono}
      onChange={handleInputChange}
      placeholder="2991234567"
      className={`
        w-full
        rounded-xl
        border
        bg-white/10
        px-4 py-3
        text-white
        placeholder:text-gray-400
        outline-none
        transition
        focus:ring-2
        focus:ring-red-500/30
        ${
          errors.telefono
            ? "border-red-500"
            : "border-white/10 focus:border-red-400"
        }
      `}
    />

    {errors.telefono && (
      <span className="text-red-400 text-sm mt-1">
        {errors.telefono}
      </span>
    )}
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-3 pt-2">
    <button
      type="submit"
      disabled={loading}
      className={`
        w-full
        rounded-xl
        bg-gradient-to-r
        from-red-500
        to-rose-500
        py-3
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-200
        hover:scale-[1.02]
        hover:from-red-600
        hover:to-rose-600
        active:scale-95
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {loading ? "Guardando..." : "Guardar cambios"}
    </button>

    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="
        w-full
        rounded-xl
        border border-white/10
        bg-white/10
        py-3
        font-semibold
        text-gray-200
        transition-all
        duration-200
        hover:bg-white/15
        active:scale-95
      "
    >
      Cancelar
    </button>
  </div>
</form>
      </div>
    </div>
    );
}
