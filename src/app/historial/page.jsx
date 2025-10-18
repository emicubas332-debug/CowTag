"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function HistorialPage() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer datos de Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*")
        .order("fechaRegistro", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setHistorial(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function formatDate(fecha) {
    if (!fecha) return "Fecha no disponible";
    const date = new Date(fecha);
    return date.toLocaleString("es-PY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 flex items-center gap-3">
        Historial de Animales
        <span className="bg-blue-900 text-white text-xs font-bold px-2 py-1 rounded">CowTag</span>
      </h1>

      {loading && <p className="text-gray-600">Cargando...</p>}
      {!loading && historial.length === 0 && (
        <p className="text-gray-500">No hay registros aún.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {historial.map((animal) => (
          <div
            key={animal.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition-shadow"
          >
            <p className="font-semibold text-gray-700">
              Tag: <span className="text-blue-700">{animal.tagID || "Sin tag"}</span>
            </p>
            <p className="font-semibold text-gray-700 mt-1">
              Fecha de registro:{" "}
              <span className="text-gray-600">{formatDate(animal.fechaRegistro)}</span>
            </p>

            {animal.historialEscaneos?.length > 0 && (
              <div className="mt-3">
                <h3 className="font-bold text-blue-800 mb-2">Historial de escaneos</h3>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto text-gray-600 text-sm">
                  {animal.historialEscaneos.map((escaneo, i) => {
                    let fechaEscaneo = escaneo.fecha ? formatDate(escaneo.fecha) : "Fecha no disponible";
                    return (
                      <li key={i} className="mb-1">
                        <strong>{escaneo.mensaje || `Escaneo #${i + 1}`}</strong> -{" "}
                        <em>{fechaEscaneo}</em>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
