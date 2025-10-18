"use client";

import { useState } from "react";

export default function Sanidades({ sanidades = [], animales = [], guardarSanidad }) {
  const [form, setForm] = useState({
    animalido: "", // todavía string, se convertirá a integer al enviar
    fecha: "",
    tipo: "",
    dosis: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({ animalido: "", fecha: "", tipo: "", dosis: "" });
  };

  const handleSubmit = async () => {
    // Validación de campos obligatorios
    if (!form.animalido || !form.fecha || !form.tipo || !form.dosis) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const sanidadData = {
      animalido: Number(form.animalido), // conversión correcta aquí
      fecha: form.fecha,
      tipo: form.tipo,
      dosis: Number(form.dosis),         // conversión correcta aquí
    };

    try {
      await guardarSanidad(sanidadData);
      resetForm();
    } catch (error) {
      alert("Error al guardar sanidad: " + error.message);
    }
  };

  const vacunasPorAnimal = (animalId) =>
    sanidades.filter(
      (s) => s.animalido === Number(animalId) && s.tipo.toLowerCase().includes("vacuna")
    ).length;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-yellow-700 mb-4">Sanidades</h2>

      <div className="mb-4 text-yellow-800 font-semibold">
        Total vacunas aplicadas: {sanidades.length}
      </div>

      {/* Formulario */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="animalido"
          value={form.animalido}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar animal</option>
          {animales.map((a) => (
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
          type="number"
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

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-yellow-600 text-white">
            <tr>
              <th className="px-4 py-2">Animal</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Dosis</th>
              <th className="px-4 py-2">Vacunas aplicadas</th>
            </tr>
          </thead>
          <tbody>
            {sanidades.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No hay registros de sanidad.
                </td>
              </tr>
            ) : (
              sanidades.map((s) => {
                const animal = animales.find((a) => a.id === s.animalido) || {};
                return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{animal.nombre || "-"}</td>
                    <td className="px-4 py-2">{new Date(s.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{s.tipo}</td>
                    <td className="px-4 py-2">{s.dosis}</td>
                    <td className="px-4 py-2">{vacunasPorAnimal(s.animalido)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
