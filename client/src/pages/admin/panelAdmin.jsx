import {
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  UserPlus,
  Activity,
  BadgeCheck,
  Bell,
} from "lucide-react";


export default function PanelAdmin(){

const modules = [
  {
    title: "Usuarios",
    description:
      "Administrá usuarios, permisos y estados dentro de la plataforma.",
    icon: Users,
  },
  {
    title: "Seguridad",
    description:
      "Controlá accesos, autenticaciones y configuraciones de seguridad.",
    icon: ShieldCheck,
  },
  {
    title: "Estadísticas",
    description:
      "Visualizá métricas, actividad y rendimiento general del sistema.",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    description:
      "Personalizá opciones generales y parámetros administrativos.",
    icon: Settings,
  },
];

    return(
        <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] text-white overflow-hidden">
  {/* Glow */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-red-500/20 blur-3xl rounded-full" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
    {/* Hero */}
    <section className="flex flex-col xl:flex-row items-center justify-between gap-12">
      <div className="max-w-3xl">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
          Panel administrativo
        </span>

        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight leading-none">
          Control total de la
          <span className="block text-red-500">plataforma</span>
        </h1>

        <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-2xl">
          Administrá usuarios, monitoreá actividad y controlá cada sección
          del sistema desde un único lugar.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-400 transition-all duration-200 font-semibold shadow-lg shadow-red-500/20">
            Ir al dashboard
          </button>

          <button className="px-6 py-3 rounded-2xl border border-slate-700 bg-[oklch(21%_0.006_285.885)] hover:border-red-500/40 transition-all duration-200">
            Ver reportes
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {[
          { label: "Usuarios", value: "1.240" },
          { label: "Activos hoy", value: "312" },
          { label: "Tickets", value: "18" },
          { label: "Errores", value: "2" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-6"
          >
            <p className="text-slate-400 text-sm">{item.label}</p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </section>

    {/* Modules */}
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-24">
      {modules.map(({ title, description, icon: Icon }) => (
        <div
          key={title}
          className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-6 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-bl-full" />

          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Icon className="text-red-400" size={28} />
          </div>

          <h3 className="mt-6 text-xl font-semibold">
            {title}
          </h3>

          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            {description}
          </p>

          <button className="mt-6 text-red-400 text-sm flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
            Administrar
          </button>
        </div>
      ))}
    </section>
  </div>
</div>
    )
}