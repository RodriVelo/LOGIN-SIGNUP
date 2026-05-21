import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
  nombre: "",
  apellido: "",
  email: "",
  nro_documento: "",
  telefono: "",
  contrasena: "",
});

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    // Email
    if (!formValues.email) {
      errors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Ingrese un email válido";
    }

    // DNI
    if (!formValues.nro_documento) {
      errors.nro_documento = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(formValues.nro_documento)) {
      errors.nro_documento = "Debe tener 8 dígitos";
    }

    // Teléfono
    if (!formValues.telefono) {
      errors.telefono = "Ingrese su número de teléfono";
    }

    // Password
    if (!formValues.contrasena) {
      errors.contrasena = "Ingrese una contraseña";
    } else if (formValues.contrasena.length < 6) {
      errors.contrasena = "Mínimo 6 caracteres";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Por favor corrige los errores");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/auth/user-register`,
        formValues
      );

      if (data.success) {
        toast.success("Usuario registrado correctamente");

        setFormValues({
          nombre: "",
          apellido: "",
          email: "",
          nro_documento: "",
          telefono: "",
          contrasena: "",
        });

        navigate("/login");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Algo salió mal. Intenta nuevamente."
      );
    }
  };

  return (
     <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[oklch(14.8%_0.004_228.8)] px-4 py-10">
  
  {/* Glow background */}
  <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-red-500/20 blur-3xl rounded-full" />
  <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-rose-500/10 blur-3xl rounded-full" />

  {/* Card */}
  <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl p-6 sm:p-8">

    {/* Header */}
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2">
      Registrarse
    </h2>

    <p className="text-center text-gray-300 mb-8 text-sm sm:text-base">
      Crea tu cuenta para comenzar
    </p>

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nombre + Apellido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-200">
            Nombre
          </label>

          <input
            type="text"
            name="nombre"
            placeholder="Ingrese su nombre"
            value={formValues.nombre}
            onChange={handleInputChange}
            className="
              w-full
              rounded-xl
              border border-white/10
              bg-white/10
              px-4 py-3
              text-white
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-red-400
              focus:ring-2
              focus:ring-red-500/30
            "
          />

          {formErrors.nombre && (
            <span className="text-red-400 text-sm mt-1">
              {formErrors.nombre}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-200">
            Apellido
          </label>

          <input
            type="text"
            name="apellido"
            placeholder="Ingrese su apellido"
            value={formValues.apellido}
            onChange={handleInputChange}
            className="
              w-full
              rounded-xl
              border border-white/10
              bg-white/10
              px-4 py-3
              text-white
              placeholder:text-gray-400
              outline-none
              transition
              focus:border-red-400
              focus:ring-2
              focus:ring-red-500/30
            "
          />

          {formErrors.apellido && (
            <span className="text-red-400 text-sm mt-1">
              {formErrors.apellido}
            </span>
          )}
        </div>
      </div>

      {/* DNI */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-200">
          D.N.I
        </label>

        <input
          type="text"
          name="nro_documento"
          placeholder="Ingrese su D.N.I"
          value={formValues.nro_documento}
          onChange={handleInputChange}
          className="
            w-full
            rounded-xl
            border border-white/10
            bg-white/10
            px-4 py-3
            text-white
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-red-400
            focus:ring-2
            focus:ring-red-500/30
          "
        />

        {formErrors.nro_documento && (
          <span className="text-red-400 text-sm mt-1">
            {formErrors.nro_documento}
          </span>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-200">
          Email
        </label>

        <input
          type="email"
          name="email"
          placeholder="Ingrese su email"
          value={formValues.email}
          onChange={handleInputChange}
          className="
            w-full
            rounded-xl
            border border-white/10
            bg-white/10
            px-4 py-3
            text-white
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-red-400
            focus:ring-2
            focus:ring-red-500/30
          "
        />

        {formErrors.email && (
          <span className="text-red-400 text-sm mt-1">
            {formErrors.email}
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
          placeholder="Ingrese su teléfono"
          value={formValues.telefono}
          onChange={handleInputChange}
          className="
            w-full
            rounded-xl
            border border-white/10
            bg-white/10
            px-4 py-3
            text-white
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-red-400
            focus:ring-2
            focus:ring-red-500/30
          "
        />

        {formErrors.telefono && (
          <span className="text-red-400 text-sm mt-1">
            {formErrors.telefono}
          </span>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col">
        <label className="mb-2 font-medium text-gray-200">
          Contraseña
        </label>

        <input
          type="password"
          name="contrasena"
          placeholder="Ingrese su contraseña"
          value={formValues.contrasena}
          onChange={handleInputChange}
          className="
            w-full
            rounded-xl
            border border-white/10
            bg-white/10
            px-4 py-3
            text-white
            placeholder:text-gray-400
            outline-none
            transition
            focus:border-red-400
            focus:ring-2
            focus:ring-red-500/30
          "
        />

        {formErrors.contrasena && (
          <span className="text-red-400 text-sm mt-1">
            {formErrors.contrasena}
          </span>
        )}
      </div>

      {/* Button */}
      <button
        type="submit"
        className="
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
        "
      >
        Registrarse
      </button>
    </form>

    {/* Login */}
    <p className="text-center mt-6 text-gray-300 text-sm sm:text-base">
      ¿Ya tienes una cuenta?{" "}
      <Link
        to="/login"
        className="font-semibold text-red-400 hover:text-red-300 transition"
      >
        Ingresar
      </Link>
    </p>

    {/* Divider */}
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-xs text-gray-400">
        O continúa con
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>

    {/* Google */}
    <div className="flex justify-center">
      <a
        href={`${API}/auth/google`}
        className="
          flex w-full items-center justify-center gap-3
          rounded-xl
          border border-white/10
          bg-white
          px-5 py-3
          font-medium
          text-gray-700
          shadow-lg
          transition-all
          duration-200
          hover:-translate-y-1
          hover:shadow-xl
          active:scale-95
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="h-5 w-5"
        >
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6 7l6.2 5.2C39.9 36.6 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"
          />
        </svg>

        <span>Continuar con Google</span>
      </a>
    </div>
  </div>
</div>
  );
};

export default SignUp;