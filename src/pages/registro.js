// pages/registro.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Registro() {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    async function cargarDatos() {
      // Trae todos los animales y su historialEscaneos
      const { data: animales, error } = await supabase
        .from("animales")
        .select("tag, historialEscaneos")
        .order("tag", { ascending: true });

      if (error) {
        console.error("Error al cargar animales:", error);
        return;
      }

      const nuevosMensajes = [];

      animales.forEach((animal) => {
        const historial = animal.historialEscaneos || [];

        historial.forEach((registro, i) => {
          const fecha = registro.fecha ? new Date(registro.fecha) : null;
          if (!fecha) return;

          const fechaFormateada = fecha.toLocaleString("es-AR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          });

          nuevosMensajes.push(
            `${fechaFormateada} - Tag ${animal.tag} pasó por el lector`
          );
        });
      });

      // Ordena por fecha descendente
      nuevosMensajes.sort((a, b) => {
        const fechaA = new Date(a.split(" - ")[0]);
        const fechaB = new Date(b.split(" - ")[0]);
        return fechaB - fechaA;
      });

      setMensajes(nuevosMensajes);
    }

    cargarDatos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Registros de Escaneos</h1>
      <ul>
        {mensajes.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
