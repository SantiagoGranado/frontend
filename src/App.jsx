import { useState } from "react";
import NavbarProgreso from "../components/NavbarProgreso";
import BuscarCitaSelector from "../components/BuscarCitaSelector";
import BuscarPorHospitalContainer from "../components/BuscarPorHospitalContainer";
import BuscarPorEspecialidadContainer from "../components/BuscarPorEspecialidadContainer";
import BuscarPorProfesionalContainer from "../components/BuscarPorProfesionalContainer";
import ResumenCitaYPagador from "../components/ResumenCitaYPagador";

// -------------------------------------------------
// Botón Volver (reutilizable)
// -------------------------------------------------
function BackButton({ onClick }) {
  return (
    // Contenedor sticky + centrado
    <div className="sticky top-0 z-20 px-4 py-2 flex justify-center">
      <button
        onClick={onClick}
        // Botón con degradado, sombras, esquinas redondeadas y efecto hover
        className="
        flex items-center gap-2
       bg-white
       text-black font-semibold
        px-5 py-3 rounded-full
        border-1 border-black
        shadow-lg
        transform transition
        cursor-pointer
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
        Volver
      </button>
    </div>
  );
}

// -------------------------------------------------
// Componente principal
// -------------------------------------------------
export default function App() {
  const [modo, setModo] = useState(null);
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState(null);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] =
    useState(null);
  const [especialidadSoloSeleccionada, setEspecialidadSoloSeleccionada] =
    useState(null);
  const [
    centroPorEspecialidadSeleccionado,
    setCentroPorEspecialidadSeleccionado,
  ] = useState(null);

  // ---- Estados para resumen y pagador ----
  const [resumenVisible, setResumenVisible] = useState(false);
  const [resumenData, setResumenData] = useState({});

  // Progreso visual
  let progreso = 0.12;
  if (modo === "hospital") {
    if (hospitalSeleccionado && especialidadSeleccionada) progreso = 0.99;
    else if (hospitalSeleccionado) progreso = 0.66;
    else progreso = 0.33;
  }
  if (modo === "especialidad") {
    if (especialidadSoloSeleccionada && centroPorEspecialidadSeleccionado)
      progreso = 0.99;
    else if (especialidadSoloSeleccionada) progreso = 0.66;
    else progreso = 0.33;
  }
  if (modo === "profesional") progreso = 0.66;

  const handleBack = () => {
    setModo(null);
    setHospitalSeleccionado(null);
    setEspecialidadSeleccionada(null);
    setEspecialidadSoloSeleccionada(null);
    setCentroPorEspecialidadSeleccionado(null);
  };

  // Si hay resumen, mostramos solo el resumen
  if (resumenVisible) {
    return (
      <ResumenCitaYPagador
        hospital={resumenData.hospital}
        especialidad={resumenData.especialidad}
        profesional={resumenData.profesional}
        onBack={() => setResumenVisible(false)}
        onPagadorSeleccionado={(pagador) => {
          setResumenVisible(false);
          alert(
            "¡Cita reservada!\n" +
              "Profesional: " +
              (resumenData.profesional?.nombre || "-") +
              "\n" +
              "Especialidad: " +
              (resumenData.especialidad?.nombre || "-") +
              "\n" +
              "Centro: " +
              (resumenData.hospital?.nombre || "-") +
              "\n" +
              "Aseguradora: " +
              (pagador?.INSURANCE_NAME || pagador)
          );
          handleBack();
        }}
      />
    );
  }

  return (
    <div style={{ background: "#fff" }} className="min-h-screen flex flex-col">
      <NavbarProgreso progreso={progreso} logo="/logo-synaptia.png" />
      <div className="flex-1 w-full flex flex-col">
        {/* Selección de modo */}
        {!modo && <BuscarCitaSelector onSelect={setModo} />}

        {/* --- FLUJO: BUSCAR POR HOSPITAL --- */}
        {modo === "hospital" && !hospitalSeleccionado && (
          <>
            <BackButton onClick={handleBack} />
            <BuscarPorHospitalContainer
              onHospitalSeleccionado={(hospital) => {
                setHospitalSeleccionado(hospital);
                setEspecialidadSeleccionada(null);
              }}
            />
          </>
        )}

        {modo === "hospital" &&
          hospitalSeleccionado &&
          !especialidadSeleccionada && (
            <>
              <BackButton onClick={() => setHospitalSeleccionado(null)} />
              <BuscarPorEspecialidadContainer
                hospital={hospitalSeleccionado}
                onEspecialidadSeleccionada={(esp) =>
                  setEspecialidadSeleccionada(esp)
                }
              />
            </>
          )}

        {modo === "hospital" &&
          hospitalSeleccionado &&
          especialidadSeleccionada && (
            <>
              <BackButton onClick={() => setEspecialidadSeleccionada(null)} />
              <BuscarPorProfesionalContainer
                hospital={hospitalSeleccionado}
                especialidad={especialidadSeleccionada}
                onProfesionalSeleccionado={(profesional) => {
                  setResumenData({
                    hospital: hospitalSeleccionado,
                    especialidad: especialidadSeleccionada,
                    profesional,
                  });
                  setResumenVisible(true);
                }}
              />
            </>
          )}

        {/* --- FLUJO: BUSCAR POR ESPECIALIDAD --- */}
        {modo === "especialidad" && !especialidadSoloSeleccionada && (
          <>
            <BackButton onClick={handleBack} />
            <BuscarPorEspecialidadContainer
              onEspecialidadSeleccionada={(esp) => {
                setEspecialidadSoloSeleccionada(esp);
                setCentroPorEspecialidadSeleccionado(null);
              }}
            />
          </>
        )}

        {modo === "especialidad" &&
          especialidadSoloSeleccionada &&
          !centroPorEspecialidadSeleccionado && (
            <>
              <BackButton
                onClick={() => setEspecialidadSoloSeleccionada(null)}
              />
              <BuscarPorHospitalContainer
                especialidad={especialidadSoloSeleccionada}
                onHospitalSeleccionado={(centro) =>
                  setCentroPorEspecialidadSeleccionado(centro)
                }
                soloConEspecialidad
              />
            </>
          )}

        {modo === "especialidad" &&
          especialidadSoloSeleccionada &&
          centroPorEspecialidadSeleccionado && (
            <>
              <BackButton
                onClick={() => setCentroPorEspecialidadSeleccionado(null)}
              />
              <BuscarPorProfesionalContainer
                hospital={centroPorEspecialidadSeleccionado}
                especialidad={especialidadSoloSeleccionada}
                onProfesionalSeleccionado={(profesional) => {
                  setResumenData({
                    hospital: centroPorEspecialidadSeleccionado,
                    especialidad: especialidadSoloSeleccionada,
                    profesional,
                  });
                  setResumenVisible(true);
                }}
              />
            </>
          )}

        {/* --- FLUJO: BUSCAR POR PROFESIONAL DIRECTO --- */}
        {modo === "profesional" && (
          <>
            <BackButton onClick={handleBack} />
            <BuscarPorProfesionalContainer
              onProfesionalSeleccionado={(profesional) => {
                setResumenData({
                  hospital: profesional?.hospital
                    ? { nombre: profesional.hospital }
                    : null,
                  especialidad: profesional?.especialidades?.[0] || null,
                  profesional,
                });
                setResumenVisible(true);
              }}
            />
          </>
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
              textDecoration: "underline",
            }}
            className="hover:opacity-80 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            formulario
          </a>
        </span>
      </div>
    </div>
  );
}
