import { useAuth } from "../../utils/authContext";

import CanchasAdmin from "../../componentes/canchas/canchasAdmin";
import CanchasClient from "../../componentes/canchas/canchasClient";

export default function Canchas() {

   const { user } = useAuth();

   if(user?.rol === "admin") {
      return <CanchasAdmin />
   }

   return <CanchasClient />
}