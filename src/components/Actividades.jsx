// src/components/Actividades.jsx
"use client";

export default function Actividades({ actividades, animales }) {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Actividades</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Acción</th>
              <th className="px-4 py-2">Detalles</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{animales.find(an => an.id === a.animalId)?.nombre || "-"}</td>
                <td className="px-4 py-2">{a.accion}</td>
                <td className="px-4 py-2">{a.detalles}</td>
                <td className="px-4 py-2">{new Date(a.fecha).toLocaleString("es-PY")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
