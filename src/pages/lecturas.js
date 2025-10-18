import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

export default function Lecturas() {
  const user = useAuth();
  const [lecturas, setLecturas] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "historialEscaneos"), orderBy("fechaHora", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLecturas(lista);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Historial de Escaneos</h1>
      <table border={1} cellPadding={5} cellSpacing={0} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tag RFID</th>
            <th>Fecha y Hora</th>
            <th>Lector</th>
          </tr>
        </thead>
        <tbody>
          {lecturas.map(l => (
            <tr key={l.id}>
              <td>{l.tagID}</td>
              <td>{l.fechaHora?.toDate().toLocaleString() || "Sin fecha"}</td>
              <td>{l.lector || "Desconocido"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
