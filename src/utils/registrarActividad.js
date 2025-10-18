// src/utils/registrarActividad.js
import { supabase } from "@/lib/supabase";

/**
 * Registra una nueva actividad de escaneo RFID en el animal correspondiente.
 * @param {string} tagId - ID del animal (columna tagID en la tabla "animales")
 */
export const registrarActividad = async (tagId) => {
  try {
    // Buscar el animal por tagID
    const { data: animal, error: selectError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", tagId)
      .single();

    if (selectError) {
      if (selectError.code === "PGRST116") {
        console.log("❌ Tag no registrado en la base de datos.");
        return;
      }
      throw selectError;
    }

    // Actualizar el array actividad agregando una nueva lectura
    const { error: updateError } = await supabase
      .from("animales")
      .update({
        actividad: supabase.raw(
          "array_append(actividad, ?)",
          [{ tipo: "Lectura RFID", fecha: new Date().toISOString() }]
        ),
      })
      .eq("id", animal.id);

    if (updateError) throw updateError;

    console.log("✅ Actividad registrada con éxito.");
  } catch (error) {
    console.error("⚠ Error al registrar actividad:", error.message);
  }
};
