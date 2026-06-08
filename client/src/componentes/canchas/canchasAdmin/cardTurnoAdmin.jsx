
// ─────────────────────────────────────────────
// CardTurnoAdmin
// ─────────────────────────────────────────────
import Spinner from "./spinner";

export default function CardTurnoAdmin({ turno, onVerReserva, onBloquear, bloqueando, pedirConfirmacion }) {
  const disponible = turno.estado === "disponible";
  const reservado  = turno.estado === "reservado";
  const bloqueado  = turno.estado === "bloqueado";
  const cargando   = bloqueando?.turno_id === turno.id;

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
      <p
        className={`text-xs truncate ${
          reservado ? "text-blue-300 font-medium" : bloqueado ? "text-yellow-400/70" : "text-zinc-500"
        }`}
      >
        {reservado ? (turno.nombre_usuario ?? "Reservado") : bloqueado ? "Bloqueado" : "Libre"}
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
          onClick={() => pedirConfirmacion(`¿Querés bloquear el turno de las ${turno.horario_inicio}?`, () => onBloquear(turno))}
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
          onClick={() => pedirConfirmacion(`¿Querés desbloquear el turno de las ${turno.horario_inicio}?`, () => onBloquear(turno))}
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
