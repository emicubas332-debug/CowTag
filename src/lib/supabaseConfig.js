// /lib/supabaseConfig.js
import { supabase } from "./supabase";

// 👉 Función para enviar una "señal" al historial
export async function enviarHistorial() {
  const { data, error } = await supabase
    .from("historial")
    .insert([
      {
        mensaje: "Prueba de señal",
        fecha: new Date().toISOString(),
      },
    ]);

  if (error) console.error("❌ Error al enviar señal:", error);
  else console.log("✅ Señal enviada al historial", data);
}
