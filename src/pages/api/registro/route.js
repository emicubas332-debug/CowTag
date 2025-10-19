import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request) {
  const AUTH_KEY = process.env.ESP_API_KEY; // tu token secreto

  // Validar header de autorización
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  if (token !== AUTH_KEY) {
    return NextResponse.json({ error: "Token inválido" }, { status: 403 });
  }

  try {
    const { uid } = await request.json();
    if (!uid) {
      return NextResponse.json({ error: "Falta parámetro uid" }, { status: 400 });
    }

    // Buscar animal con ese tagID
    const { data: animal, error: findError } = await supabase
      .from("animales")
      .select("*")
      .eq("tagID", uid)
      .single();

    if (findError || !animal) {
      return NextResponse.json({ error: "Tag no registrado" }, { status: 404 });
    }

    // Agregar nueva lectura
    const nuevoEscaneo = { fecha: new Date().toISOString() };
    const historialActual = animal.historialEscaneos || [];

    const { error: updateError } = await supabase
      .from("animales")
      .update({
        historialEscaneos: [...historialActual, nuevoEscaneo],
      })
      .eq("id", animal.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      mensaje: "✅ Escaneo registrado correctamente",
      tagID: uid,
      fecha: nuevoEscaneo.fecha,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
