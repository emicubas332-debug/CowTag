// pages/animales/[id].js
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/router";

export default function Historial() {
  const [animal, setAnimal] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Animal no encontrado");
        router.push("/");
        return;
      }

      // Asegurarse de tener historialEscaneos como array
      data.historialEscaneos = data.historialEscaneos || [];
      // Ordenar por fecha descendente
      data.historialEscaneos.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setAnimal(data);
    };

    fetchAnimal();
  }, [id, router]);

  if (!animal) return <p>Cargando...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Historial de escaneos - {animal.nombre || animal.tagID}</h1>
      {animal.historialEscaneos.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#3498db", color: "white" }}>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Lector</th>
            </tr>
          </thead>
          <tbody>
            {animal.historialEscaneos.map((escaneo, i) => {
              const fechaObj = new Date(escaneo.fecha);
              const fecha = fechaObj.toLocaleDateString();
              const hora = fechaObj.toLocaleTimeString();
              return (
                <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                  <td>{fecha}</td>
                  <td>{hora}</td>
                  <td>{escaneo.lector || "Desconocido"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No hay escaneos registrados.</p>
      )}
    </div>
  );
}
