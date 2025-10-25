"use client";

import { useState } from "react";

export default function Animales({ animales = [], nacimientos = [], sanidades = [], guardarAnimal, eliminarAnimal }) {
  const [formAnimal, setFormAnimal] = useState({ tagid: "", nombre: "", sexo: "", tipo: "", propietario: "", edad: "" });
  const [editAnimalId, setEditAnimalId] = useState(null);

  const tiposValidos = ["Vaca", "Toro", "Ternero"];

  const onChange = (e) => setFormAnimal({ ...formAnimal, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormAnimal({ tagid: "", nombre: "", sexo: "", tipo: "", propietario: "", edad: "" });
    setEditAnimalId(null);
  };

  const categoriaGanadera = (edad, sexo) => {
    const e = Number(edad || 0);
    if (e < 6) return "Ternero";
    if (e < 12) return "Desmamante";
    if (e >= 12 && (sexo || "").toLowerCase() === "hembra") return "Vaquilla";
    if (e >= 12 && (sexo || "").toLowerCase() === "macho") return "Torito";
    return "Adulto";
  };

  const contarCrias = (animalId) => nacimientos.filter(n => n.madreId === animalId).reduce((acc, n) => acc + (n.cantidad || 0), 0);
  const contarVacunas = (animalId) => sanidades.filter(s => s.animalId === animalId && s.tipo.toLowerCase().includes("vacuna")).length;

  const handleSubmit = async () => {
    if (!formAnimal.tagid.trim() || !formAnimal.nombre.trim()) {
      alert("Tag y nombre son obligatorios.");
      return;
    }

    if (!formAnimal.tipo || !tiposValidos.includes(formAnimal.tipo)) {
      alert(`Tipo de animal no válido. Debe ser: ${tiposValidos.join(", ")}`);
      return;
    }

    const animalData = { ...formAnimal };
    if (animalData.edad) animalData.edad = Number(animalData.edad);

    try {
      await guardarAnimal(animalData, editAnimalId);
      resetForm();
    } catch (e) {
      alert("Error al guardar animal: " + e.message);
    }
  };

  const handleEdit = (a) => {
    setFormAnimal({
      tagid: a.tagid,
      nombre: a.nombre,
      sexo: a.sexo,
      tipo: a.tipo || "",
      propietario: a.propietario || "",
      edad: a.edad || "",
    });
    setEditAnimalId(a.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">🐄 Animales</h2>

      {/* Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <input type="text" name="tagid" placeholder="Tag RFID" value={formAnimal.tagid} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
        <input type="text" name="nombre" placeholder="Nombre" value={formAnimal.nombre} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
        <input type="number" name="edad" placeholder="Edad (meses)" value={formAnimal.edad || ""} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
        <select name="sexo" value={formAnimal.sexo} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none">
          <option value="">Sexo</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <select name="tipo" value={formAnimal.tipo} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none">
          <option value="">Tipo</option>
          {tiposValidos.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="text" name="propietario" placeholder="Propietario" value={formAnimal.propietario || ""} onChange={onChange} className="border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none" />
        <button onClick={handleSubmit} className="col-span-1 md:col-span-4 bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition-all">{editAnimalId ? "Actualizar" : "Agregar"}</button>
      </div>

      {/* Lista de animales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animales.length === 0 && <p className="col-span-full text-center text-gray-500 py-6">No hay animales registrados.</p>}
        {animales.map((a) => (
          <div key={a.id} className="bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold mb-2">{a.nombre} ({a.tipo})</h3>
            <p className="text-gray-700 mb-1"><strong>Tag:</strong> {a.tagid}</p>
            <p className="text-gray-700 mb-1"><strong>Edad:</strong> {a.edad || "-"}</p>
            <p className="text-gray-700 mb-1"><strong>Sexo:</strong> {a.sexo}</p>
            <p className="text-gray-700 mb-1"><strong>Categoría:</strong> {categoriaGanadera(a.edad, a.sexo)}</p>
            <p className="text-gray-700 mb-1"><strong>Crías:</strong> {contarCrias(a.id)}</p>
            <p className="text-gray-700 mb-1"><strong>Vacunas:</strong> {contarVacunas(a.id)}</p>
            <p className="text-gray-700 mb-3"><strong>Propietario:</strong> {a.propietario || "-"}</p>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(a)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all">Editar</button>
              <button onClick={() => eliminarAnimal(a.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
