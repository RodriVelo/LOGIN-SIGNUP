import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Ban,
  CheckCircle2,
  Hourglass,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const ESTADO_CONFIG = {
  confirmada: {
    label: "Confirmada",
    icon: CheckCircle2,
    class: "bg-green-500/10 border-green-500/20 text-green-400",
  },
  pendiente: {
    label: "Pendiente",
    icon: Hourglass,
    class: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
  cancelada: {
    label: "Cancelada",
    icon: Ban,
    class: "bg-slate-500/10 border-slate-500/20 text-slate-500",
  },
};

const TIPO_LABEL = {
  futbol5: "Fútbol 5",
  futbol7: "Fútbol 7",
  futbol11: "Fútbol 11",
};

function formatFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

function formatHora(hora) {
  return hora?.slice(0, 5);
}
export default function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReservas();
  }, []);

  const fetchReservas = async () => {
    try {
      const res = await axios.get(`${API}/reservas/misreservas`, {
        withCredentials: true,
      });
      
      if (res.data.success) setReservas(res.data.reservas);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    setCancelando(id);
    try {
      const res = await axios.put(
        `${API}/reservas/cancelar/${id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Reserva cancelada");
        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r))
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cancelar la reserva");
    } finally {
      setCancelando(null);
    }
  };

  
  
  const activas = reservas.filter((r) => r.estado !== "cancelada");
  const canceladas = reservas.filter((r) => r.estado === "cancelada");

  return (
    <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] overflow-hidden relative">
      {/* Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium mb-4">
            <Ticket size={14} /> Mis reservas
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Tus turnos reservados
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Gestioná y cancelá tus reservas activas.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Ticket size={24} className="text-red-400 animate-pulse" />
            </div>
            <p className="text-slate-500 text-sm">Cargando reservas...</p>
          </div>
        )}

        {/* Sin reservas */}
        {!loading && reservas.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <CalendarDays size={28} className="text-slate-600" />
            </div>
            <p className="text-white font-semibold">No tenés reservas aún</p>
            <p className="text-slate-500 text-sm">
              Buscá una cancha disponible y reservá tu turno.
            </p>
            <button
              onClick={() => navigate("/canchas")}
              className="mt-2 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 transition-all text-white text-sm font-semibold shadow-lg shadow-red-500/20"
            >
              Ver canchas
            </button>
          </div>
        )}

        {/* Reservas activas */}
        {!loading && activas.length > 0 && (
          <div className="flex flex-col gap-4 mb-10">
            {activas.map((reserva) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                onCancelar={handleCancelar}
                cancelando={cancelando}
              />
            ))}
          </div>
        )}

        {/* Reservas canceladas */}
        {!loading && canceladas.length > 0 && (
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-widest mb-4">
              Canceladas
            </p>
            <div className="flex flex-col gap-3">
              {canceladas.map((reserva) => (
                <ReservaCard
                  key={reserva.id}
                  reserva={reserva}
                  onCancelar={handleCancelar}
                  cancelando={cancelando}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReservaCard({ reserva, onCancelar, cancelando }) {
  const estado = ESTADO_CONFIG[reserva.estado] || ESTADO_CONFIG.pendiente;
  const EstadoIcon = estado.icon;
  const cancelada = reserva.estado === "cancelada";

  return (
    <div
      className={`rounded-3xl border bg-[oklch(21%_0.006_285.885)] p-6 transition-all duration-200 ${
        cancelada ? "border-slate-800 opacity-50" : "border-slate-800 hover:border-red-500/30"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-white font-bold text-lg leading-tight">
            {reserva.cancha_nombre}
          </p>
          <p className="text-slate-500 text-sm mt-0.5">
            {TIPO_LABEL[reserva.cancha_tipo] || reserva.cancha_tipo}
          </p>
        </div>

        {/* Badge estado */}
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium shrink-0 ${estado.class}`}
        >
          <EstadoIcon size={12} />
          {estado.label}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <CalendarDays size={14} className="text-red-400 shrink-0" />
          <span className="capitalize">{formatFecha(reserva.fecha)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Clock size={14} className="text-red-400 shrink-0" />
          <span>
            {formatHora(reserva.horario_inicio)} – {formatHora(reserva.horario_fin)} hs
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <MapPin size={14} className="text-red-400 shrink-0" />
          <span>${Number(reserva.precio).toLocaleString("es-AR")} por hora</span>
        </div>
      </div>

      {/* Botón cancelar */}
      {/* {!cancelada && (
        <button
          onClick={() => onCancelar(reserva.id)}
          disabled={cancelando === reserva.id}
          className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:border-red-500/40 hover:text-red-400 transition-all duration-200 text-sm font-semibold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelando === reserva.id ? "Cancelando..." : "Cancelar reserva"}
        </button>
      )} */}
    </div>
  );
}