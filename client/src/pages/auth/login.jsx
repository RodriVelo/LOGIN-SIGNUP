import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/authContext";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();


  // ← agregás esto
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "suspendido") {
      toast.warning("Tu cuenta está suspendida. Contactá al administrador.");
    }
  }, []);

  const [formValues, setFormValues] = useState({
    email: "",
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
    const { data } = await axios.post(`${API}/auth/login`, formValues, {
      withCredentials: true,
    });

    if (data.success) {
      login(data.user);
      toast.success("Inicio de sesión exitoso");
      setFormValues({ email: "", contrasena: "" });
      navigate("/");
    }
  } catch (error) {
    const mensaje = error.response?.data?.message || "Error al iniciar sesión";
    const status = error.response?.status;

    if (status === 403) {
      toast.warning(mensaje); // "Esta cuenta fue creada con Google"
    } else {
      toast.error(mensaje); // "Usuario no encontrado" / "Credenciales inválidas"
    }
  }
};

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[oklch(14.8%_0.004_228.8)] px-4 py-10">
      {/* Glow background */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-rose-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2">
          Iniciar Sesión
        </h2>

        <p className="text-center text-gray-300 mb-8 text-sm sm:text-base">
          Ingresa tus datos para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Ingrese su email"
            value={formValues.email}
            onChange={handleInputChange}
            className={`
    w-full rounded-xl px-4 py-3 text-white
    placeholder:text-gray-400 outline-none transition-all
    bg-white/10
    ${
      formErrors.email
        ? "border border-red-500 bg-red-500/5 focus:ring-red-500/30"
        : "border border-white/10 focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
    }
  `}
          />

          {formErrors.email && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 animate-in fade-in slide-in-from-top-1 duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M12 3L2 21h20L12 3z"
                />
              </svg>

              <span>{formErrors.email}</span>
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-200">Contraseña</label>

            <input
              type="password"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              value={formValues.contrasena}
              onChange={handleInputChange}
              className={`
                    w-full rounded-xl px-4 py-3 text-white
    placeholder:text-gray-400 outline-none transition-all
    bg-white/10
                     ${
                        formErrors.contrasena
                          ? "border border-red-500 bg-red-500/5 focus:ring-red-500/30"
                          : "border border-white/10 focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
                      }
                  `}
            />

            {formErrors.contrasena && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 animate-in fade-in slide-in-from-top-1 duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M12 3L2 21h20L12 3z"
                  />
                </svg>

                <span>{formErrors.contrasena}</span>
              </div>
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
            Iniciar sesión
          </button>
        </form>

        {/* Signup */}
        <p className="mt-6 text-center text-gray-300 text-sm sm:text-base">
          ¿Quieres registrarte?{" "}
          <Link
            to="/signup"
            className="font-semibold text-red-400 hover:text-red-300 transition"
          >
            Registrarme
          </Link>
        </p>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-400">O continúa con</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google Button */}
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

export default Login;
