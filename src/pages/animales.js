// src/components/Animales.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Animales() {
  const [animales, setAnimales] = useState([]);

  useEffect(() => {
    const fetchAnimales = async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("Error al cargar animales:", error);
      } else {
        setAnimales(data);
      }
    };

    fetchAnimales();
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h1>Lista de Animales</h1>
      {animales.length === 0 ? (
        <p>No hay animales registrados.</p>
      ) : (
        <table
          border={1}
          cellPadding={5}
          cellSpacing={0}
          style={{ width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th>Tag ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Raza</th>
              <th>Edad (años)</th>
              <th>Peso (kg)</th>
              <th>Ciclo Reproductivo</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {animales.map((animal) => (
              <tr key={animal.id}>
                <td>{animal.tagID || "-"}</td>
                <td>{animal.nombre || "-"}</td>
                <td>{animal.tipo || "-"}</td>
                <td>{animal.raza || "-"}</td>
                <td>{animal.edad || "-"}</td>
                <td>{animal.peso || "-"}</td>
                <td>{animal.cicloReproductivo || "-"}</td>
                <td>{animal.notas || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
