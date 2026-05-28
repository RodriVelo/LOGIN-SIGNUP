import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const CANCHA_STYLES = [
  { color: "from-red-500/20 to-orange-500/10", accent: "bg-red-500" },
  { color: "from-blue-500/20 to-cyan-500/10", accent: "bg-blue-500" },
  { color: "from-emerald-500/20 to-teal-500/10", accent: "bg-emerald-500" },
  { color: "from-yellow-500/20 to-amber-500/10", accent: "bg-yellow-500" },
];

const estadoTurnoConfig = {
  confirmado: {
    label: "Confirmado",
    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  pendiente: {
    label: "Pendiente",
    cls: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  libre: {
    label: "Libre",
    cls: "bg-slate-700/50 text-slate-500 border border-slate-700/50",
    dot: "bg-slate-600",
  },
};

const estadoCanchaConfig = {
  disponible: { label: "Disponible", cls: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30" },
  ocupada: { label: "En uso", cls: "text-blue-400 bg-blue-500/10 border border-blue-500/30" },
  mantenimiento: { label: "Mantenimiento", cls: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30" },
};

function TurnosModal({ cancha, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[oklch(18%_0.005_285)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              Turnos del día
            </span>
            <h2 className="mt-1 text-2xl font-black text-white">{cancha.nombre}</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {cancha.tipo || "—"} · ${cancha.precio.toLocaleString("es-AR")}/hora
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            ✕
          </button>
        </div>

        {cancha.turnos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-600">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm">No hay turnos cargados aún</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cancha.turnos.map((t) => {
              const cfg = estadoTurnoConfig[t.estado];
              return (
                <div
                  key={t.hora}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[oklch(21%_0.006_285)] px-4 py-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white w-12">{t.hora}</span>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className={t.estado === "libre" ? "text-slate-600" : "text-slate-300"}>
                      {t.equipo}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-500">
          <span>
            {cancha.turnos.filter((t) => t.estado === "confirmado").length} confirmados ·{" "}
            {cancha.turnos.filter((t) => t.estado === "libre").length} libres
          </span>
          <button className="text-red-400 hover:text-red-300 font-semibold transition-colors">
            + Agregar turno
          </button>
        </div>
      </div>
    </div>
  );
}

function EditarModal({ cancha, onClose }) {
  const [nombre, setNombre] = useState(cancha.nombre);
  const [tipo, setTipo] = useState(cancha.tipo || "");
  const [precio, setPrecio] = useState(cancha.precio);
  const [estado, setEstado] = useState(cancha.estado);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-[oklch(18%_0.005_285)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              Editar cancha
            </span>
            <h2 className="mt-1 text-2xl font-black text-white">{cancha.nombre}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Nombre
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-red-500/60 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/60 transition-colors"
              >
                <option value="">Sin tipo</option>
                <option value="F5">F5</option>
                <option value="F8">F8</option>
                <option value="F11">F11</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/60 transition-colors"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">En uso</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
              Precio por hora
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">
                $
              </span>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/60 pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-red-500/60 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}

function CanchaCard({ cancha, onVerTurnos, onEditar }) {
  const ocupados = cancha.turnos.filter((t) => t.estado === "confirmado").length;
  const total = cancha.turnos.length;
  const pct = total > 0 ? Math.round((ocupados / total) * 100) : 0;
  const estadoCfg = estadoCanchaConfig[cancha.estado];

  return (
    <div className="group relative rounded-3xl border border-slate-800 bg-[oklch(19%_0.005_285)] overflow-hidden hover:border-slate-700 transition-all duration-300 hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${cancha.color} opacity-60`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${cancha.accent} flex items-center justify-center text-white font-black text-sm shadow-lg`}>
              {cancha.tipo || "—"}
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight">{cancha.nombre}</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                ${cancha.precio.toLocaleString("es-AR")}/hora
              </p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoCfg.cls}`}>
            {estadoCfg.label}
          </span>
        </div>

        {total > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500">Ocupación hoy</span>
              <span className="text-slate-300 font-semibold">{ocupados}/{total} turnos</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${cancha.accent} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {total > 0 && (
          <div className="mb-4 space-y-1.5">
            {cancha.turnos.slice(0, 3).map((t) => {
              const cfg = estadoTurnoConfig[t.estado];
              return (
                <div
                  key={t.hora}
                  className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className="text-slate-400 font-mono font-bold">{t.hora}</span>
                    <span className={t.estado === "libre" ? "text-slate-600" : "text-slate-300"}>
                      {t.equipo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {cancha.estado === "mantenimiento" && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-base">🔧</span>
            <span className="text-xs text-yellow-500/80">Cancha temporalmente fuera de servicio</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onVerTurnos(cancha)}
            className="flex-1 py-2.5 rounded-2xl border border-slate-700 text-slate-400 text-xs font-semibold hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all"
          >
            Ver turnos
          </button>
          <button
            onClick={() => onEditar(cancha)}
            className="flex-1 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 hover:border-red-500/50 transition-all"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CanchasAdmin() {
  const [canchas, setCanchas] = useState([]);
  const [modalTurnos, setModalTurnos] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCanchas = async () => {
      try {
        const response = await axios.get(`${API}/canchas/getCanchas`);
        if (response.data.success) {
          const normalized = response.data.canchas.map((c, i) => ({
            ...c,
            precio: parseFloat(c.precio),
            estado: c.activa === 1 ? "disponible" : "mantenimiento",
            turnos: [],
            ...CANCHA_STYLES[i % CANCHA_STYLES.length],
          }));
          setCanchas(normalized);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCanchas();
  }, []);

  const totalTurnos = canchas.reduce(
    (acc, c) => acc + c.turnos.filter((t) => t.estado === "confirmado").length, 0
  );
  const totalLibres = canchas.reduce(
    (acc, c) => acc + c.turnos.filter((t) => t.estado === "libre").length, 0
  );
  const canchasActivas = canchas.filter((c) => c.estado !== "mantenimiento").length;

  return (
    <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold tracking-wider uppercase">
              Panel administrativo
            </span>
            <h1 className="mt-4 text-5xl md:text-6xl font-black tracking-tight leading-none">
              Mis<span className="text-red-500"> Canchas</span>
            </h1>
            <p className="mt-3 text-slate-400 text-base max-w-xl">
              Gestioná tus canchas, editá detalles y controlá los turnos del día desde acá.
            </p>
          </div>
          <button className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5">
            <span className="text-base leading-none">+</span>
            Agregar cancha
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: "Canchas activas", value: canchasActivas, sub: `de ${canchas.length} totales` },
            { label: "Turnos confirmados", value: totalTurnos, sub: "para hoy" },
            { label: "Horarios libres", value: totalLibres, sub: "disponibles hoy" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-800 bg-[oklch(19%_0.005_285)] px-5 py-4"
            >
              <p className="text-slate-500 text-xs font-medium">{s.label}</p>
              <p className="mt-1 text-3xl font-black text-white">{s.value}</p>
              <p className="text-slate-600 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-600">
            <svg className="animate-spin w-6 h-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm">Cargando canchas...</span>
          </div>
        ) : canchas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-600">
            <span className="text-4xl mb-3">🏟️</span>
            <p className="text-sm">No se encontraron canchas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {canchas.map((cancha) => (
              <CanchaCard
                key={cancha.id}
                cancha={cancha}
                onVerTurnos={setModalTurnos}
                onEditar={setModalEditar}
              />
            ))}
          </div>
        )}
      </div>

      {modalTurnos && (
        <TurnosModal cancha={modalTurnos} onClose={() => setModalTurnos(null)} />
      )}
      {modalEditar && (
        <EditarModal cancha={modalEditar} onClose={() => setModalEditar(null)} />
      )}
    </div>
  );
}