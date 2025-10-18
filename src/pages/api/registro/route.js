import { NextResponse } from "next/server";
import { supabase } from "@/supabaseClient"; // Ajusta la ruta si tu cliente está en otra carpeta

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Falta parámetro uid" }, { status: 400 });
  }

  try {
    // Buscar el animal por tagID
    const { data, error } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", uid)
      .limit(1)
      .single(); // obtenemos un solo registro

    if (error || !data) {
      return NextResponse.json({ error: "Tag no registrado" }, { status: 404 });
    }

    // Actualizar historialEscaneos agregando la fecha actual
    const { error: updateError } = await supabase
      .from("animales")
      .update({
        historialEscaneos: supabase.raw(`array_append(historialEscaneos, ?)`, [
          { fecha: new Date().toISOString() },
        ]),
      })
      .eq("id", data.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ mensaje: "Escaneo registrado correctamente" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
