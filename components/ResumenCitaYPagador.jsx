import { useState, useEffect } from "react";

/**
 * Props:
 * - hospital: {id, nombre, ...}
 * - profesional: {id, nombre, ...}
 * - especialidad: {id, nombre}
 * - onConfirmar: function(citaObj) // callback cuando confirma la cita
 * - onBack: function() // callback cuando se pulsa volver atrás
 */
export default function ResumenCitaYPagador({
  hospital,
  profesional,
  especialidad,
  onConfirmar,
  onBack
}) {
  const [aseguradoras, setAseguradoras] = useState([]);
  const [aseguradoraSeleccionada, setAseguradoraSeleccionada] = useState("");
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");
  const [horarios, setHorarios] = useState([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error, setError] = useState("");

  // Tipos de visita estáticos
  const tiposDeVisita = [
    { id: "46", nombre: "Primera visita", icono: "🏥" },
    { id: "47", nombre: "Revisión", icono: "🔄" },
    { id: "48", nombre: "Consulta online", icono: "💻" },
  ];

  // Carga aseguradoras al montar
  useEffect(() => {
    fetch("http://localhost:8080/api/insurances")
      .then((r) => r.json())
      .then((data) => setAseguradoras(data.filter((i) => i.WEB_ENABLED)))
      .catch(() => setError("No se pudieron cargar las aseguradoras"));
  }, []);

  // Reset al cambiar profesional o especialidad
  useEffect(() => {
    setActividadSeleccionada("");
    setAseguradoraSeleccionada("");
    setHorarios([]);
    setHorarioSeleccionado(null);
    setError("");
  }, [profesional, especialidad]);

  // Cuando elige aseguradora y tipo de visita, carga horarios
  useEffect(() => {
    if (!actividadSeleccionada || !aseguradoraSeleccionada) {
      setHorarios([]);
      setHorarioSeleccionado(null);
      setError("");
      return;
    }

    setLoadingHorarios(true);
    setError("");

    fetch("http://localhost:8080/api/availabilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        RESOURCE_LID: profesional.id,
        ACTIVITY_LID: actividadSeleccionada,
        ACTIVITY_GROUP_LID: especialidad.id,
        LOCATION_LID: hospital.id,
        AVA_START_TIME: "00:00",
        AVA_END_TIME: "23:59",
        AVA_MIN_TIME: "00:00",
        AVA_MAX_TIME: "23:59",
        AVA_RESULTS_NUMBER: 100,
        INSURANCE_LID: aseguradoraSeleccionada
      })
    })
      .then((r) => r.json())
      .then((data) => {
        setHorarios(data);
        setHorarioSeleccionado(null);
      })
      .catch(() => setError("No se pudieron obtener los horarios"))
      .finally(() => setLoadingHorarios(false));
  }, [
    actividadSeleccionada,
    aseguradoraSeleccionada,
    profesional,
    hospital,
    especialidad
  ]);

  // Función para volver atrás
  const handleBack = () => {
    onBack();
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Agrupar horarios por fecha
  const agruparHorariosPorFecha = (horarios) => {
    const grupos = {};
    horarios.forEach((horario) => {
      const fecha = horario.AVA_DATE;
      if (!grupos[fecha]) grupos[fecha] = [];
      grupos[fecha].push(horario);
    });
    return grupos;
  };

  const horariosPorFecha = agruparHorariosPorFecha(horarios);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
      {/* Botón de volver atrás */}
      <button
        onClick={handleBack}
        className="mb-4 text-sm text-blue-600 hover:underline focus:outline-none"
      >
        ← Volver atrás
      </button>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Programar tu cita
        </h2>
        <p className="text-gray-600">
          Completa los detalles para reservar tu cita médica
        </p>
      </div>

      {/* Resumen de la cita */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">
          📋 Resumen de tu cita
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Centro */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-semibold">🏥</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Centro</div>
              <div className="font-medium text-gray-800">
                {hospital?.nombre}
              </div>
            </div>
          </div>
          {/* Especialidad */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold">🩺</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Especialidad</div>
              <div className="font-medium text-gray-800">
                {especialidad?.nombre}
              </div>
            </div>
          </div>
          {/* Profesional */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-purple-600 font-semibold">👨‍⚕️</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Profesional</div>
              <div className="font-medium text-gray-800">
                {profesional?.nombre}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="space-y-6">
        {/* Tipo de visita */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700">
            Tipo de visita
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tiposDeVisita.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => {
                  setActividadSeleccionada(tipo.id);
                  setError("");
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  actividadSeleccionada === tipo.id
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{tipo.icono}</div>
                <div className="font-medium">{tipo.nombre}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Aseguradora */}
        <div>
          <label className="block mb-3 font-semibold text-gray-700">
            Selecciona tu aseguradora
          </label>
          <div className="relative">
            <select
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white"
              value={aseguradoraSeleccionada}
              onChange={(e) => {
                setAseguradoraSeleccionada(e.target.value);
                setError("");
              }}
            >
              <option value="">
                Elige tu aseguradora o forma de pago
              </option>
              {aseguradoras.map((a) => (
                <option key={a.INSURANCE_LID} value={a.INSURANCE_LID}>
                  {a.INSURANCE_NAME}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Horarios disponibles */}
        {actividadSeleccionada && aseguradoraSeleccionada && (
          <div>
            <label className="block mb-3 font-semibold text-gray-700">
              Selecciona fecha y hora
            </label>

            {loadingHorarios ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Cargando horarios disponibles...
                </span>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            ) : horarios.length ? (
              <div className="space-y-6">
                {Object.entries(horariosPorFecha).map(
                  ([fecha, horariosDelDia]) => (
                    <div
                      key={fecha}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-800 mb-3 capitalize">
                        {formatearFecha(fecha)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {horariosDelDia.map((horario, index) => (
                          <button
                            key={index}
                            onClick={() => setHorarioSeleccionado(horario)}
                            className={`p-2 text-sm rounded-md border transition-all duration-200 ${
                              horarioSeleccionado === horario
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {horario.AVA_START_TIME}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <div className="text-yellow-600 mb-2">⚠️</div>
                <div className="text-gray-700">
                  No hay horarios disponibles con esta aseguradora para este tipo
                  de visita.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botón de confirmación */}
        {horarioSeleccionado && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Confirmar cita:
              </h4>
              <div className="text-sm text-gray-600">
                <strong>Fecha:</strong>{" "}
                {formatearFecha(horarioSeleccionado.AVA_DATE)}
                <br />
                <strong>Hora:</strong> {horarioSeleccionado.AVA_START_TIME} -{" "}
                {horarioSeleccionado.AVA_END_TIME}
              </div>
            </div>
            <button
              onClick={() =>
                onConfirmar({
                  hospital,
                  especialidad,
                  profesional,
                  actividad: tiposDeVisita.find(
                    (a) => String(a.id) === String(actividadSeleccionada)
                  ),
                  aseguradora: aseguradoras.find(
                    (a) =>
                      String(a.INSURANCE_LID) ===
                      String(aseguradoraSeleccionada)
                  ),
                  horario: horarioSeleccionado
                })
              }
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirmar cita médica
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
