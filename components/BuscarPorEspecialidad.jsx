export default function BuscarPorEspecialidad({
  especialidades = [],
  onEspecialidad,
  especialidadId = "",
}) {
  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Especialidades
      </h2>
      <select
        className="w-full h-12 rounded-lg px-4"
        style={{
          background: "#fff",
          border: "1px solid #010031",
          color: "#010031",
          fontWeight: 500,
        }}
        onChange={e => onEspecialidad?.(e.target.value)}
        value={especialidadId}
      >
        <option value="" disabled>
          Selecciona una especialidad
        </option>
        {especialidades.map((e) => (
          <option key={e.id} value={e.id}>
            {e.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
