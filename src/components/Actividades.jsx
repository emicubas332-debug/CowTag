"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Actividades() {
  const [animales, setAnimales] = useState([]);
  const [ultimoEscaneo, setUltimoEscaneo] = useState(null);

  useEffect(() => {
    cargarDatos();

    const canal = supabase
      .channel("realtime:animales")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "animales" },
        (payload) => {
          const updatedAnimal = payload.new;
          setAnimales((prev) =>
            prev.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
          );

          const historial = updatedAnimal.historialEscaneos || [];
          if (historial.length > 0) {
            setUltimoEscaneo({
              animalId: updatedAnimal.id,
              animalNombre: updatedAnimal.nombre,
              tagID: updatedAnimal.tagid, // mostrar tag
              fecha: historial[historial.length - 1].fecha,
            });

            setTimeout(() => setUltimoEscaneo(null), 5000);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  async function cargarDatos() {
    const { data, error } = await supabase.from("animales").select("*");
    if (!error && data) setAnimales(data);
  }

  const actividades = animales.flatMap((animal) =>
    (animal.historialEscaneos || []).map((esc, index) => ({
      id: `${animal.id}-${index}`,
      animalId: animal.id,
      animalNombre: animal.nombre || "-",
      tagID: animal.tagid || "-",
      fecha: esc.fecha,
    }))
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <header className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🐄 Historial de Escaneos</h1>
        <p className="text-gray-600">Últimos registros en tiempo real de tus animales.</p>
      </header>

      {/* Mensaje último escaneo */}
      {ultimoEscaneo && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md animate-pulse text-center font-medium">
          ✅ Tag <strong>{ultimoEscaneo.animalNombre}</strong> ({ultimoEscaneo.tagID}) escaneado a las{" "}
          {new Date(ultimoEscaneo.fecha).toLocaleTimeString("es-PY")}
        </div>
      )}

      {/* Tabla de escaneos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">Animal</th>
              <th className="px-6 py-3 text-left">Tag</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Hora</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {actividades.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400 italic">
                  No hay lecturas registradas aún.
                </td>
              </tr>
            ) : (
              actividades
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map((a) => (
                  <tr
                    key={a.id}
                    className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
                      ultimoEscaneo &&
                      a.animalId === ultimoEscaneo.animalId &&
                      a.fecha === ultimoEscaneo.fecha
                        ? "bg-green-50"
                        : ""
                    }`}
                  >
                    <td className="px-6 py-3 font-medium">{a.animalNombre}</td>
                    <td className="px-6 py-3">{a.tagID}</td>
                    <td className="px-6 py-3">
                      {new Date(a.fecha).toLocaleDateString("es-PY", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3">
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
