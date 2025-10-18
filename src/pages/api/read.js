// src/pages/api/registroLectura.js (o src/app/api/registroLectura/route.js)

import { supabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { tagID } = req.body;

  if (!tagID) {
    return res.status(400).json({ error: "Falta tagID" });
  }

  try {
    const { error } = await supabase
      .from("lecturas")
      .insert([{ tagID, timestamp: new Date().toISOString() }]);

    if (error) {
      return res.status(500).json({ error: "Error registrando lectura: " + error.message });
    }

    return res.status(200).json({ message: "Lectura registrada correctamente" });
  } catch (err) {
    return res.status(500).json({ error: "Error registrando lectura: " + err.message });
  }
}
