// src/pages/api/registro.js
import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const AUTH_KEY = process.env.ESP_API_KEY; // tu token secreto

  // Solo POST permitido
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // Validar token en header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const token = authHeader.slice(7);
  if (token !== AUTH_KEY) {
    return res.status(403).json({ error: "Token inválido" });
  }

  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "Falta parámetro uid" });
    }

    // Buscar animal por tagID
    const { data: animal, error: findError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", uid)
      .single();

    if (findError || !animal) {
      return res.status(404).json({ error: "Tag no registrado" });
    }

    // Agregar nueva lectura al historial
    const nuevoEscaneo = { fecha: new Date().toISOString() };
    const historialActual = animal.historialEscaneos || [];

    const { error: updateError } = await supabase
      .from("animales")
      .update({
        historialEscaneos: [...historialActual, nuevoEscaneo],
      })
      .eq("id", animal.id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({
      mensaje: "✅ Escaneo registrado correctamente",
      tagID: uid,
      fecha: nuevoEscaneo.fecha,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
