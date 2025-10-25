"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Nacimientos({ animales = [], nacimientos = [], setNacimientos }) {
  const [form, setForm] = useState({
    madreId: "",
    padreId: "",
    fecha: "",
    cantidad: 1,
    tagPrefix: "TAG",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () =>
    setForm({ madreId: "", padreId: "", fecha: "", cantidad: 1, tagPrefix: "TAG" });

  // Categoría según edad
  const categoriaGanadera = (edad, sexo) => {
    const e = Number(edad || 0);
    if (e < 6) return "Ternero";
    if (e < 12) return "Desmamante";
    if (e >= 12 && (sexo || "").toLowerCase() === "hembra") return "Vaquilla";
    if (e >= 12 && (sexo || "").toLowerCase() === "macho") return "Torito";
    return "Adulto";
  };

  // Filtrar solo adultos para selección
  const adultos = animales.filter(a => {
    const cat = categoriaGanadera(a.edad, a.sexo);
    return cat === "Vaquilla" || cat === "Torito" || cat === "Adulto";
  });

  const handleSubmit = async () => {
    if (!form.madreId || !form.padreId || !form.fecha || !form.cantidad) {
      alert("Completa todos los campos");
      return;
    }

    const madre = animales.find(a => a.id === form.madreId);
    const padre = animales.find(a => a.id === form.padreId);

    const nacimientosNuevos = [];

    for (let i = 0; i < form.cantidad; i++) {
      // Generar tag único
      const tag = `${form.tagPrefix}-${Date.now()}-${i}`;

      // Registrar animal recién nacido
      const { data: hijo, error: errorHijo } = await supabase
        .from("animales")
        .insert({
          nombre: `Cría ${i + 1}`,
          sexo: Math.random() > 0.5 ? "Macho" : "Hembra",
          tipo: "Ternero",
          edad: 0,
          propietario: madre?.propietario || "Desconocido",
          tagid: tag,
        })
        .select()
        .single();

      if (errorHijo) {
        alert("Error al guardar animal: " + errorHijo.message);
        return;
      }

      // Guardar nacimiento
      const { data: nacimientoGuardado, error: errorNacimiento } = await supabase
        .from("nacimientos")
        .insert({
          madreId: madre.id,
          padreId: padre.id,
          hijoId: hijo.id,
          fecha: form.fecha,
          cantidad: 1,
        })
        .select()
        .single();

      if (errorNacimiento) {
        alert("Error al guardar nacimiento: " + errorNacimiento.message);
        return;
      }

      nacimientosNuevos.push({ ...nacimientoGuardado, hijo });
    }

    // Actualizar estado
    setNacimientos([...nacimientosNuevos, ...nacimientos]);
    resetForm();
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-purple-700">Registrar Nacimiento</h2>

      <div className="flex flex-wrap gap-2">
        <select
          name="madreId"
          value={form.madreId}
          onChange={onChange}
          className="border p-2 rounded flex-1"
        >
          <option value="">Seleccionar madre</option>
          {adultos
            .filter(a => a.sexo.toLowerCase() === "hembra")
            .map(a => (
              <option key={a.id} value={a.id}>
                {a.nombre} ({categoriaGanadera(a.edad, a.sexo)})
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
          {adultos
            .filter(a => a.sexo.toLowerCase() === "macho")
            .map(a => (
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
        <input
          type="text"
          name="tagPrefix"
          value={form.tagPrefix}
          onChange={onChange}
          className="border p-2 rounded flex-1"
          placeholder="Prefijo tag"
        />
        <button
          onClick={handleSubmit}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Registrar
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="px-4 py-2">Madre</th>
              <th className="px-4 py-2">Padre</th>
              <th className="px-4 py-2">Hijo</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Tag Hijo</th>
            </tr>
          </thead>
          <tbody>
            {nacimientos.map(n => {
              const madre = animales.find(a => a.id === n.madreId) || {};
              const padre = animales.find(a => a.id === n.padreId) || {};
              const hijo = n.hijo || {};
              return (
                <tr key={n.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{madre.nombre || "-"}</td>
                  <td className="px-4 py-2">{padre.nombre || "-"}</td>
                  <td className="px-4 py-2">{hijo.nombre || "-"}</td>
                  <td className="px-4 py-2">{n.fecha}</td>
                  <td className="px-4 py-2">{hijo.tagid || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
