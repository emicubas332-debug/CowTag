// /lib/escaneo.js
import { supabase } from "./supabase";

export async function registrarEscaneo(tagID) {
  // Buscar animal por tagID
  const { data: animales, error: errorSelect } = await supabase
    .from("animales")
    .select("*")
    .eq("tagID", tagID)
    .limit(1);

  if (errorSelect) {
    console.error("Error al buscar animal:", errorSelect);
    return false;
  }

  if (!animales || animales.length === 0) {
    console.log("El tag no está registrado en el sistema");
    return false;
  }

  const animal = animales[0];

  // Preparar historial
  const historialEscaneos = animal.historialEscaneos || [];
  const nuevoContador = historialEscaneos.length + 1;

  // Agregar nuevo escaneo
  const { error: errorUpdate } = await supabase
    .from("animales")
    .update({
      historialEscaneos: [...historialEscaneos, { fecha: new Date(), contador: nuevoContador }]
    })
    .eq("id", animal.id);

  if (errorUpdate) {
    console.error("Error al actualizar historial:", errorUpdate);
    return false;
  }

  console.log(`Escaneo registrado para tag ${tagID}, total escaneos: ${nuevoContador}`);
  return true;
}
