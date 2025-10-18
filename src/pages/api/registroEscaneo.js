// src/pages/api/registroEscaneo.js

import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: "Falta parámetro uid" });

  try {
    // Buscar el animal por tagID
    const { data: animal, error: selectError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", uid)
      .limit(1)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = not found
      return res.status(500).json({ error: selectError.message });
    }

    if (!animal) {
      return res.status(404).json({ error: "Tag no registrado" });
    }

    // Actualizar historialEscaneos agregando nueva fecha
    const { error: updateError } = await supabase
      .from("animales")
      .update({
        historialEscaneos: supabase.raw(
          "array_append(historialEscaneos, ?)",
          [{ fecha: new Date().toISOString() }]
        ),
      })
      .eq("id", animal.id);

    if (updateError) return res.status(500).json({ error: updateError.message });

    return res.status(200).json({ mensaje: "Escaneo registrado correctamente" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
