"use client";

import { useState } from "react";

export default function Sanidades({ sanidades = [], animales = [], guardarSanidad }) {
  const [form, setForm] = useState({ animalId: "", fecha: "", tipo: "", dosis: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => setForm({ animalId: "", fecha: "", tipo: "", dosis: "" });

  const handleSubmit = async () => {
    if (!form.animalId || !form.fecha || !form.tipo || !form.dosis) {
      alert("Por favor completa todos los campos");
      return;
    }
    await guardarSanidad(form);
    resetForm();
  };

  // Función para contar vacunas por animal
  const vacunasPorAnimal = (animalId) => {
    return sanidades.filter(s => s.animalId === animalId).length;
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Sanidades</h2>

      <div className="mb-4 text-yellow-800 font-semibold">
        Total vacunas aplicadas: {sanidades.length}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="animalId"
          value={form.animalId}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar animal</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre} ({vacunasPorAnimal(a.id)} vacunas)
            </option>
          ))}
        </select>

        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Tipo"
          name="tipo"
          value={form.tipo}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Dosis"
          name="dosis"
          value={form.dosis}
          onChange={onChange}
          className="border p-2 rounded w-24"
        />
        <button
          onClick={handleSubmit}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-yellow-600 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Dosis</th>
              <th className="px-4 py-2">Total Vacunas</th>
            </tr>
          </thead>
          <tbody>
            {sanidades.map(s => {
              const animal = animales.find(a => a.id === s.animalId) || {};
              return (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{animal.nombre || "-"}</td>
                  <td className="px-4 py-2">{s.fecha}</td>
                  <td className="px-4 py-2">{s.tipo}</td>
                  <td className="px-4 py-2">{s.dosis}</td>
                  <td className="px-4 py-2">{vacunasPorAnimal(s.animalId)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
