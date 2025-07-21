import { useEffect, useState } from "react";

export default function BuscarPorProfesionalContainer({
  onProfesionalSeleccionado,
  hospital,
  especialidad
}) {
  const [profesionales, setProfesionales] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Construye la URL con los IDs de filtros
    let url = "http://localhost:8080/api/profesionales";
    const params = [];
    if (hospital?.id) params.push("hospitalId=" + encodeURIComponent(hospital.id));
    if (especialidad?.id) params.push("especialidadId=" + encodeURIComponent(especialidad.id));
    if (params.length) url += "?" + params.join("&");

    fetch(url)
      .then(r => r.json())
      .then(data => setProfesionales(data))
      .catch(() => setError("No se pudo cargar la lista de profesionales"));
  }, [hospital, especialidad]);

  // Solo busca si tiene más de 1 letra
  const searchLower = search.toLowerCase();
  const profesionalesFiltrados = search.length > 1
    ? profesionales.filter(p => p.nombre.toLowerCase().includes(searchLower))
    : profesionales; // Muestra todos si no hay búsqueda

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Buscar profesional
      </h2>
      <input
        className="w-full h-12 rounded-lg px-4 mb-6"
        style={{ background: "#fff", border: "1px solid", color: "#010031" }}
        type="text"
        placeholder="Escribe el nombre o apellidos"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Resultado */}
      {error && <div className="text-red-600">{error}</div>}

      <div>
        {profesionalesFiltrados.length === 0 ? (
          <div className="mt-3 text-gray-500 text-center">
            No se ha encontrado ningún profesional.
          </div>
        ) : (
          <ul className="divide-y">
            {profesionalesFiltrados.map(p => (
              <li
                key={p.id}
                className="py-3 px-2 cursor-pointer hover:bg-gray-100 rounded transition"
                onClick={() => onProfesionalSeleccionado?.(p)}
              >
                <span className="font-medium">{p.nombre}</span>
                <span className="block text-xs opacity-60">
                  {p.hospital} — {p.provincia}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
