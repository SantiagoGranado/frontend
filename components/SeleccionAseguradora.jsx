// src/components/SeleccionAseguradora.jsx
import { useEffect, useState, useMemo, useRef } from "react";

export default function SeleccionAseguradora({ aseguradoras, value, onChange }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Lista con "Pagador privado" al principio
  const listaConPrivado = useMemo(() => {
    const privado = { INSURANCE_LID: "", INSURANCE_NAME: "PAGADOR PRIVADO" };
    return [privado, ...(aseguradoras || [])];
  }, [aseguradoras]);

  // Mostrar el nombre del seleccionado en el input
  useEffect(() => {
    const selected =
      listaConPrivado.find((a) => a.INSURANCE_LID === (value ?? "")) || null;
    setSearch(selected ? selected.INSURANCE_NAME : "");
  }, [value, listaConPrivado]);

  // Selección por defecto: Pagador privado si no hay value
  useEffect(() => {
    if (value == null) onChange("");
  }, [value, onChange]);

  // Filtrar por texto
  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return listaConPrivado;
    return listaConPrivado.filter((a) =>
      a.INSURANCE_NAME.toLowerCase().includes(term)
    );
  }, [listaConPrivado, search]);

  // Cerrar al click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block mb-1 font-semibold text-[#010031]">
        Aseguradora
      </label>

      <input
        type="text"
        placeholder="Buscar o seleccionar aseguradora..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setSearch("");
          setOpen(true);
        }}
        onClick={() => {
          setSearch("");
          setOpen(true);
        }}
        className="
          w-full px-4 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-[#00ead6]/50
          cursor-text
        "
      />

      {open && (
        <ul
          className="
            absolute z-10 mt-1 w-full bg-white
            border border-gray-200 rounded-md shadow-lg
            max-h-60 overflow-y-auto
          "
        >
          {filtradas.length > 0 ? (
            filtradas.map((a) => {
              const selected = (value ?? "") === a.INSURANCE_LID;
              return (
                <li
                  key={`ins-${a.INSURANCE_LID || "privado"}`}
                  onClick={() => {
                    onChange(a.INSURANCE_LID); // "" => Pagador privado
                    setOpen(false);
                  }}
                  className={`
                    px-4 py-2 cursor-pointer
                    ${selected ? "bg-[#010031d7] text-white" : "hover:bg-[#00ead6]/20"}
                  `}
                >
                  {a.INSURANCE_NAME}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-gray-500">No se encontró ninguna.</li>
          )}
        </ul>
      )}
    </div>
  );
}
