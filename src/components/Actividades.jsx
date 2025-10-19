"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Actividades() {
  const [animales, setAnimales] = useState([]);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();

    // Suscripción en tiempo real (para actualizar automáticamente)
    const canal = supabase
      .channel("realtime:animales")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "animales" },
        () => {
          cargarDatos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  async function cargarDatos() {
    const { data, error } = await supabase.from("animales").select("*");
    if (!error && data) setAnimales(data);
  }

  // Crear lista combinada de todos los escaneos
  const actividades = animales.flatMap((animal) =>
    (animal.historialEscaneos || []).map((esc, index) => ({
      id: `${animal.id}-${index}`,
      animalNombre: animal.nombre || "-",
      fecha: esc.fecha,
    }))
  );

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Historial de Escaneos
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Hora</th>
            </tr>
          </thead>
          <tbody>
            {actividades.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No hay lecturas registradas aún.
                </td>
              </tr>
            ) : (
              actividades
                .sort(
                  (a, b) => new Date(b.fecha) - new Date(a.fecha)
                ) // orden descendente
                .map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{a.animalNombre}</td>
                    <td className="px-4 py-2">
                      {new Date(a.fecha).toLocaleDateString("es-PY", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(a.fecha).toLocaleTimeString("es-PY")}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
