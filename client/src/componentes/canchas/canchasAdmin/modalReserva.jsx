// ─────────────────────────────────────────────
// ModalReserva
// ─────────────────────────────────────────────

import Spinner from "./spinner";

export default function ModalReserva({ turno, cancha, onCancelar, onClose, cancelando, pedirConfirmacion, formatFecha }) {
  if (!turno) return null;

  const filas = [
    { label: "Cancha",    value: cancha?.nombre },
    { label: "Fecha",     value: formatFecha(turno.fecha) },
    { label: "Horario",   value: `${turno.horario_inicio} hs` },
    { label: "Cliente",   value: turno.nombre_usuario   ?? "—" },
    { label: "Teléfono",  value: turno.telefono_usuario ?? "—" },
    { label: "Email",     value: turno.email_usuario    ?? "—" },
  ];

  const mensajeWA = encodeURIComponent(
    `Hola ${turno.nombre_usuario ?? ""}! Te avisamos que tu reserva en ${cancha?.nombre} para el ${formatFecha(turno.fecha)} a las ${turno.horario_inicio}hs fue cancelada.`
  );

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
          {filas.map(({ label, value }) => (
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
              href={`https://wa.me/${turno.telefono_usuario}?text=${mensajeWA}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 font-bold rounded-xl text-sm text-center transition-all duration-150 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.571a.5.5 0 00.613.613l5.726-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.952 9.952 0 01-5.078-1.383l-.361-.214-3.741.966.993-3.617-.235-.374A9.951 9.951 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Avisar por WhatsApp
            </a>
          )}
          <button
            onClick={() => pedirConfirmacion(`¿Querés cancelar el turno de las ${turno.horario_inicio}?`, () => onCancelar(turno))}
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

