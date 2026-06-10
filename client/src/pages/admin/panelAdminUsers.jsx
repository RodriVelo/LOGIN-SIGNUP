import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  UserPlus,
  Pencil,
  Trash2,
  UserCheck,
  UserX,
  UserMinus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import ModalConfirmacion from "../../componentes/modalConfirmacion";
import { toast } from "react-toastify";


const API = import.meta.env.VITE_API_URL;
const TAMANIO_PAGINA = 10;

export default function PanelAdminUsers() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [confirmacion, setConfirmacion] = useState(null);

  const pedirConfirmacion = (mensaje, accion) => {
    setConfirmacion({ mensaje, accion });
  };

  const handleConfirmar = () => {
    confirmacion.accion();
    setConfirmacion(null);
  };

  // ── Carga inicial ──────────────────────────────────────────────
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const res = await axios.get(`${API}/panelAdmin/getUsers`);
        if (res.data.success) setUsuarios(res.data.users);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerUsuarios();
  }, []);

  // ── Acciones ───────────────────────────────────────────────────
  const cambiarEstadoUsuario = async (id, nuevoEstado) => {
    try {
      const res = await axios.patch(
        `${API}/panelAdmin/users/${id}/cambiarEstado`,
        {
          estado: nuevoEstado,
        },
      );
      if (res.data.success) {
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? { ...u, estado: nuevoEstado } : u)),
        );
        toast.success("Estado modificado")
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Estado no modificado")
    }
  };

  // ── Filtrado y paginación ──────────────────────────────────────
  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return usuarios.filter((u) => {
      const coincideBusqueda =
        !q ||
        u.nombre?.toLowerCase().includes(q) ||
        u.apellido?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      const coincideEstado = !filtroEstado || u.estado === filtroEstado;
      const coincideRol = !filtroRol || u.rol === filtroRol;
      return coincideBusqueda && coincideEstado && coincideRol;
    });
  }, [usuarios, busqueda, filtroEstado, filtroRol]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / TAMANIO_PAGINA),
  );
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * TAMANIO_PAGINA,
    paginaActual * TAMANIO_PAGINA,
  );

  const cambiarFiltro = (setter) => (e) => {
    setter(e.target.value);
    setPaginaActual(1);
  };

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(
    () => [
      {
        icon: Users,
        label: "Total",
        value: usuarios.length,
        sub: "Registrados",
        accent: "text-zinc-300",
      },
      {
        icon: UserCheck,
        label: "Activos",
        value: usuarios.filter((u) => u.estado === "activo").length,
        sub: "Con acceso",
        accent: "text-emerald-400",
      },
      {
        icon: UserMinus,
        label: "Inactivos",
        value: usuarios.filter((u) => u.estado === "inactivo").length,
        sub: "Sin actividad",
        accent: "text-zinc-400",
      },
      {
        icon: UserX,
        label: "Suspendidos",
        value: usuarios.filter((u) => u.estado === "suspendido").length,
        sub: "Acceso bloqueado",
        accent: "text-red-400",
      },
    ],
    [usuarios],
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
              <ShieldCheck size={15} className="text-zinc-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100 leading-none">
                Panel de usuarios
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">Gestión de cuentas</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, label, value, sub, accent }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">{label}</span>
                <Icon size={13} className="text-zinc-600" />
              </div>
              <div>
                <p
                  className={`text-2xl font-semibold leading-none ${cargando ? "animate-pulse text-zinc-700" : accent}`}
                >
                  {cargando ? "—" : value}
                </p>
                <p className="text-xs text-zinc-600 mt-1">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-zinc-800">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Buscar nombre, apellido o email…"
                value={busqueda}
                onChange={cambiarFiltro(setBusqueda)}
                className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <select
              value={filtroEstado}
              onChange={cambiarFiltro(setFiltroEstado)}
              className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>

            <select
              value={filtroRol}
              onChange={cambiarFiltro(setFiltroRol)}
              className="bg-zinc-800/60 border border-zinc-700/60 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="cliente">Cliente</option>
            </select>

            {usuariosFiltrados.length !== usuarios.length && (
              <span className="ml-auto text-xs text-zinc-500">
                {usuariosFiltrados.length} resultado
                {usuariosFiltrados.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {[
                    "Nombre",
                    "Apellido",
                    "Email",
                    "Documento",
                    "Estado",
                    "Rol",
                    "Teléfono",
                    "Acciones",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500 ${i === 7 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-800/40">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div
                            className="h-3 rounded bg-zinc-800 animate-pulse"
                            style={{ width: `${55 + ((j * 11) % 40)}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : usuariosPagina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-zinc-600 text-xs"
                    >
                      Sin resultados para los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  usuariosPagina.map((u) => (
                    <tr
                      key={u.id ?? u.email}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {u.nombre}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">{u.apellido}</td>
                      <td className="px-4 py-3 text-zinc-400">{u.email}</td>
                      <td className="px-4 py-3 text-zinc-400">
                        {u.nro_documento}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 capitalize ${
                            u.estado === "activo"
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : u.estado === "suspendido"
                                ? "bg-red-500/10 text-red-400 ring-red-500/20"
                                : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20"
                          }`}
                        >
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 capitalize">
                        {u.rol}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{u.telefono}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Editar */}
                          {u.estado !== "inactivo" && (
                            <button
                              title="Editar"
                              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-blue-500/10 transition-colors text-zinc-400 hover:text-blue-400"
                            >
                              <Pencil size={12} />
                            </button>
                          )}

                          {/* Suspender / Activar */}
                          {u.estado === "suspendido" ? (
                            <button
                              title="Activar"
                              onClick={() =>
                                pedirConfirmacion(
                                  "¿Querés activar a este usuario?",
                                  () => cambiarEstadoUsuario(u.id, "activo"),
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-emerald-500/10 transition-colors text-zinc-400 hover:text-emerald-400"
                            >
                              <UserCheck size={12} />
                            </button>
                          ) : u.estado === "inactivo" ? (
                            <button
                              title="Activar"
                              onClick={() =>
                                pedirConfirmacion(
                                  "¿Querés activar a este usuario?",
                                  () => cambiarEstadoUsuario(u.id, "activo"),
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-emerald-500/10 transition-colors text-zinc-400 hover:text-emerald-400"
                            >
                              <UserCheck size={12} />
                            </button>
                          ) : (
                            <button
                              title="Suspender"
                              onClick={() =>
                                pedirConfirmacion(
                                  "¿Querés suspender este usuario?",
                                  () =>
                                    cambiarEstadoUsuario(u.id, "suspendido"),
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-amber-500/10 transition-colors text-zinc-400 hover:text-amber-400"
                            >
                              <UserMinus size={12} />
                            </button>
                          )}

                          {/* Eliminar - solo si no está inactivo */}
                          {u.estado !== "inactivo" && (
                            <button
                              title="Desactivar"
                              onClick={() =>
                                pedirConfirmacion(
                                  "¿Querés desactivar este usuario?",
                                  () => cambiarEstadoUsuario(u.id, "inactivo"),
                                )
                              }
                              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-red-500/10 transition-colors text-zinc-400 hover:text-red-400"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {!cargando && usuariosFiltrados.length > TAMANIO_PAGINA && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-600">
                {(paginaActual - 1) * TAMANIO_PAGINA + 1}–
                {Math.min(
                  paginaActual * TAMANIO_PAGINA,
                  usuariosFiltrados.length,
                )}{" "}
                de {usuariosFiltrados.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                  disabled={paginaActual === 1}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-700/60 text-zinc-400 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPaginas ||
                      Math.abs(p - paginaActual) <= 1,
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`puntos-${i}`}
                        className="px-1 text-xs text-zinc-600"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPaginaActual(p)}
                        className={`flex h-6 min-w-[24px] items-center justify-center rounded-md border text-xs transition-colors ${
                          p === paginaActual
                            ? "border-zinc-600 bg-zinc-700 text-zinc-100"
                            : "border-zinc-700/60 text-zinc-400 hover:bg-zinc-700"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                <button
                  onClick={() =>
                    setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-700/60 text-zinc-400 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          )}
        </div>
        {confirmacion && (
          <ModalConfirmacion
            mensaje={confirmacion.mensaje}
            onConfirmar={handleConfirmar}
            onCancelar={() => setConfirmacion(null)}
          />
        )}
      </main>
    </div>
  );
}
