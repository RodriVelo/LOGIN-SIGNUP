export default function TabsCanchas({
  canchas,
  setCanchaAbierta,
  canchaAbierta,
}) {
  return (
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
            <span className="ml-2 text-xs text-zinc-600">
              (inactiva)
            </span>
          )}
        </button>
      ))}
    </div>
  );
}