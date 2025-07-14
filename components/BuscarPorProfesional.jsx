import { useState } from "react";

export default function BuscarPorProfesional({ onBuscar }) {
  const [busqueda, setBusqueda] = useState("");
  return (
    <div className="w-full max-w-md mx-auto mt-6 px-2">
      <h2 className="font-semibold text-lg mb-4" style={{ color: "#010031" }}>
        Selecciona o busca un profesional
      </h2>
      <div className="relative">
        <input
          className="w-full h-12 rounded-lg px-4 pr-12"
          style={{
            background: "#fff",
            border: "1px solid #010031",
            color: "#010031",
            fontWeight: 500,
          }}
          placeholder="Escribe el nombre de un profesional"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button
          className="absolute top-0 right-0 h-12 px-4 flex items-center"
          style={{ color: "#010031" }}
          onClick={() => onBuscar?.(busqueda)}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
