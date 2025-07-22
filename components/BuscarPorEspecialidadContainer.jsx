import { useEffect, useState } from "react";

// Recibe hospital (opcional), onEspecialidadSeleccionada
export default function BuscarPorEspecialidadContainer({ hospital, onEspecialidadSeleccionada }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState("");

  useEffect(() => {
    let url = "https://node.host.hubdespachos.org/api/especialidades";
    if (hospital?.resourceId) {
      url += `?hospitalId=${hospital.resourceId}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(setEspecialidades);
    setEspecialidadId("");
  }, [hospital]);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Selecciona especialidad
      </h2>
      <select
        className="w-full h-12 rounded-lg px-4"
        style={{ background: "#fff", border: "1px solid", color: "#010031" }}
        value={especialidadId}
        onChange={e => {
          setEspecialidadId(e.target.value);
          const especialidad = especialidades.find(es => es.id.toString() === e.target.value);
          if (especialidad) onEspecialidadSeleccionada?.(especialidad);
        }}
      >
        <option value="" disabled>Selecciona una especialidad</option>
        {especialidades.map(es => (
          <option key={es.id} value={es.id}>{es.nombre}</option>
        ))}
      </select>
    </div>
  );
}
