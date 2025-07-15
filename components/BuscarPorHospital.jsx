export default function BuscarPorHospital({
  provincias = [],
  hospitales = [],
  onProvincia,
  onHospital,
  provinciaId = "",
  hospitalId = "",
}) {
  // 👉 Añade esta línea: deduplicar hospitales por nombre
  const nombresMostrados = new Set();
  const hospitalesSinRepetir = hospitales.filter(h => {
    if (nombresMostrados.has(h.nombre)) return false;
    nombresMostrados.add(h.nombre);
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Provincia donde está el Hospital
      </h2>
      <select
        className="w-full h-12 rounded-lg px-4 mb-8"
        style={{
          background: "#fff",
          border: "1px solid",
          color: "#010031",
          fontWeight: 500,
        }}
        onChange={e => onProvincia?.(e.target.value)}
        value={provinciaId}
      >
        <option value="" disabled>Buscar una provincia</option>
        {provincias.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
      <h2 className="font-semibold text-lg mb-3" style={{ color: "#010031" }}>
        Selecciona o busca un Hospital o centro
      </h2>
      <select
        className="w-full h-12 rounded-lg px-4"
        style={{
          background: "#fff",
          border: "1px solid",
          color: "#010031",
          fontWeight: 500,
        }}
        onChange={e => onHospital?.(e.target.value)}
        value={hospitalId}
        disabled={!provinciaId || hospitalesSinRepetir.length === 0}
      >
        <option value="" disabled>Selecciona un Hospital o centro</option>
        {hospitalesSinRepetir.map((h) => (
          <option key={h.id} value={h.id}>{h.nombre}</option>
        ))}
      </select>
    </div>
  );
}
