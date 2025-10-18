// Ejemplo simple dentro de un componente React que muestra un animal y su historial
export default function AnimalDetalle({ animal }) {
  return (
    <div>
      <h2>{animal.nombre}</h2>
      <h3>Historial de Escaneos:</h3>

      {/* Para depurar qué llega exactamente */}
      <pre>{JSON.stringify(animal.historialEscaneos, null, 2)}</pre>

      {animal.historialEscaneos?.length === 0 && <p>No hay escaneos registrados</p>}

      {animal.historialEscaneos?.map((item, index) => {
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
