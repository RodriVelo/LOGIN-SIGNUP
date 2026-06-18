import {
  CalendarPlus,
  ListChecks,
  Building2,
  UserCircle,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cards = [
    {
      title: "Reservar turno",
      description: "Elegí fecha, horario y cancha disponible.",
      icon: CalendarPlus,
      color: "bg-red-500/10 text-red-400",
      path: "/canchas",
    },
    {
      title: "Mis reservas",
      description: "Consultá y cancelá tus reservas activas.",
      icon: ListChecks,
      color: "bg-blue-500/10 text-blue-400",
      path: "/misreservas",
    },
    {
      title: "Mi perfil",
      description: "Tus datos y historial de reservas.",
      icon: UserCircle,
      color: "bg-amber-500/10 text-amber-400",
      path: "/perfil",
    },
  ];

  return (
    <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] text-white overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
            <CalendarCheck size={14} /> Gestión de turnos
          </span>

          <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-none">
            Reservá tu turno
            <span className="block text-red-500">en segundos</span>
          </h1>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Elegí la cancha, seleccioná el horario disponible y confirmá tu
            reserva sin complicaciones.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/canchas")}
              className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 transition-all duration-200 font-semibold shadow-lg shadow-red-500/20 flex items-center gap-2"
            >
              Ver canchas
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/perfil")}
              className="px-6 py-3 rounded-xl border border-slate-700 bg-[oklch(21%_0.006_285.885)] hover:border-red-500/40 transition-all duration-200"
            >
              Mis turnos
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-24">
          {cards.map(({ title, description, icon: Icon, color, path }) => (
            <div
              key={title}
              onClick={() => navigate(path)}
              className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-6 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full" />

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon size={28} />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>

              <p className="mt-3 text-slate-400 leading-relaxed text-sm">
                {description}
              </p>

              <button className="mt-6 text-red-400 text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                Explorar
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-24">
          <div className="rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  ¿Tenés una cancha libre ahora?
                </h2>
                <p className="mt-3 text-slate-400 max-w-2xl">
                  Verificá disponibilidad en tiempo real y anotate al instante.
                </p>
              </div>

              <button
                onClick={() => navigate("/canchas")}
                className="px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-200 font-semibold whitespace-nowrap shadow-lg shadow-red-500/20 flex items-center gap-2"
              >
                Verificar ahora
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}