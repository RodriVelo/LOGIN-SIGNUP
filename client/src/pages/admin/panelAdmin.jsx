import { Calendar, Clock, CircleDollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

import NavegadorModalHistorial from "../../componentes/panelAdmin/navegadorModalHistorial";
import NavegadorModalIngresos from "../../componentes/panelAdmin/navegadorModalIngresos";
import NavegadorModalReservas from "../../componentes/panelAdmin/navegadorModalReservas";
import NavegadorModalPendientes from "../../componentes/panelAdmin/navegadorModalPendientes";
import NavegadorModalCanchas from "../../componentes/panelAdmin/navegadorModalCanchas";

const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

const TABS = [
  { key: "reservas",   label: "Reservas del día" },
  { key: "historial",  label: "Historial" },
  { key: "ingresos",   label: "Ingresos" },
  { key: "canchas",    label: "Canchas" },
  { key: "pendientes", label: "Pendientes de pago" },
];

export default function PanelAdmin() {
  const [tabActiva, setTabActiva] = useState("reservas");
  const [stats, setStats] = useState({
    totalUsuarios: null,
    reservasHoy: null,
    turnosLibresHoy: null,
    ingresosMes: null,
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get(`${API}/panelAdmin/getStats`);
        if (res.data.success) setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
    };
    getStats();
  }, []);

  const formatPrecio = (v) =>
    v != null
      ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(v)
      : "—";

  const statCards = [
    { icon: Calendar,         label: "Reservas hoy",    value: stats.reservasHoy     ?? "—", sub: "Reservas del día actual" },
    { icon: Clock,            label: "Turnos libres",   value: stats.turnosLibresHoy ?? "—", sub: "Disponibles para hoy" },
    { icon: CircleDollarSign, label: "Ingresos del mes",value: formatPrecio(stats.ingresosMes), sub: "Reservas confirmadas" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center text-base font-bold shadow-lg shadow-red-500/30 shrink-0">
              A
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                Panel Admin
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">Gestión general del sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {statCards.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-zinc-500 mb-2">
                <Icon size={13} />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-2xl font-bold text-white leading-none mb-1">{value}</p>
              <p className="text-xs text-zinc-600">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTabActiva(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                tabActiva === tab.key
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {tabActiva === "reservas"   && <NavegadorModalReservas />}
          {tabActiva === "historial"  && <NavegadorModalHistorial />}
          {tabActiva === "ingresos"   && <NavegadorModalIngresos />}
          {tabActiva === "canchas"    && <NavegadorModalCanchas />}
          {tabActiva === "pendientes" && <NavegadorModalPendientes />}
        </div>
      </main>
    </div>
  );
}