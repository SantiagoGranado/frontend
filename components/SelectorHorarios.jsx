// src/components/SelectorHorarios.jsx

import { useState, useEffect, useMemo } from "react";

export default function SelectorHorarios({
  loading,
  horarios,
  selected,
  onSelect,
  showNoHoursMessage = true,
}) {
  const [contador, setContador] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  const formatDate = (str) => {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}`).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const toISODate = (str) => {
    const [d, m, y] = str.split("/");
    return `${y}-${m}-${d}`;
  };

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };

  // Para detectar la primera carga sin horarios
  useEffect(() => {
    if (!loading && Array.isArray(horarios) && horarios.length === 0) {
      setContador((c) => c + 1);
    }
  }, [loading, horarios]);

  // Agrupa y ordena por fecha (asc) y por hora (asc)
  const groupedSorted = useMemo(() => {
    if (!Array.isArray(horarios)) return [];
    const map = horarios.reduce((acc, slot) => {
      (acc[slot.AVA_DATE] ||= []).push(slot);
      return acc;
    }, {});
    const dates = Object.keys(map).sort(
      (a, b) => new Date(toISODate(a)) - new Date(toISODate(b))
    );
    return dates.map((date) => ({
      date,
      slots: map[date]
        .slice()
        .sort((a, b) => toMinutes(a.AVA_START_TIME) - toMinutes(b.AVA_START_TIME)),
    }));
  }, [horarios]);

  // Cuando cambian los horarios, resetea al primer día
  useEffect(() => {
    setCurrentIdx(0);
  }, [horarios?.length]);

  // Si hay un slot seleccionado, muévete automáticamente a su día
  useEffect(() => {
    if (!selected || groupedSorted.length === 0) return;
    const idx = groupedSorted.findIndex((g) => g.date === selected.AVA_DATE);
    if (idx >= 0) setCurrentIdx(idx);
  }, [selected, groupedSorted]);

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div
          className="h-10 w-10 rounded-full border-4 border-slate-300 border-t-[#00f1dd] animate-spin"
          role="status"
          aria-label="Cargando horarios"
        />
      </div>
    );
  }

  // Sin horarios
  if (
    !loading &&
    Array.isArray(horarios) &&
    horarios.length === 0 &&
    contador > 0 &&
    showNoHoursMessage
  ) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-700 px-4 py-5 text-center">
        <p className="font-semibold">No hay horas disponibles</p>
        <p className="text-sm mt-1">
          Prueba cambiando la <span className="font-medium">aseguradora</span> o el{" "}
          <span className="font-medium">tipo de visita</span>.
        </p>
      </div>
    );
  }

  // Si no hay grupos (p.ej. aún no se han pedido horarios)
  if (groupedSorted.length === 0) {
    return null;
  }

  const totalDias = groupedSorted.length;
  const safeIdx = Math.min(Math.max(currentIdx, 0), totalDias - 1);
  const { date, slots } = groupedSorted[safeIdx];

  const goPrev = () => setCurrentIdx((i) => Math.max(i - 1, 0));
  const goNext = () => setCurrentIdx((i) => Math.min(i + 1, totalDias - 1));

  return (
    <div
      className="space-y-4"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }}
      aria-label="Navegación de días disponibles"
    >
      {/* Barra de navegación por días */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={safeIdx === 0}
          className={`cursor-pointer inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f1dd]
            ${safeIdx === 0 ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-300" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
          aria-label="Día anterior"
        >
          ←
        </button>

        <div className="text-center">
          <h4 className="text-slate-800 font-semibold capitalize">
            {formatDate(date)}
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Día {safeIdx + 1} de {totalDias}
          </p>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={safeIdx === totalDias - 1}
          className={`cursor-pointer inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f1dd]
            ${safeIdx === totalDias - 1 ? "opacity-40 cursor-not-allowed border-slate-200 text-slate-300" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
          aria-label="Día siguiente"
        >
          →
        </button>
      </div>

      {/* Slots del día actual */}
      <section
        className="rounded-xl border border-zinc-200 bg-white p-4"
        aria-labelledby={`horarios-${date}`}
      >
        <h5 id={`horarios-${date}`} className="sr-only">
          {formatDate(date)}
        </h5>

        {slots.length === 0 ? (
          <div className="text-center text-slate-600 py-6">
            No hay horarios para este día.
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            role="radiogroup"
            aria-label={`Horarios para ${formatDate(date)}`}
          >
            {slots.map((slot, idx) => {
              const isSelected = selected === slot;
              const key = `${slot.AVA_DATE}-${slot.AVA_START_TIME}-${idx}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelect(slot)}
                  role="radio"
                  aria-checked={isSelected}
                  className={[
                    "w-full select-none rounded-lg border px-3 py-2.5 text-sm font-medium transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f1dd] cursor-pointer",
                    isSelected
                      ? "bg-[#00f1dd] text-slate-900 border-[#00f1dd] shadow"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {slot.AVA_START_TIME}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
