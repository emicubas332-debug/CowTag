// src/pages/api/registroEscaneo.js (o src/app/api/registroEscaneo/route.js si usas app router)

import { supabase } from "@/lib/supabaseConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ message: "Falta uid" });
  }

  try {
    const { error } = await supabase
      .from("escaneos")
      .insert([{ uid, fecha: new Date().toISOString() }]);

    if (error) {
      return res.status(500).json({ message: "Error interno: " + error.message });
    }

    return res.status(200).json({ message: "Escaneo registrado" });
  } catch (err) {
    return res.status(500).json({ message: "Error interno: " + err.message });
  }
}
