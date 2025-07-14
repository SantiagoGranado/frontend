import { useState } from "react";
import NavbarProgreso from "../components/NavbarProgreso";
import BuscarCitaSelector from "../components/BuscarCitaSelector";
import BuscarPorHospital from "../components/BuscarPorHospital";
import BuscarPorEspecialidad from "../components/BuscarPorEspecialidad";
import BuscarPorProfesional from "../components/BuscarPorProfesional";

// Datos de ejemplo para probar la UI
const provincias = [
  { id: "28", nombre: "Madrid" },
  { id: "08", nombre: "Barcelona" },
];
const hospitales = [
  { id: "1", nombre: "Clínica Quirón Madrid" },
  { id: "2", nombre: "Hospital General" },
];
const especialidades = [
  { id: "cardio", nombre: "Cardiología" },
  { id: "trauma", nombre: "Traumatología" },
];

export default function App() {
  const [modo, setModo] = useState(null);

  let progreso = 0.12;
  if (modo === "hospital") progreso = 0.33;
  if (modo === "especialidad") progreso = 0.66;
  if (modo === "profesional") progreso = 1;

  // Opcional: para volver atrás
  const handleBack = () => setModo(null);

  return (
    <div style={{ background: "#fff" }} className="min-h-screen flex flex-col">
      <NavbarProgreso progreso={progreso} logo="/logo-synaptia.png" />
      <div className="flex-1 w-full flex flex-col">
        {!modo && (
          <BuscarCitaSelector onSelect={setModo} />
        )}
        {modo === "hospital" && (
          <div>
            <BuscarPorHospital
              provincias={provincias}
              hospitales={hospitales}
              onProvincia={(provId) => console.log("Provincia seleccionada:", provId)}
              onHospital={(hosId) => console.log("Hospital seleccionado:", hosId)}
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
        {modo === "especialidad" && (
          <div>
            <BuscarPorEspecialidad
              especialidades={especialidades}
              onEspecialidad={(espId) => console.log("Especialidad seleccionada:", espId)}
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
        {modo === "profesional" && (
          <div>
            <BuscarPorProfesional
              onBuscar={(texto) => console.log("Búsqueda:", texto)}
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
      {/* Pie fijo abajo */}
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
