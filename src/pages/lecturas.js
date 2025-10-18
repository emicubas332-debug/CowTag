// src/components/Lecturas.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import useAuth from "../hooks/useAuth";

export default function Lecturas() {
  const user = useAuth();
  const [lecturas, setLecturas] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Función para obtener historial
    const fetchLecturas = async () => {
      const { data, error } = await supabase
        .from("historialEscaneos")
        .select("*")
        .order("fechaHora", { ascending: false });

      if (error) {
        console.error("Error al obtener lecturas:", error);
      } else {
        setLecturas(data);
      }
    };

    fetchLecturas();

    // Realtime: escuchar cambios en la tabla
    const subscription = supabase
      .channel("public:historialEscaneos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "historialEscaneos" },
        (payload) => {
          // Cada vez que hay un cambio, recarga las lecturas
          fetchLecturas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Historial de Escaneos</h1>
      <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tag RFID</th>
            <th>Fecha y Hora</th>
            <th>Lector</th>
          </tr>
        </thead>
        <tbody>
          {lecturas.map((l) => (
            <tr key={l.id}>
              <td>{l.tagID}</td>
              <td>{l.fechaHora ? new Date(l.fechaHora).toLocaleString() : "Sin fecha"}</td>
              <td>{l.lector || "Desconocido"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
