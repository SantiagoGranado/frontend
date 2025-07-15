import { useState } from "react";
import NavbarProgreso from "../components/NavbarProgreso";
import BuscarCitaSelector from "../components/BuscarCitaSelector";
import BuscarPorHospitalContainer from "../components/BuscarPorHospitalContainer";
import BuscarPorEspecialidadContainer from "../components/BuscarPorEspecialidadContainer";
import BuscarPorProfesionalContainer from "../components/BuscarPorProfesionalContainer"; // <- ¡AÑADIDO!

export default function App() {
  const [modo, setModo] = useState(null);
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState(null);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);

  let progreso = 0.12;
  if (modo === "hospital") progreso = hospitalSeleccionado ? 0.66 : 0.33;
  if (modo === "especialidad") progreso = 0.66;
  if (modo === "profesional") progreso = 0.66; // Si quieres barra para profesional

  const handleBack = () => {
    setModo(null);
    setHospitalSeleccionado(null);
    setEspecialidadSeleccionada(null);
  };

  return (
    <div style={{ background: "#fff" }} className="min-h-screen flex flex-col">
      <NavbarProgreso progreso={progreso} logo="/logo-synaptia.png" />
      <div className="flex-1 w-full flex flex-col">

        {/* Pantalla de inicio: Selecciona modo */}
        {!modo && (
          <BuscarCitaSelector onSelect={setModo} />
        )}

        {/* Buscar por hospital (flujo hospital → especialidad) */}
        {modo === "hospital" && !hospitalSeleccionado && (
          <div>
            <BuscarPorHospitalContainer
              onHospitalSeleccionado={hospital => {
                setHospitalSeleccionado(hospital);
                // Avanza automáticamente a elegir especialidad
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={handleBack}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {modo === "hospital" && hospitalSeleccionado && (
          <div>
            <BuscarPorEspecialidadContainer
              hospital={hospitalSeleccionado}
              onEspecialidadSeleccionada={esp => {
                setEspecialidadSeleccionada(esp);
                alert("Has seleccionado: " + (esp?.nombre || ""));
                // Aquí podrías avanzar al siguiente paso, como elegir profesional
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={() => setHospitalSeleccionado(null)}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* Buscar por especialidad directamente */}
        {modo === "especialidad" && (
          <div>
            <BuscarPorEspecialidadContainer
              onEspecialidadSeleccionada={esp => {
                setEspecialidadSeleccionada(esp);
                alert("Has seleccionado: " + (esp?.nombre || ""));
                // Aquí podrías avanzar a mostrar hospitales/profesionales de esa especialidad
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={handleBack}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* Buscar por profesional directamente */}
        {modo === "profesional" && (
          <div>
            <BuscarPorProfesionalContainer
              onProfesionalSeleccionado={profesional => {
                alert("Has seleccionado: " + (profesional?.nombre || ""));
                // Aquí podrías avanzar a mostrar agenda o lo que sea
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={handleBack}
              >
                Volver
              </button>
            </div>
          </div>
        )}

      </div>
      <div className="w-full flex justify-center mt-auto pb-8">
        <span className="text-center text-sm" style={{ color: "#010031" }}>
          Si necesitas ayuda para pedir cita contáctanos en este{" "}
          <a
            href="https://synaptia.clinic/agenda-online/"
            style={{
              color: "#010031",
              fontWeight: 600,
              textDecoration: "underline"
            }}
            className="hover:opacity-80 transition"
          >
            formulario
          </a>
        </span>
      </div>
    </div>
  );
}
