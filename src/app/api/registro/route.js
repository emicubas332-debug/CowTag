// src/app/api/registro/route.js
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request) {
  const AUTH_KEY = process.env.ESP_API_KEY; // tu token secreto

  // Validar header Authorization
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  if (token !== AUTH_KEY) {
    return NextResponse.json({ error: "Token inválido" }, { status: 403 });
  }

  try {
    const { uid, tag, accion, nombre } = await request.json();

    if (!uid || !tag) {
      return NextResponse.json({ error: "Falta parámetro uid o tag" }, { status: 400 });
    }

    // Inserta la actividad en la tabla "actividades"
    const { error: insertError } = await supabase.from("actividades").insert([
      {
        uid: uid,
        tagid: tag.toLowerCase(), // asegurar minúsculas
        nombre: nombre || null,
        accion: accion || "lectura",
        fecha: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      mensaje: "✅ Actividad registrada correctamente",
      tagid: tag.toLowerCase(),
      fecha: new Date().toISOString(),
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
