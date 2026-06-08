// ─────────────────────────────────────────────
// PanelEditarCancha
// ─────────────────────────────────────────────
import { useState } from "react";
import  Spinner  from "./spinner";


export default function PanelEditarCancha({ cancha, onClose, onGuardar, guardando}) {
  const [form, setForm] = useState({
    nombre: cancha?.nombre ?? "",
    tipo:   cancha?.tipo   ?? "",
    precio: cancha?.precio ?? "",
    activa: cancha?.activa === 1,
  });

  if (!cancha) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-zinc-900 border-l border-zinc-700 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-bold text-white">Editar cancha</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{cancha.nombre}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Campos */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Precio por hora (ARS)</label>
            <input
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Activa */}
          <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-white font-medium">Cancha activa</p>
              <p className="text-xs text-zinc-500 mt-0.5">Si está desactivada no aparece para los clientes</p>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, activa: !prev.activa }))}
              className={`relative w-11 h-6 rounded-full border transition-all duration-200 shrink-0 ${
                form.activa ? "bg-emerald-500 border-emerald-500" : "bg-zinc-700 border-zinc-600"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                  form.activa ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 text-sm font-semibold transition-all duration-150"
          >
            Cancelar
          </button>
          <button
            onClick={() => onGuardar(cancha.id, form)}
            disabled={guardando}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 ${
              guardando
                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20"
            }`}
          >
            {guardando ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" color="zinc" /> Guardando...
              </span>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
