import { NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig"; // Ajusta la ruta si usas otra
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Falta parámetro uid" }, { status: 400 });
  }

  try {
    const animalesRef = collection(db, "animales");
    const q = query(animalesRef, where("tagID", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: "Tag no registrado" }, { status: 404 });
    }

    const docSnap = snapshot.docs[0];
    const docRef = docSnap.ref;

    // Agregar fecha del escaneo al historial
    await updateDoc(docRef, {
      historialEscaneos: arrayUnion({ fecha: Timestamp.now() }),
    });

    return NextResponse.json({ mensaje: "Escaneo registrado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
