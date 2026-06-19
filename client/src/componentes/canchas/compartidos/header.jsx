export default function Header({
  hoy,
  maxFechaStr,
  fechaSeleccionada,
  setFechaSeleccionada,
}) {
  return (
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
                lang="es-AR"   // 👈 esto
                min={hoy}
                max={maxFechaStr}
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                className="bg-transparent text-sm text-zinc-100 outline-none cursor-pointer [color-scheme:dark]"
              />
        </div>
      </div>
    </header>
  );
}