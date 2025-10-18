// src/components/ActividadAnimal.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { registrarActividad } from "../utils/registrarActividadSupabase"; // función adaptada a Supabase

const ActividadAnimal = ({ tagId }) => {
  const [animal, setAnimal] = useState(null);

  useEffect(() => {
    if (!tagId) return;

    // Obtener datos iniciales del animal
    const fetchAnimal = async () => {
      const { data, error } = await supabase
        .from("animales")
        .select("*")
        .eq("tagID", tagId)
        .single();

      if (error) {
        console.error("Error al obtener animal:", error);
        setAnimal(null);
      } else {
        setAnimal(data);
      }
    };

    fetchAnimal();

    // Escucha en tiempo real cambios en la tabla 'actividades'
    const subscription = supabase
      .from(`actividades:tagID=eq.${tagId}`)
      .on("INSERT", (payload) => {
        setAnimal((prev) => {
          if (!prev) return prev;
          const nuevaActividad = payload.new;
          return {
            ...prev,
            actividad: prev.actividad
              ? [nuevaActividad, ...prev.actividad]
              : [nuevaActividad],
          };
        });
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [tagId]);

  const handleScan = async () => {
    await registrarActividad(tagId); // función que inserta actividad en Supabase
  };

  return (
    <div className="p-6 rounded-2xl shadow bg-white">
      <h2 className="text-2xl font-bold mb-4">🐄 Información del Animal</h2>

      {animal ? (
        <>
          {/* Datos del animal */}
          <div className="mb-4">
            <p><strong>Nombre:</strong> {animal.nombre || "No registrado"}</p>
            <p><strong>Raza:</strong> {animal.raza || "No registrada"}</p>
            <p><strong>Edad:</strong> {animal.edad || "No registrada"}</p>
          </div>

          {/* Botón para registrar escaneo */}
          <button
            onClick={handleScan}
            className="px-4 py-2 mb-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            📡 Registrar escaneo
          </button>

          {/* Actividades */}
          <h3 className="text-lg font-semibold mb-2">📋 Actividad registrada</h3>
          {animal.actividad && animal.actividad.length > 0 ? (
            <ul className="space-y-2">
              {animal.actividad
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // más reciente primero
                .map((act, i) => (
                  <li
                    key={i}
                    className="p-2 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <p><strong>Tipo:</strong> {act.tipo}</p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {act.created_at
                        ? new Date(act.created_at).toLocaleString()
                        : "Sin fecha"}
                    </p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay actividades registradas.</p>
          )}
        </>
      ) : (
        <p className="text-red-500">❌ Animal no encontrado en la base de datos.</p>
      )}
    </div>
  );
};

export default ActividadAnimal;
