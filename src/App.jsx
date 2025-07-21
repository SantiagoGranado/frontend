import { useState } from "react";
import NavbarProgreso from "../components/NavbarProgreso";
import BuscarCitaSelector from "../components/BuscarCitaSelector";
import BuscarPorHospitalContainer from "../components/BuscarPorHospitalContainer";
import BuscarPorEspecialidadContainer from "../components/BuscarPorEspecialidadContainer";
import BuscarPorProfesionalContainer from "../components/BuscarPorProfesionalContainer";
import ResumenCitaYPagador from "../components/ResumenCitaYPagador";

export default function App() {
  const [modo, setModo] = useState(null);
  const [hospitalSeleccionado, setHospitalSeleccionado] = useState(null);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState(null);
  const [especialidadSoloSeleccionada, setEspecialidadSoloSeleccionada] = useState(null);
  const [centroPorEspecialidadSeleccionado, setCentroPorEspecialidadSeleccionado] = useState(null);

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
    if (especialidadSoloSeleccionada && centroPorEspecialidadSeleccionado) progreso = 0.99;
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
        onPagadorSeleccionado={pagador => {
          setResumenVisible(false);
          // Aquí procesa la cita, por ejemplo puedes hacer fetch/post...
          alert(
            "¡Cita reservada!\n" +
            "Profesional: " + (resumenData.profesional?.nombre || "-") + "\n" +
            "Especialidad: " + (resumenData.especialidad?.nombre || "-") + "\n" +
            "Centro: " + (resumenData.hospital?.nombre || "-") + "\n" +
            "Aseguradora: " + (pagador?.INSURANCE_NAME || pagador)
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
        {!modo && (
          <BuscarCitaSelector onSelect={setModo} />
        )}

        {/* --- FLUJO: BUSCAR POR HOSPITAL --- */}
        {modo === "hospital" && !hospitalSeleccionado && (
          <div>
            <BuscarPorHospitalContainer
              onHospitalSeleccionado={hospital => {
                setHospitalSeleccionado(hospital);
                setEspecialidadSeleccionada(null);
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

        {modo === "hospital" && hospitalSeleccionado && !especialidadSeleccionada && (
          <div>
            <BuscarPorEspecialidadContainer
              hospital={hospitalSeleccionado}
              onEspecialidadSeleccionada={esp => setEspecialidadSeleccionada(esp)}
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

        {modo === "hospital" && hospitalSeleccionado && especialidadSeleccionada && (
          <div>
            <BuscarPorProfesionalContainer
              hospital={hospitalSeleccionado}
              especialidad={especialidadSeleccionada}
              onProfesionalSeleccionado={profesional => {
                setResumenData({
                  hospital: hospitalSeleccionado,
                  especialidad: especialidadSeleccionada,
                  profesional
                });
                setResumenVisible(true);
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={() => setEspecialidadSeleccionada(null)}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* --- FLUJO: BUSCAR POR ESPECIALIDAD --- */}
        {modo === "especialidad" && !especialidadSoloSeleccionada && (
          <div>
            <BuscarPorEspecialidadContainer
              onEspecialidadSeleccionada={esp => {
                setEspecialidadSoloSeleccionada(esp);
                setCentroPorEspecialidadSeleccionado(null);
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

        {modo === "especialidad" && especialidadSoloSeleccionada && !centroPorEspecialidadSeleccionado && (
          <div>
            <BuscarPorHospitalContainer
              especialidad={especialidadSoloSeleccionada}
              onHospitalSeleccionado={centro => setCentroPorEspecialidadSeleccionado(centro)}
              soloConEspecialidad
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={() => setEspecialidadSoloSeleccionada(null)}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {modo === "especialidad" && especialidadSoloSeleccionada && centroPorEspecialidadSeleccionado && (
          <div>
            <BuscarPorProfesionalContainer
              hospital={centroPorEspecialidadSeleccionado}
              especialidad={especialidadSoloSeleccionada}
              onProfesionalSeleccionado={profesional => {
                setResumenData({
                  hospital: centroPorEspecialidadSeleccionado,
                  especialidad: especialidadSoloSeleccionada,
                  profesional
                });
                setResumenVisible(true);
              }}
            />
            <div className="flex justify-center mt-10 cursor-pointer">
              <button
                style={{ color: "#010031", textDecoration: "underline" }}
                onClick={() => setCentroPorEspecialidadSeleccionado(null)}
              >
                Volver
              </button>
            </div>
          </div>
        )}

        {/* --- FLUJO: BUSCAR POR PROFESIONAL DIRECTO --- */}
        {modo === "profesional" && (
          <div>
            <BuscarPorProfesionalContainer
              onProfesionalSeleccionado={profesional => {
                setResumenData({
                  hospital: profesional?.hospital ? { nombre: profesional.hospital } : null,
                  especialidad: profesional?.especialidades?.[0] || null,
                  profesional
                });
                setResumenVisible(true);
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
