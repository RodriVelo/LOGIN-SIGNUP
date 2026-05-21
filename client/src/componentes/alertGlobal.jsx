import { useState, useEffect } from "react";

// ─── Configuración por tipo ───────────────────────────────────────────────────
const ALERT_CONFIG = {
  success: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
      </svg>
    ),
    accent: "#22c55e",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
    label: "Éxito",
  },
  error: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
      </svg>
    ),
    accent: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    text: "#b91c1c",
    label: "Error",
  },
  warning: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
      </svg>
    ),
    accent: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    text: "#b45309",
    label: "Advertencia",
  },
  info: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
      </svg>
    ),
    accent: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    label: "Información",
  },
  confirm: {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
      </svg>
    ),
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    label: "Confirmar",
  },
};

// ─── Componente AlertModal ────────────────────────────────────────────────────
/**
 * AlertModal — ventana de alerta genérica
 *
 * Props:
 *  open        boolean             – controla visibilidad
 *  type        'success' | 'error' | 'warning' | 'info' | 'confirm'
 *  title       string              – título del modal
 *  message     string | ReactNode  – cuerpo del mensaje
 *  confirmText string              – texto del botón principal  (default: "Aceptar")
 *  cancelText  string              – texto del botón secundario (default: "Cancelar", solo en confirm)
 *  showCancel  boolean             – forzar mostrar cancelar en cualquier tipo
 *  onConfirm   () => void          – callback al confirmar
 *  onCancel    () => void          – callback al cancelar / cerrar
 *  closable    boolean             – mostrar X para cerrar (default: true)
 */


// ─── Demo interactivo ─────────────────────────────────────────────────────────
export default function App() {
  const [alert, setAlert] = useState({ open: false, type: "info" });

  const show = (type, extra = {}) =>
    setAlert({ open: true, type, ...extra });

  const close = () => setAlert((a) => ({ ...a, open: false }));

  const examples = [
    {
      type: "success",
      label: "Éxito",
      title: "¡Operación completada!",
      message: "Los datos fueron guardados correctamente en el servidor.",
    },
    {
      type: "error",
      label: "Error",
      title: "Algo salió mal",
      message: "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.",
    },
    {
      type: "warning",
      label: "Advertencia",
      title: "Acción irreversible",
      message: "Esta acción no se puede deshacer. ¿Estás seguro de que querés continuar?",
    },
    {
      type: "info",
      label: "Info",
      title: "Nueva actualización disponible",
      message: "La versión 2.4.1 trae mejoras de rendimiento y corrección de errores.",
    },
    {
      type: "confirm",
      label: "Confirmar",
      title: "¿Eliminar este elemento?",
      message: "Se va a eliminar permanentemente. Esta acción no tiene vuelta atrás.",
    },
  ];

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
    confirm: "#8b5cf6",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Mono:wght@500&display=swap');
        body { background: #0f172a; margin: 0; }
      `}</style>

      <div
        className="min-h-screen flex flex-col items-center justify-center gap-10 p-8"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>
            Componente genérico
          </p>
          <h1 className="text-4xl font-bold text-white mb-1">AlertModal</h1>
          <p className="text-slate-400 text-sm">Hacé clic en cualquier tipo para ver el modal</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {examples.map((ex) => (
            <button
              key={ex.type}
              onClick={() => show(ex.type, { title: ex.title, message: ex.message })}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors[ex.type],
                boxShadow: `0 4px 16px ${colors[ex.type]}55`,
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Snippet de uso */}
        <div
          className="rounded-2xl border border-slate-700 p-5 max-w-lg w-full"
          style={{ backgroundColor: "#1e293b" }}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>
            Uso básico
          </p>
          <pre className="text-sm text-slate-300 overflow-x-auto leading-relaxed" style={{ fontFamily: "'DM Mono', monospace" }}>
{`<AlertModal
  open={open}
  type="success"       // success | error | warning
  title="¡Listo!"      //         | info  | confirm
  message="Guardado correctamente."
  onConfirm={() => setOpen(false)}
  onCancel={() => setOpen(false)}
/>`}
          </pre>
        </div>
      </div>

      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={close}
        onCancel={close}
      />
    </>
  );
}export function AlertModal({
  open = false,
  type = "info",
  title,
  message,
  confirmText,
  cancelText = "Cancelar",
  showCancel,
  onConfirm,
  onCancel,
  closable = true,
}) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const config = ALERT_CONFIG[type] || ALERT_CONFIG.info;
  const defaultConfirm = type === "confirm" ? "Confirmar" : "Aceptar";
  const displayCancel = showCancel ?? type === "confirm";

  // Animación de entrada/salida
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleCancel = () => onCancel?.();
  const handleConfirm = () => onConfirm?.();
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && closable) handleCancel();
  };

  if (!mounted) return null;

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: visible ? "rgba(15,23,42,0.45)" : "rgba(15,23,42,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor: config.bg,
          borderColor: config.border,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.94) translateY(12px)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
          maxWidth: "440px",
          width: "100%",
          boxShadow: `0 20px 60px -10px ${config.accent}33, 0 8px 24px rgba(0,0,0,0.12)`,
        }}
        className="relative rounded-2xl border-2 p-8"
      >
        {/* Barra de acento superior */}
        <div
          className="absolute top-0 left-8 right-8 h-1 rounded-b-full"
          style={{ backgroundColor: config.accent }}
        />

        {/* Botón cerrar */}
        {closable && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
            style={{ color: config.text, backgroundColor: config.border }}
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Icono + encabezado */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
            style={{ backgroundColor: `${config.accent}20`, color: config.accent }}
          >
            {config.icon}
          </div>
          <div className="pt-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: config.accent, fontFamily: "'DM Mono', monospace" }}
            >
              {config.label}
            </p>
            <h2
              className="text-lg font-bold leading-tight"
              style={{ color: config.text, fontFamily: "'Sora', sans-serif" }}
            >
              {title || config.label}
            </h2>
          </div>
        </div>

        {/* Mensaje */}
        {message && (
          <p
            className="text-sm leading-relaxed mb-7"
            style={{ color: `${config.text}cc`, fontFamily: "'Sora', sans-serif" }}
          >
            {message}
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          {displayCancel && (
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: config.border,
                color: config.text,
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: config.accent,
              boxShadow: `0 4px 14px ${config.accent}55`,
              fontFamily: "'Sora', sans-serif",
            }}
          >
            {confirmText || defaultConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
