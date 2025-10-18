"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
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
    <div style={{ padding: "20px" }}>
      <h1>🐄 Lista de Animales</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Ciclo Reproductivo</th>
            <th>Tag ID</th>
          </tr>
        </thead>
        <tbody>
          {animales.map(a => (
            <tr key={a.id}>
              <td>{a.nombre || "-"}</td>
              <td>{a.tipo || "-"}</td>
              <td>{a.cicloReproductivo || "-"}</td>
              <td>{a.tag || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
