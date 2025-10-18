"use client";

import { useState } from "react";

export default function Nacimientos({ nacimientos = [], animales = [], guardarNacimiento }) {
  const [form, setForm] = useState({ madreId: "", padreId: "", fecha: "", cantidad: 1 });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => setForm({ madreId: "", padreId: "", fecha: "", cantidad: 1 });

  const handleSubmit = async () => {
    if (!form.madreId || !form.padreId || !form.fecha || !form.cantidad) {
      alert("Por favor completa todos los campos");
      return;
    }
    await guardarNacimiento(form);
    resetForm();
  };

  // Función para calcular categoría de animal
  const categoriaGanadera = (edad, sexo) => {
    const e = Number(edad || 0);
    if (e < 6) return "Ternero";
    if (e < 12) return "Desmamante";
    if (e >= 12 && (sexo || "").toLowerCase() === "hembra") return "Vaquilla";
    if (e >= 12 && (sexo || "").toLowerCase() === "macho") return "Torito";
    return "Adulto";
  };

  // Función para contar crías por madre
  const criasPorMadre = (madreId) => {
    return nacimientos
      .filter(n => n.madreId === madreId)
      .reduce((acc, n) => acc + Number(n.cantidad || 0), 0);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Nacimientos</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          name="madreId"
          value={form.madreId}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar madre</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre} ({categoriaGanadera(a.edad, a.sexo)}) - Crías: {criasPorMadre(a.id)}
            </option>
          ))}
        </select>

        <select
          name="padreId"
          value={form.padreId}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar padre</option>
          {animales.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre} ({categoriaGanadera(a.edad, a.sexo)})
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
          type="number"
          name="cantidad"
          value={form.cantidad}
          min="1"
          onChange={onChange}
          className="border p-2 rounded w-24"
        />
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2">Madre</th>
              <th className="px-4 py-2">Padre</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Total Crías Madre</th>
              <th className="px-4 py-2">Tipo Madre</th>
            </tr>
          </thead>
          <tbody>
            {nacimientos.map(n => {
              const madre = animales.find(a => a.id === n.madreId) || {};
              const padre = animales.find(a => a.id === n.padreId) || {};
              return (
                <tr key={n.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{madre.nombre || "-"}</td>
                  <td className="px-4 py-2">{padre.nombre || "-"}</td>
                  <td className="px-4 py-2">{n.fecha}</td>
                  <td className="px-4 py-2">{n.cantidad}</td>
                  <td className="px-4 py-2">{criasPorMadre(n.madreId)}</td>
                  <td className="px-4 py-2">{categoriaGanadera(madre.edad, madre.sexo)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
