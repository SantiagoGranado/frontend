import { useEffect, useState } from "react";

export default function BuscarPorEspecialidadContainer({ hospital, onEspecialidadSeleccionada }) {
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadId, setEspecialidadId] = useState("");
  const [loading, setLoading] = useState(true); // 👈 nuevo

  useEffect(() => {
    setLoading(true); // 👈 inicia carga
    let urlHosteada = "https://node.host.hubdespachos.org/api/especialidades";
    let url = "http://localhost:8080/api/especialidades";

    if (hospital?.resourceId) {
      url += `?hospitalId=${hospital.resourceId}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setEspecialidades(data);
        setLoading(false); // 👈 fin carga
      })
      .catch(() => {
        setLoading(false); // 👈 fin carga en error
      });

    setEspecialidadId("");
  }, [hospital]);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Selecciona especialidad
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#010031]" />
        </div>
      ) : (
        <select
          className="w-full h-12 rounded-lg px-4"
          style={{ background: "#fff", border: "1px solid", color: "#010031" }}
          value={especialidadId}
          onChange={e => {
            setEspecialidadId(e.target.value);
            const especialidad = especialidades.find(
              es => es.id.toString() === e.target.value
            );
            if (especialidad) onEspecialidadSeleccionada?.(especialidad);
          }}
        >
          <option value="" disabled>Selecciona una especialidad</option>
          {especialidades.map(es => (
            <option key={es.id} value={es.id}>{es.nombre}</option>
          ))}
        </select>
      )}
    </div>
  );
}