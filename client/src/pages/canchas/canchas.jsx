import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../utils/authContext";

import CanchasAdmin from "../../componentes/canchas/canchasAdmin";
import CanchasClient from "../../componentes/canchas/canchasClient";

const API = import.meta.env.VITE_API_URL;

export default function Canchas() {
  const { user, authLoading} = useAuth();

  const [canchas, setCanchas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [canchaAbierta, setCanchaAbierta] = useState(null);

  const [error, setError] = useState(null);

useEffect(() => {
  if (authLoading) return; // espera que termine el auth
   if (user === null) return;

  const getCanchas = async () => {
    try {
      const response = await axios.get(`${API}/canchas/getCanchas`);
      if (response.data.success) {
        const todasLasCanchas = response.data.canchas;
        const activas = todasLasCanchas.filter((c) => c.activa === 1);
        const canchasAMostrar = user?.rol === "admin" ? todasLasCanchas : activas;
        setCanchas(canchasAMostrar);
        if (canchasAMostrar.length > 0) setCanchaAbierta(canchasAMostrar[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las canchas.");
    } finally {
      setLoading(false);
    }
  };

  getCanchas();
}, [authLoading,user]); // ← se ejecuta cuando authLoading pasa a false

  useEffect(() => {
    const getTurnos = async () => {
      setLoadingTurnos(true);
      try {
        const response = await axios.get(`${API}/turnos/getTurnos`, {
          params: { fecha: fechaSeleccionada },
        });
        if (response.data.success) {
          setTurnos(response.data.turnos);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingTurnos(false);
      }
    };
    getTurnos();
  }, [fechaSeleccionada]);

  if (user?.rol === "admin") {
    return (
      <CanchasAdmin
        canchas={canchas}
        setCanchas={setCanchas}
        turnos={turnos}
        setTurnos={setTurnos}
        loading={loading}
        loadingTurnos={loadingTurnos}
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        canchaAbierta={canchaAbierta}
        setCanchaAbierta={setCanchaAbierta}
        error={error}
        setError={setError}
      />
    );
  }

  return (
    <CanchasClient
      canchas={canchas}
      turnos={turnos}
      setTurnos={setTurnos}
      loading={loading}
      loadingTurnos={loadingTurnos}
      fechaSeleccionada={fechaSeleccionada}
      setFechaSeleccionada={setFechaSeleccionada}
      canchaAbierta={canchaAbierta}
      setCanchaAbierta={setCanchaAbierta}
      error={error}
      setError={setError}
    />
  );
}
