import { useEffect, useState } from "react";
import BuscarPorHospital from "./BuscarPorHospital";

export default function BuscarPorHospitalContainer({ onHospitalSeleccionado }) {
  const [provincias, setProvincias] = useState([]);
  const [provinciaId, setProvinciaId] = useState("");
  const [hospitales, setHospitales] = useState([]);
  const [hospitalId, setHospitalId] = useState("");
  const [error, setError] = useState("");

  // ← Aquí solo cambias cuál de las dos quieres usar:
  let urlLocal    = "http://localhost:8080";
  let urlHosteada = "https://node.host.hubdespachos.org";
  let baseUrl     = urlLocal; 
  // let baseUrl  = urlHosteada;

  // Carga provincias al montar
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${baseUrl}/api/provincias`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setProvincias)
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("No se pudieron cargar las provincias");
        }
      });
    return () => controller.abort();
  }, [baseUrl]);

  // Carga hospitales al cambiar provincia
  useEffect(() => {
    if (!provinciaId) {
      setHospitales([]);
      setHospitalId("");
      return;
    }
    const controller = new AbortController();
    // obtenemos el nombre de la provincia seleccionada
    const provincia = provincias
      .find(p => p.id.toString() === provinciaId)
      ?.nombre;
    // construimos URL con URLSearchParams
    const urlObj = new URL(`${baseUrl}/api/hospitales`);
    if (provincia) urlObj.searchParams.append("provincia", provincia);

    fetch(urlObj.toString(), { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setHospitales)
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("No se pudieron cargar los Centros");
        }
      });

    setHospitalId(""); // resetea selección anterior
    return () => controller.abort();
  }, [provinciaId, provincias, baseUrl]);

  // Notifica al padre el hospital seleccionado
  useEffect(() => {
    if (hospitalId && onHospitalSeleccionado) {
      const seleccionado = hospitales.find(h => h.id.toString() === hospitalId);
      onHospitalSeleccionado(seleccionado);
    }
  }, [hospitalId, hospitales, onHospitalSeleccionado]);

  return (
    <div>
      {error && <div className="text-red-600">{error}</div>}
      <BuscarPorHospital
        provincias={provincias}
        hospitales={hospitales}
        provinciaId={provinciaId}
        hospitalId={hospitalId}
        onProvincia={setProvinciaId}
        onHospital={setHospitalId}
      />
    </div>
  );
}
