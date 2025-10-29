"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [ultimoEscaneo, setUltimoEscaneo] = useState(null);

  useEffect(() => {
    cargarDatos();

    const canal = supabase
      .channel("realtime:actividades")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "actividades" },
        (payload) => {
          const nueva = payload.new;
          setActividades((prev) => [nueva, ...prev]);
          setUltimoEscaneo(nueva);
          setTimeout(() => setUltimoEscaneo(null), 5000);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(canal);
  }, []);

  async function cargarDatos() {
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      .order("fecha", { ascending: false });
    if (!error && data) setActividades(data);
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <header className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Historial de Escaneos
        </h1>
        <p className="text-gray-600">
          Últimos registros en tiempo real de tus animales.
        </p>
      </header>

      {ultimoEscaneo && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-md animate-pulse text-center font-medium">
          ✅ Tag <strong>{ultimoEscaneo.uid}</strong> escaneado a las{" "}
          {new Date(ultimoEscaneo.fecha).toLocaleTimeString("es-PY")}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 text-white uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">UID</th>
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
              actividades.map((a) => (
                <tr
                  key={a.id}
                  className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
                    ultimoEscaneo && a.id === ultimoEscaneo.id
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <td className="px-6 py-3 font-medium">{a.id}</td>
                  <td className="px-6 py-3">{a.uid}</td>
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
