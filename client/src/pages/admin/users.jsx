export default function Users(){

 const users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juanperez@example.com",
    role: "Administrador",
  },
  {
    id: 2,
    name: "María Gómez",
    email: "mariagomez@example.com",
    role: "Editor",
  },
  {
    id: 3,
    name: "Lucas Fernández",
    email: "lucasf@example.com",
    role: "Moderador",
  },
  {
    id: 4,
    name: "Sofía Ramírez",
    email: "sofiaramirez@example.com",
    role: "Usuario",
  },
  {
    id: 5,
    name: "Valentino López",
    email: "valentino@example.com",
    role: "Usuario",
  },
  {
    id: 6,
    name: "Camila Torres",
    email: "camilatorres@example.com",
    role: "Editor",
  },
];
    return(
        <div className="min-h-screen bg-[oklch(14.8%_0.004_228.8)] text-white overflow-hidden">
  {/* Glow */}
  <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
    {/* Header */}
    <section className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
      <div>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
          Administración de usuarios
        </span>

        <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight">
          Gestión de
          <span className="block text-blue-400">usuarios</span>
        </h1>

        <p className="mt-4 text-slate-400 text-lg max-w-2xl">
          Controlá accesos, permisos y actividad de los usuarios registrados
          en la plataforma.
        </p>
      </div>

      <button className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/20">
        Crear usuario
      </button>
    </section>

    {/* Search */}
    <section className="mt-16">
      <div className="rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-5 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500"
        />

        <button className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition-all duration-200">
          Buscar
        </button>
      </div>
    </section>

    {/* User cards */}
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-12">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-3xl border border-slate-800 bg-[oklch(21%_0.006_285.885)] p-6 hover:border-blue-500/40 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400">
              {user.name.charAt(0)}
            </div>

            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>

              <p className="text-slate-400 text-sm">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {user.role}
            </span>

            <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
              Ver perfil
            </button>
          </div>
        </div>
      ))}
    </section>
  </div>
</div>
    )
}