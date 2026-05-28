import { useState } from "react";
import axios from "axios";

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

// ── Spinner ──────────────────────────────────────────────
function Spinner({ size = "md", color = "red" }) {
  const s = size === "sm" ? "w-4 h-4 border" : "w-7 h-7 border-2";
  const c = color === "red" ? "border-t-red-500" : "border-t-zinc-300";
  return (
    <div className={`${s} border-zinc-700 ${c} rounded-full animate-spin`} />
  );
}

// ── Banner de error ───────────────────────────────────────
function BannerError({ error, onClose }) {
  if (!error) return null;
  return (
    <div className="mb-5 flex items-center justify-between gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
      {onClose && (
        <button onClick={onClose} className="hover:text-red-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Card de turno (admin) ─────────────────────────────────
function CardTurnoAdmin({ turno, canchaId, onVerReserva, onBloquear, bloqueando }) {
  const disponible = turno.estado === "disponible";
  const reservado = turno.estado === "reservado";
  const bloqueado = turno.estado === "bloqueado";
  const cargando = bloqueando?.turno_id === turno.id;

  return (
    <div
      className={`rounded-xl border p-3.5 flex flex-col gap-2.5 transition-all duration-150 ${
        bloqueado
          ? "bg-yellow-500/5 border-yellow-500/20 opacity-60"
          : reservado
          ? "bg-blue-500/5 border-blue-500/20"
          : "bg-zinc-800/60 border-zinc-700 hover:border-zinc-500"
      }`}
    >
      {/* Hora */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-200 tabular-nums">
          {turno.horario_inicio} hs
        </span>
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            bloqueado ? "bg-yellow-500" : reservado ? "bg-blue-400" : "bg-emerald-500"
          }`}
        />
      </div>

      {/* Estado / usuario */}
      <p className={`text-xs truncate ${
        reservado ? "text-blue-300 font-medium" : bloqueado ? "text-yellow-400/70" : "text-zinc-500"
      }`}>
        {reservado
          ? turno.nombre_usuario ?? "Reservado"
          : bloqueado
          ? "Bloqueado"
          : "Libre"}
      </p>

      {/* Acciones */}
      {reservado && (
        <button
          onClick={() => onVerReserva(turno)}
          className="w-full py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 text-xs font-bold transition-all duration-150 active:scale-95"
        >
          Ver reserva
        </button>
      )}

      {disponible && (
        <button
          onClick={() => onBloquear(turno)}
          disabled={!!cargando}
          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 ${
            cargando
              ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              : "bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400"
          }`}
        >
          {cargando ? (
            <span className="flex items-center justify-center gap-1.5">
              <Spinner size="sm" color="zinc" /> Bloqueando...
            </span>
          ) : (
            "Bloquear"
          )}
        </button>
      )}

      {bloqueado && (
        <button
          onClick={() => onBloquear(turno)}
          disabled={!!cargando}
          className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all duration-150 active:scale-95 ${
            cargando
              ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              : "bg-zinc-700/60 hover:bg-zinc-700 border border-zinc-600 text-zinc-300"
          }`}
        >
          {cargando ? (
            <span className="flex items-center justify-center gap-1.5">
              <Spinner size="sm" color="zinc" /> ...
            </span>
          ) : (
            "Desbloquear"
          )}
        </button>
      )}
    </div>
  );
}

// ── Modal: ver reserva + cancelar ────────────────────────
function ModalReserva({ turno, cancha, onCancelar, onClose, cancelando }) {
  if (!turno) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 sm:p-8 w-full max-w-sm flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Detalle de reserva</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Datos */}
        <div className="w-full bg-zinc-800/80 border border-zinc-700 rounded-xl divide-y divide-zinc-700 text-sm">
          {[
            { label: "Cancha", value: cancha?.nombre },
            { label: "Fecha", value: formatFecha(turno.fecha) },
            { label: "Horario", value: `${turno.horario_inicio} hs` },
            { label: "Cliente", value: turno.nombre_usuario ?? "—" },
            { label: "Teléfono", value: turno.telefono_usuario ?? "—" },
            { label: "Email", value: turno.email_usuario ?? "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-4 py-3 gap-4">
              <span className="text-zinc-400 shrink-0">{label}</span>
              <span className="text-white font-semibold text-right truncate">{value}</span>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2">
          {turno.telefono_usuario && (
            <a
              href={`https://wa.me/${turno.telefono_usuario}?text=${encodeURIComponent(
                `Hola ${turno.nombre_usuario ?? ""}! Te avisamos que tu reserva en ${cancha?.nombre} para el ${formatFecha(turno.fecha)} a las ${turno.horario_inicio}hs fue cancelada.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 font-bold rounded-xl text-sm text-center transition-all duration-150 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.952 9.952 0 01-5.078-1.383l-.361-.214-3.741.966.993-3.617-.235-.374A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Avisar por WhatsApp
            </a>
          )}
          <button
            onClick={() => onCancelar(turno)}
            disabled={cancelando}
            className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
              cancelando
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
            }`}
          >
            {cancelando ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" color="zinc" /> Cancelando...
              </span>
            ) : (
              "Cancelar reserva"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Panel lateral: editar cancha ─────────────────────────
function PanelEditarCancha({ cancha, onClose, onGuardar, guardando }) {
  const [form, setForm] = useState({
    nombre: cancha?.nombre ?? "",
    tipo: cancha?.tipo ?? "",
    precio: cancha?.precio ?? "",
    activa: cancha?.activa === 1,
  });

  if (!cancha) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = () => onGuardar(cancha.id, form);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-zinc-900 border-l border-zinc-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">Editar cancha</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{cancha.nombre}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Campos */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Tipo</label>
            <input
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              placeholder="ej: Fútbol 5, Pádel..."
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Precio por hora (ARS)</label>
            <input
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Activa */}
          <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-white font-medium">Cancha activa</p>
              <p className="text-xs text-zinc-500 mt-0.5">Si está desactivada no aparece para los clientes</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, activa: !prev.activa }))}
              className={`relative w-11 h-6 rounded-full border transition-all duration-200 shrink-0 ${
                form.activa ? "bg-emerald-500 border-emerald-500" : "bg-zinc-700 border-zinc-600"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  form.activa ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 text-sm font-semibold transition-all duration-150"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={guardando}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
              guardando
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20"
            }`}
          >
            {guardando ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" color="zinc" /> Guardando...
              </span>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ── CanchasAdmin (principal) ──────────────────────────────
export default function CanchasAdmin({
  canchas,
  setCanchas,
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
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [bloqueando, setBloqueando] = useState(null);
  const [panelCancha, setPanelCancha] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const hoyDate = new Date();
  const hoy = hoyDate.toISOString().split("T")[0];
  const maxFecha = new Date(hoyDate);
  maxFecha.setDate(hoyDate.getDate() + 14);
  const maxFechaStr = maxFecha.toISOString().split("T")[0];

  const canchaActual = canchas.find((c) => c.id === canchaAbierta);
  const turnosCancha = canchaActual
    ? turnos.filter((t) => t.cancha_id === canchaActual.id)
    : [];

  const totalLibres = turnosCancha.filter((t) => t.estado === "disponible").length;
  const totalReservados = turnosCancha.filter((t) => t.estado === "reservado").length;
  const totalBloqueados = turnosCancha.filter((t) => t.estado === "bloqueado").length;

  // Cancelar reserva
  const handleCancelar = async (turno) => {
    setCancelando(true);
    try {
      const response = await axios.delete(`${API}/reservas/cancelar/${turno.reserva_id}`);
      if (response.data.success) {
        setTurnos((prev) =>
          prev.map((t) =>
            t.id === turno.id
              ? { ...t, estado: "disponible", nombre_usuario: null, telefono_usuario: null, email_usuario: null, reserva_id: null }
              : t
          )
        );
        setTurnoSeleccionado(null);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo cancelar la reserva.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setCancelando(false);
    }
  };

  // Bloquear / desbloquear turno
  const handleBloquear = async (turno) => {
    const nuevoEstado = turno.estado === "bloqueado" ? "disponible" : "bloqueado";
    setBloqueando({ turno_id: turno.id });
    try {
      const response = await axios.put(`${API}/turnos/bloquear/${turno.id}`, { estado: nuevoEstado });
      if (response.data.success) {
        setTurnos((prev) =>
          prev.map((t) => (t.id === turno.id ? { ...t, estado: nuevoEstado } : t))
        );
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo modificar el turno.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setBloqueando(null);
    }
  };

  // Guardar edición de cancha
  const handleGuardarCancha = async (id, form) => {
    setGuardando(true);
    try {
      const response = await axios.put(`${API}/canchas/editar/${id}`, {
        ...form,
        activa: form.activa ? 1 : 0,
      });
      if (response.data.success) {
        setCanchas((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, ...form, activa: form.activa ? 1 : 0 } : c
          )
        );
        setPanelCancha(null);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la cancha.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">

      {/* Modal reserva */}
      {turnoSeleccionado && (
        <ModalReserva
          turno={turnoSeleccionado}
          cancha={canchaActual}
          onCancelar={handleCancelar}
          onClose={() => setTurnoSeleccionado(null)}
          cancelando={cancelando}
        />
      )}

      {/* Panel editar cancha */}
      {panelCancha && (
        <PanelEditarCancha
          cancha={panelCancha}
          onClose={() => setPanelCancha(null)}
          onGuardar={handleGuardarCancha}
          guardando={guardando}
        />
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
                Panel Admin
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">Gestión de canchas y turnos</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        <BannerError error={error} onClose={() => setError(null)} />

        {loading ? (
          <div className="flex flex-col items-center gap-4 pt-24">
            <Spinner size="md" />
            <p className="text-zinc-500 text-sm">Cargando canchas...</p>
          </div>
        ) : canchas.length === 0 ? (
          <p className="text-center text-zinc-500 pt-20 text-sm">No hay canchas registradas.</p>
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
                  {cancha.activa === 0 && (
                    <span className="ml-2 text-xs text-zinc-600">(inactiva)</span>
                  )}
                </button>
              ))}
            </div>

            {canchaActual && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

                {/* ── Info cancha ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-5 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg sm:text-xl font-bold text-white">{canchaActual.nombre}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                        canchaActual.activa === 1
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-zinc-500 bg-zinc-800 border-zinc-700"
                      }`}>
                        {canchaActual.activa === 1 ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    {canchaActual.tipo && (
                      <span className="inline-block mt-1.5 text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-md px-2.5 py-0.5 uppercase tracking-wider">
                        {canchaActual.tipo}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* Stats */}
                    <div className="flex gap-2">
                      {[
                        { label: "Libres", value: totalLibres, color: "text-emerald-400" },
                        { label: "Reservados", value: totalReservados, color: "text-blue-400" },
                        { label: "Bloqueados", value: totalBloqueados, color: "text-yellow-400" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-center min-w-[60px]">
                          <p className={`text-xl font-black leading-none ${color}`}>{value}</p>
                          <p className="text-xs text-zinc-500 mt-1 whitespace-nowrap">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Precio + editar */}
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Por hora</p>
                        <p className="text-xl sm:text-2xl font-bold text-red-400">
                          {formatPrecio(canchaActual.precio)}
                        </p>
                      </div>
                      <button
                        onClick={() => setPanelCancha(canchaActual)}
                        className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-all duration-150 shrink-0"
                        title="Editar cancha"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Grid de turnos ── */}
                <div className="p-4 sm:p-6">
                  {loadingTurnos ? (
                    <div className="flex justify-center py-16">
                      <Spinner size="md" />
                    </div>
                  ) : turnosCancha.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
                      <span className="text-3xl">📅</span>
                      <p className="text-sm font-medium">No hay turnos para esta fecha</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {turnosCancha.map((turno) => (
                        <CardTurnoAdmin
                          key={turno.id}
                          turno={turno}
                          canchaId={canchaActual.id}
                          onVerReserva={setTurnoSeleccionado}
                          onBloquear={handleBloquear}
                          bloqueando={bloqueando}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Leyenda ── */}
                <div className="px-4 sm:px-6 pb-5 flex items-center gap-5 text-xs text-zinc-500 border-t border-zinc-800 pt-4 flex-wrap">
                  {[
                    { color: "bg-emerald-500", label: "Libre" },
                    { color: "bg-blue-400", label: "Reservado" },
                    { color: "bg-yellow-500", label: "Bloqueado" },
                  ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
                      {label}
                    </span>
                  ))}
                </div>

              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}