// src/components/SeleccionTipoVisita.jsx

import { useEffect, useState, useMemo } from "react";

export default function SeleccionTipoVisita({
  profesional,
  especialidad,
  value,           // puede ser id o objeto { ACTIVITY_LID, ACTIVITY_NAME, ... }
  onChange,        // callback(id) -> se mantiene para no romper tu código
  onChangeName,    // NUEVO: callback(nombre)
  onChangeObj,     // NUEVO: callback(objeto completo)
}) {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Normaliza el valor seleccionado a ID (para comparaciones)
  const selectedId = useMemo(() => {
    if (value && typeof value === "object") {
      return value.ACTIVITY_LID ?? value.id ?? "";
    }
    return value ?? "";
  }, [value]);

  // Carga tipos de visita al cambiar profesional/especialidad
  useEffect(() => {
    if (!especialidad?.id || !profesional?.id) return;
    setLoading(true);
    fetch(
      `http://localhost:8080/api/activities/byResourceAndGroup` + //https://node.host.hubdespachos.org/api/activities/byResourceAndGroup
        `?resourceLid=${profesional.id}&groupLid=${especialidad.id}`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTipos(list);

        // Autoselección si no hay valor actual
        if (list.length > 0 && !selectedId) {
          const first = list[0];
          onChange?.(first.ACTIVITY_LID);      // id (compatibilidad)
          onChangeName?.(first.ACTIVITY_NAME); // nombre
          onChangeObj?.(first);                // objeto completo
        }
      })
      .catch((err) => {
        console.error("Error al obtener tipos de visita:", err);
        setTipos([]);
      })
      .finally(() => setLoading(false));
  }, [especialidad, profesional, onChange, onChangeName, onChangeObj, selectedId]);

  if (loading) {
    return <p className="text-sm text-gray-500">Cargando tipos de visita…</p>;
  }

  const handleSelect = (t) => {
    onChange?.(t.ACTIVITY_LID);      // id
    onChangeName?.(t.ACTIVITY_NAME); // nombre
    onChangeObj?.(t);                // objeto
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold text-[#010031]">
        Tipo de visita
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tipos.map((t) => {
          const selected = String(t.ACTIVITY_LID) === String(selectedId);
          return (
            <button
              key={t.ACTIVITY_LID}
              onClick={() => handleSelect(t)}
              className={`
                flex items-center justify-center
                p-4
                border rounded-lg
                text-center font-medium
                transition
                cursor-pointer
                ${selected
                  ? "bg-[#00f1dd] border-[#010031] text-[#010031]"
                  : "bg-white border-gray-200 text-[#010031]"}
              `}
            >
              {t.ACTIVITY_NAME}
            </button>
          );
        })}
      </div>
    </div>
  );
}
