"use client";

import { useState } from "react";

export default function Animales({ animales = [], nacimientos = [], sanidades = [], guardarAnimal, eliminarAnimal }) {
  const [formAnimal, setFormAnimal] = useState({ tagid: "", nombre: "", sexo: "", tipo: "", propietario: "", edad: "" });
  const [editAnimalId, setEditAnimalId] = useState(null);

  // Tipos permitidos para no violar constraint en la base
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
    <div className="historial-wrapper">
      <h2 className="historial-title mb-6">🐄 Animales</h2>

      {/* Formulario */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" name="tagid" placeholder="Tag RFID" value={formAnimal.tagid} onChange={onChange} className="input flex-1" />
        <input type="text" name="nombre" placeholder="Nombre" value={formAnimal.nombre} onChange={onChange} className="input flex-1" />
        <input type="number" name="edad" placeholder="Edad (meses)" value={formAnimal.edad || ""} onChange={onChange} className="input flex-1" />
        <select name="sexo" value={formAnimal.sexo} onChange={onChange} className="input flex-1">
          <option value="">Sexo</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <select name="tipo" value={formAnimal.tipo} onChange={onChange} className="input flex-1">
          <option value="">Tipo</option>
          {tiposValidos.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="text" name="propietario" placeholder="Propietario" value={formAnimal.propietario || ""} onChange={onChange} className="input flex-1" />
        <button onClick={handleSubmit} className="btn primary">{editAnimalId ? "Actualizar" : "Agregar"}</button>
      </div>

      {/* Tabla */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Nombre</th>
              <th>Sexo</th>
              <th>Edad</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Crías</th>
              <th>Vacunas</th>
              <th>Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {animales.length === 0 ? (
              <tr>
                <td colSpan="10" className="center helper py-4">No hay animales registrados.</td>
              </tr>
            ) : (
              animales.map((a) => (
                <tr key={a.id}>
                  <td>{a.tagid}</td>
                  <td>{a.nombre}</td>
                  <td>{a.sexo}</td>
                  <td>{a.edad || "-"}</td>
                  <td>{a.tipo || "-"}</td>
                  <td>{categoriaGanadera(a.edad, a.sexo)}</td>
                  <td>{contarCrias(a.id)}</td>
                  <td>{contarVacunas(a.id)}</td>
                  <td>{a.propietario || "-"}</td>
                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(a)} className="btn warn">Editar</button>
                    <button onClick={() => eliminarAnimal(a.id)} className="btn danger">Eliminar</button>
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
