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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-center mb-6">
          Registrarse
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              placeholder="Ingrese su teléfono"
              value={formValues.nombre}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.nombre && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.nombre}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Apellido
            </label>

            <input
              type="text"
              name="apellido"
              placeholder="Ingrese su teléfono"
              value={formValues.apellido}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.apellido && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.apellido}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Ingrese su email"
              value={formValues.email}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.email && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.email}
              </span>
            )}
          </div>

          {/* DNI */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              D.N.I
            </label>

            <input
              type="text"
              name="nro_documento"
              placeholder="Ingrese su D.N.I"
              value={formValues.nro_documento}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.nro_documento && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.nro_documento}
              </span>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              placeholder="Ingrese su teléfono"
              value={formValues.telefono}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.telefono && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.telefono}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              Contraseña
            </label>

            <input
              type="password"
              name="contrasena"
              placeholder="Ingrese su contraseña"
              value={formValues.contrasena}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg outline-none"
            />

            {formErrors.contrasena && (
              <span className="text-red-500 text-sm mt-1">
                {formErrors.contrasena}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-orange-500 text-white font-semibold"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-orange-500 font-semibold"
          >
            Ingresar
          </Link>
        </p>
        <div className="mt-4 flex justify-center">
          <a
            href={`${API}/auth/google`}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-lg active:scale-95"
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