// src/components/ResumenCitaYPagador.jsx

import { useEffect, useMemo, useState } from "react";
import SeleccionTipoVisita from "./SeleccionTipoVisita";
import SeleccionAseguradora from "./SeleccionAseguradora";
import SelectorHorarios from "./SelectorHorarios";
import FormularioDatosPaciente from "./FormularioDatosPaciente";
import ConfirmarCita from "./ConfirmarCita";

// Util: Formatea fechas como DD/MM/YYYY
const formatDDMMYYYY = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export default function ResumenCitaYPagador({
  hospital,
  profesional,
  especialidad,
  onBack,
}) {
  const [aseguradoras, setAseguradoras] = useState([]);
  const [aseguradoraSeleccionada, setAseguradoraSeleccionada] = useState(""); // "" = privado
  const [aseguradoraSeleccionadaNombre, setAseguradoraSeleccionadaNombre] = useState("Privado");
  const [actividadSeleccionada, setActividadSeleccionada] = useState(""); // id u objeto
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState("");
  const [formStep, setFormStep] = useState("seleccion");
  const [loadingCita, setLoadingCita] = useState(false);
  const [result, setResult] = useState("");

  const LIMITE_DIAS = 30;
  const url = "https://node.host.hubdespachos.org";
  //const url = "http://localhost:8080";

  // Carga aseguradoras
  useEffect(() => {
    fetch(`${url}/api/insurances`)
      .then((r) => r.json())
      .then((data) => setAseguradoras((Array.isArray(data) ? data : []).filter((i) => i.WEB_ENABLED)))
      .catch(() => setError("No se pudieron cargar las aseguradoras"));
  }, []);

  // Reset al cambiar profesional/especialidad
  useEffect(() => {
    setActividadSeleccionada("");
    setAseguradoraSeleccionada("");
    setAseguradoraSeleccionadaNombre("Privado");
    setHorarios([]);
    setHorarioSeleccionado(null);
    setError("");
    setFormStep("seleccion");
    setResult("");
  }, [profesional, especialidad]);

  // === Helpers: ID de actividad seleccionado ===
  const actividadId = useMemo(() => {
    if (actividadSeleccionada && typeof actividadSeleccionada === "object") {
      return actividadSeleccionada.ACTIVITY_LID ?? actividadSeleccionada.id ?? "";
    }
    return actividadSeleccionada || "";
  }, [actividadSeleccionada]);

  // Handler robusto para aseguradora (acepta id o objeto)
  const handleChangeAseguradora = (value) => {
    // value puede ser:
    // - string/number: INSURANCE_LID
    // - objeto: { INSURANCE_LID/ID, NAME/INSURANCE_NAME/... }
    let id = "";
    let nombre = "Privado";

    if (value && typeof value === "object") {
      id =
        value.INSURANCE_LID ??
        value.ID ??
        value.id ??
        "";
      nombre =
        value.INSURANCE_NAME ??
        value.NAME ??
        value.nombre ??
        value.label ??
        (id === "" ? "Privado" : "Aseguradora");
    } else {
      id = value ?? "";
      if (id === "") {
        nombre = "Privado";
      } else {
        // Buscar en lista por si tenemos el nombre
        const found =
          aseguradoras.find(
            (a) =>
              String(a.INSURANCE_LID ?? a.ID ?? a.id) === String(id)
          ) || null;
        nombre = found?.INSURANCE_NAME ?? found?.NAME ?? found?.nombre ?? "Aseguradora";
      }
    }

    setAseguradoraSeleccionada(id);
    setAseguradoraSeleccionadaNombre(nombre);
  };

  // Obtención de horarios (requiere ACTIVITY_LID e id de profesional)
  useEffect(() => {
    if (!actividadId || !profesional?.id) {
      setHorarios([]);
      return;
    }

    setLoadingHorarios(true);
    setError("");

    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + LIMITE_DIAS - 1);

    const payload = {
      RESOURCE_LID: profesional.id,
      ACTIVITY_LID: actividadId,
      ACTIVITY_GROUP_LID: especialidad.id,
      LOCATION_LID: profesional.hospitalId,
      INSURANCE_LID: aseguradoraSeleccionada, // "" = PAGADOR PRIVADO permitido
      AVA_START_DAY: formatDDMMYYYY(start),
      AVA_END_DAY: formatDDMMYYYY(end),
      AVA_START_TIME: "00:00",
      AVA_END_TIME: "23:59",
      AVA_MIN_TIME: "00:00",
      AVA_MAX_TIME: "23:59",
      AVA_RESULTS_NUMBER: 100,
    };

    fetch(`${url}/api/availabilities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setHorarios(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error cargando horarios:", err);
        setHorarios([]);
        setError(err.message);
      })
      .finally(() => setLoadingHorarios(false));
  }, [actividadId, aseguradoraSeleccionada, profesional, especialidad]);

  const handleConfirmar = () => setFormStep("paciente");

  async function handleSubmitPaciente(datos) {
    setLoadingCita(true);
    setError("");
    try {
      const payload = {
        RESOURCE_LID: profesional.id,
        ACTIVITY_LID: actividadId,
        ACTIVITY_GROUP_LID: especialidad.id,
        ACTIVITY_GROUP_NAME: especialidad.nombre, // nombre legible de la especialidad
        SPECIALTY_NAME: especialidad.nombre,      // redundante a propósito (el backend lo prioriza)
        LOCATION_LID: profesional.hospitalId,
        APP_DATE: horarioSeleccionado.AVA_DATE,
        APP_START_TIME: horarioSeleccionado.AVA_START_TIME,
        APP_END_TIME: horarioSeleccionado.AVA_END_TIME,
        INSURANCE_LID: aseguradoraSeleccionada,          // ID de la aseguradora ("" = Privado)
        INSURANCE_NAME: aseguradoraSeleccionadaNombre,   // texto legible de la aseguradora
        ...datos, // nombre, apellidos, email, teléfono, DNI, género, fecha de nacimiento...
      };

      const res = await fetch(`${url}/api/appointments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setFormStep("exito");
        setResult("¡Cita reservada correctamente!");
      } else {
        setError(data.error || data.message || "No se pudo reservar la cita.");
      }
    } catch (e) {
      console.error("Error creando cita:", e);
      setError("Error de red o servidor");
    } finally {
      setLoadingCita(false);
    }
  }

  // Mostrar SOLO el botón de confirmar cuando haya hora elegida
  const readyToConfirm =
    Boolean(actividadId) &&
    aseguradoraSeleccionada !== null &&
    aseguradoraSeleccionada !== undefined &&
    Boolean(horarioSeleccionado) &&
    !loadingHorarios;

  // === UI ===

  // Éxito
  if (formStep === "exito") {
    return (
      <div className="w-full px-4 sm:px-6 py-8 bg-gradient-to-b from-zinc-50 to-white">
        <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-700 tracking-tight">
            ¡Cita reservada! ✔️
          </h2>
          <p className="mt-2 text-zinc-600">Recibirás un email de confirmación.</p>
          <button
            onClick={onBack}
            className="mt-6 w-full rounded-xl bg-[#00f1dd] px-4 py-3 text-[#010031] font-medium shadow-sm hover:bg-[#00e6d2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f1dd]"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8 bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-5xl">
        {/* Card contenedor */}
        <div className="rounded-2xl border border-zinc-200 bg-white/70 backdrop-blur shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
                Nueva cita
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                Programar cita
              </h2>
            </div>

            <button
              onClick={onBack}
              className="inline-flex items-center cursor-pointer rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-slate-700 text-sm font-medium shadow-sm hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00f1dd]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>

          <p className="px-4 sm:px-6 mt-2 text-zinc-600">
            Completa los detalles para reservar tu cita.
          </p>

          {/* Layout: 1 col móvil / 2 cols desktop */}
          <div className="px-4 sm:px-6 pb-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Col izquierda: Resumen básico */}
            <aside className="md:col-span-1">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 md:sticky md:top-4">
                <h3 className="text-base font-semibold text-slate-800 mb-3">Resumen</h3>
                <dl className="space-y-2 text-sm text-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Centro</dt>
                    <dd className="font-medium text-slate-800 text-right">{hospital.nombre}</dd>
                  </div>
                  
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Profesional</dt>
                    <dd className="font-medium text-slate-800 text-right">{profesional.nombre}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-500">Aseguradora</dt>
                    <dd className="font-medium text-slate-800 text-right">
                      {aseguradoraSeleccionada === "" ? "Privado" : aseguradoraSeleccionadaNombre}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>

            {/* Col derecha: Flujo */}
            <section className="md:col-span-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
                {formStep === "seleccion" && (
                  <div className="space-y-5">
                    <SeleccionTipoVisita
                      profesional={profesional}
                      especialidad={especialidad}
                      value={actividadSeleccionada}
                      onChange={setActividadSeleccionada} // pasa ACTIVITY_LID o objeto
                    />

                    <SeleccionAseguradora
                      aseguradoras={aseguradoras}
                      value={aseguradoraSeleccionada}
                      onChange={handleChangeAseguradora} // resuelve ID + nombre
                    />

                    <div className="rounded-lg border border-dashed border-zinc-200 p-3 sm:p-4">
                      <SelectorHorarios
                        loading={loadingHorarios}
                        horarios={horarios}
                        selected={horarioSeleccionado}
                        onSelect={setHorarioSeleccionado}
                        showNoHoursMessage={true}
                      />
                    </div>

                    {/* Solo botón de confirmar, visible al elegir una hora */}
                    {horarioSeleccionado && (
                      <ConfirmarCita
                        onConfirm={handleConfirmar}
                        disabled={!readyToConfirm}
                      />
                    )}
                  </div>
                )}

                {formStep === "paciente" && (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-800">
                      Datos del paciente
                    </h3>
                    <FormularioDatosPaciente
                      onSubmit={handleSubmitPaciente}
                      loading={loadingCita}
                    />
                  </div>
                )}

                {(error || result) && (
                  <div
                    className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
                      error
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {error || result}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
