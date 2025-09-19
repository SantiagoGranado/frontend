import { useState, useEffect } from "react";

export default function BuscarPorProfesional({ onSeleccionar }) {
  const [busqueda, setBusqueda] = useState("");
  const [profesionales, setProfesionales] = useState([]);
  const [resultados, setResultados] = useState([]);

  // ← Aquí solo cambias cuál de las dos quieres usar:
  //let urlLocal    = "http://localhost:8080";
  let urlHosteada = "https://node.host.hubdespachos.org";

  // Cargar todos los profesionales al iniciar
  useEffect(() => {
    fetch(urlHosteada+"/api/profesionales")
      .then(res => res.json())
      .then(data => setProfesionales(data));
  }, []);

  // Filtrar cuando el usuario escribe
  useEffect(() => {
    if (busqueda.length >= 2) {
      const value = busqueda.toLowerCase();
      setResultados(
        profesionales.filter(p =>
          p.nombre.toLowerCase().includes(value)
        )
      );
    } else {
      setResultados([]);
    }
  }, [busqueda, profesionales]);

  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Buscar profesional
      </h2>
      <input
        className="w-full h-12 rounded-lg px-4 mb-5"
        style={{
          background: "#fff",
          border: "1px solid #010031",
          color: "#010031",
          fontWeight: 500,
        }}
        placeholder="Escribe el nombre o apellidos"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />
      <div>
        {busqueda.length >= 2 && (
          resultados.length === 0
            ? <div className="text-center text-red-600 py-2">No se ha encontrado ningún profesional.</div>
            : (
              <ul className="divide-y divide-gray-200 mt-2 rounded border">
                {resultados.map(p => (
                  <li
                    key={p.id}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                    onClick={() => onSeleccionar?.(p)}
                  >
                    <span className="font-medium">{p.nombre}</span>
                    <span className="block text-xs text-gray-500">{p.hospital} - {p.provincia}</span>
                  </li>
                ))}
              </ul>
            )
        )}
      </div>
    </div>
  );
}
