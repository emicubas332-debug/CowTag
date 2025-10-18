export default function AnimalDetalle({ animal }) {
  // Manejo si animal es undefined
  if (!animal) {
    return <p>Animal no encontrado</p>;
  }

  const historial = animal.historialEscaneos || [];

  return (
    <div>
      <h2>{animal.nombre || "Nombre no disponible"}</h2>
      <h3>Historial de Escaneos:</h3>

      {/* Depuración */}
      <pre>{JSON.stringify(historial, null, 2)}</pre>

      {historial.length === 0 && <p>No hay escaneos registrados</p>}

      {historial.map((item, index) => {
        let fecha;
        if (item.fecha?.toDate) {
          fecha = item.fecha.toDate();
        } else {
          fecha = new Date(item.fecha);
        }

        return (
          <p key={index}>
            {isNaN(fecha.getTime()) ? "Fecha inválida" : fecha.toLocaleString()}
          </p>
        );
      })}
    </div>
  );
}
