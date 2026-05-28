import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const formatPrecio = (precio) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(precio);

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [year, month, day] = fechaStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function CanchasClient({
  canchas,
  turnos,
  setTurnos,
  loading,
  loadingTurnos,
  fechaSeleccionada,
  setFechaSeleccionada,
  canchaAbierta,
  setCanchaAbierta,
  error,
  setError,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reservando, setReservando] = useState(null);
  const [exito, setExito] = useState(null);

  const hoyDate = new Date();
  const hoy = hoyDate.toISOString().split("T")[0];
  const maxFecha = new Date(hoyDate);
  maxFecha.setDate(hoyDate.getDate() + 14);
  const maxFechaStr = maxFecha.toISOString().split("T")[0];

  const canchaActual = canchas.find((c) => c.id === canchaAbierta);
  const turnosCancha = canchaActual
    ? turnos.filter((t) => t.cancha_id === canchaActual.id)
    : [];

  const turnosLibres = turnosCancha.filter(
    (t) => t.estado === "disponible",
  ).length;

  const ejecutarReserva = async (turno) => {
    setReservando({ cancha_id: turno.cancha_id, hora: turno.horario_inicio });
    try {
      const response = await axios.post(`${API}/reservas/realizarReserva`, {
        usuario_id: user.id,
        turno_id: turno.id,
        fecha: turno.fecha,
        horario_inicio: turno.horario_inicio,
      });

      if (response.data.success) {
        setTurnos((prev) =>
          prev.map((t) =>
            t.id === turno.id ? { ...t, estado: "reservado" } : t,
          ),
        );
        // Sin setTimeout — el usuario necesita tiempo para leer y usar el botón de WhatsApp
        setExito({
          cancha: canchaActual.nombre,
          fecha: turno.fecha,
          hora: turno.horario_inicio,
        });
      }
    } catch (error) {
      console.log(error);
      setError("No se pudo realizar la reserva. Intentá de nuevo.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setReservando(null);
    }
  };

  const handleReservar = (turno) => {
    if (!user) {
      navigate("/login");
      return;
    }
    ejecutarReserva(turno);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* ── Modal de éxito ── */}
      {exito && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setExito(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ícono */}
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
              <svg
                className="w-7 h-7 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Título */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-white mb-1">
                ¡Reserva confirmada!
              </h2>
              <p className="text-zinc-400 text-sm">
                Tu turno fue reservado con éxito
              </p>
            </div>

            {/* Datos */}
            <div className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl divide-y divide-zinc-700 text-sm">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-zinc-400">Cancha</span>
                <span className="text-white font-semibold">{exito.cancha}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-zinc-400">Fecha</span>
                <span className="text-white font-semibold">
                  {formatFecha(exito.fecha)}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-zinc-400">Horario</span>
                <span className="text-white font-semibold">
                  {exito.hora} hs
                </span>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/5492991234567?text=${encodeURIComponent(
                `Hola! Reservé la ${exito.cancha} para el ${formatFecha(exito.fecha)} a las ${exito.hora}hs.`,
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-green-600 hover:bg-green-500 active:scale-95 text-white font-bold rounded-xl text-sm text-center transition-all duration-150 flex items-center justify-center gap-2"
            >
              {/* WhatsApp SVG */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.952 9.952 0 01-5.078-1.383l-.361-.214-3.741.966.993-3.617-.235-.374A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Confirmar por WhatsApp
            </a>

            <button
              onClick={() => setExito(null)}
              className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center text-lg shadow-lg shadow-red-500/30 shrink-0">
              ⚽
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                Reservá tu cancha
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Turnos disponibles en tiempo real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
            <svg
              className="w-4 h-4 text-zinc-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <input
              type="date"
              min={hoy}
              max={maxFechaStr}
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="bg-transparent text-sm text-zinc-100 outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner de error */}
        {error && (
          <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 pt-24">
            <div className="w-10 h-10 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
            <p className="text-zinc-500 text-sm">Cargando canchas...</p>
          </div>
        ) : canchas.length === 0 ? (
          <p className="text-center text-zinc-500 pt-20 text-sm">
            No hay canchas disponibles por el momento.
          </p>
        ) : (
          <>
            {/* ── Tabs de canchas ── */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {canchas.map((cancha) => (
                <button
                  key={cancha.id}
                  onClick={() => setCanchaAbierta(cancha.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                    canchaAbierta === cancha.id
                      ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
                  }`}
                >
                  {cancha.nombre}
                </button>
              ))}
            </div>

            {canchaActual && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {/* ── Info de la cancha ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-5 border-b border-zinc-800">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      {canchaActual.nombre}
                    </h2>
                    {canchaActual.tipo && (
                      <span className="inline-block mt-1.5 text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-0.5 uppercase tracking-wider">
                        {canchaActual.tipo}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">
                        Por hora
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-red-400">
                        {formatPrecio(canchaActual.precio)}
                      </p>
                    </div>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-center min-w-[72px]">
                      <p className="text-2xl font-black text-blue-400 leading-none">
                        {turnosLibres}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">
                        turnos libres
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Grid de turnos ── */}
                <div className="p-4 sm:p-6">
                  {loadingTurnos ? (
                    <div className="flex justify-center py-16">
                      <div className="w-7 h-7 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
                    </div>
                  ) : turnosCancha.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
                      <span className="text-3xl">📅</span>
                      <p className="text-sm font-medium">
                        No hay turnos disponibles para esta fecha
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {turnosCancha.map((turno) => {
                        const ocupado = turno.estado !== "disponible";
                        const cargando =
                          reservando?.cancha_id === canchaActual.id &&
                          reservando?.hora === turno.horario_inicio;

                        return (
                          <div
                            key={turno.id}
                            className={`rounded-xl border p-3.5 flex flex-col gap-2.5 transition-all duration-150 ${
                              ocupado
                                ? "bg-zinc-800/30 border-zinc-800 opacity-50"
                                : "bg-zinc-800/60 border-zinc-700 hover:border-zinc-500"
                            }`}
                          >
                            <span className="text-sm font-semibold text-zinc-200 tabular-nums">
                              {turno.horario_inicio} hs
                            </span>

                            {ocupado ? (
                              <div className="flex items-center justify-center gap-1.5 bg-zinc-700/40 border border-zinc-700 rounded-lg py-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                                <span className="text-xs text-zinc-500 font-semibold">
                                  Reservado
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleReservar(turno)}
                                disabled={!!cargando}
                                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                                  cargando
                                    ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                    : "bg-red-500 hover:bg-red-400 text-white shadow-sm shadow-red-500/20 active:scale-95"
                                }`}
                              >
                                {cargando ? (
                                  <span className="flex items-center justify-center gap-1.5">
                                    <svg
                                      className="w-3 h-3 animate-spin"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                      />
                                    </svg>
                                    Reservando...
                                  </span>
                                ) : (
                                  "Reservar"
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Leyenda ── */}
                <div className="px-4 sm:px-6 pb-5 flex items-center gap-5 text-xs text-zinc-500 border-t border-zinc-800 pt-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    Disponible
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                    Reservado
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
