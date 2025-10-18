// src/pages/api/registroAnimal.js

import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    tagID,
    lector,
    nombre,
    dueño,
    fechaNacimiento,
    numeroVaca,
    sexo,
    cantidadVacunas,
    peso,
  } = req.body;

  if (!tagID) {
    return res.status(400).json({ error: "Falta el tagID" });
  }

  try {
    // Buscar animal por tagID
    const { data: existingAnimal, error: selectError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", tagID)
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      return res.status(500).json({ error: selectError.message });
    }

    if (!existingAnimal) {
      // Crear nuevo animal
      const { data, error: insertError } = await supabase
        .from("animales")
        .insert([{
          tagID,
          nombre: nombre || "",
          dueño: dueño || "",
          fechaNacimiento: fechaNacimiento || "",
          numeroVaca: numeroVaca || "",
          sexo: sexo || "",
          cantidadVacunas: cantidadVacunas || 0,
          peso: peso || 0,
          historialEscaneos: [{ fecha: new Date().toISOString(), lector: lector || "desconocido" }],
        }]);

      if (insertError) return res.status(500).json({ error: insertError.message });
      return res.status(201).json({ message: "Animal registrado", id: data[0].id });
    } else {
      // Actualizar historialEscaneos y campos si vienen
      const updateData = {
        historialEscaneos: supabase.raw(`array_append(historialEscaneos, ?)`, [
          { fecha: new Date().toISOString(), lector: lector || "desconocido" },
        ]),
      };

      if (nombre) updateData.nombre = nombre;
      if (dueño) updateData.dueño = dueño;
      if (fechaNacimiento) updateData.fechaNacimiento = fechaNacimiento;
      if (numeroVaca) updateData.numeroVaca = numeroVaca;
      if (sexo) updateData.sexo = sexo;
      if (cantidadVacunas !== undefined) updateData.cantidadVacunas = cantidadVacunas;
      if (peso !== undefined) updateData.peso = peso;

      const { error: updateError } = await supabase
        .from("animales")
        .update(updateData)
        .eq("id", existingAnimal.id);

      if (updateError) return res.status(500).json({ error: updateError.message });
      return res.status(200).json({ message: "Animal actualizado y historial agregado", id: existingAnimal.id });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
