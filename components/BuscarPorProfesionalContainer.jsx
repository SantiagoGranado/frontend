import { useEffect, useState } from "react";

export default function BuscarPorProfesionalContainer({
  onProfesionalSeleccionado,
  hospital,
  especialidad
}) {
  const [profesionales, setProfesionales] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // ← Sólo modifica esta línea para apuntar a local o producción:
  let urlLocal    = "http://localhost:8080/api/profesionales";
  let urlHosteada = "https://node.host.hubdespachos.org/api/profesionales";
  let baseUrl     = urlLocal; 
  // let baseUrl  = urlHosteada;

  useEffect(() => {
    const controller = new AbortController();

    // Construimos la URL con URL/URLSearchParams para evitar concatenaciones manuales
    const urlObj = new URL(baseUrl);
    if (hospital?.id)     urlObj.searchParams.append("hospitalId",      hospital.id);
    if (especialidad?.id) urlObj.searchParams.append("especialidadId", especialidad.id);

    fetch(urlObj.toString(), { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        return res.json();
      })
      .then(setProfesionales)
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("No se pudo cargar la lista de profesionales");
        }
      });

    return () => controller.abort();
  }, [hospital, especialidad, baseUrl]);

  const profesionalesFiltrados = search.length > 1
    ? profesionales.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : profesionales;

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Buscar profesional
      </h2>
      <input
        className="w-full h-12 rounded-lg px-4 mb-6 border"
        style={{ background: "#fff", color: "#010031" }}
        type="text"
        placeholder="Escribe el nombre o apellidos"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

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
