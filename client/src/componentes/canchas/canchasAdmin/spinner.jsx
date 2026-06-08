// ─────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────


export default function Spinner({ size = "md", color = "red" }) {
  const s = size === "sm" ? "w-4 h-4 border" : "w-7 h-7 border-2";
  const c = color === "red" ? "border-t-red-500" : "border-t-zinc-300";
  return (
    <div className={`${s} border-zinc-700 ${c} rounded-full animate-spin`} />
  );
}