import { useEffect, useState } from "react";
import BuscarPorHospital from "./BuscarPorHospital";

export default function BuscarPorHospitalContainer({ onHospitalSeleccionado }) {
  const [provincias, setProvincias] = useState([]);
  const [provinciaId, setProvinciaId] = useState("");
  const [hospitales, setHospitales] = useState([]);
  const [hospitalId, setHospitalId] = useState("");

  // Cargar provincias al montar
  useEffect(() => {
    fetch("http://localhost:8080/api/provincias")
      .then(res => res.json())
      .then(setProvincias);
  }, []);

  // Cargar hospitales al cambiar provincia
  useEffect(() => {
    if (provinciaId) {
      const provinciaSeleccionada = provincias.find(p => p.id.toString() === provinciaId)?.nombre;
      fetch(`http://localhost:8080/api/hospitales?provincia=${encodeURIComponent(provinciaSeleccionada)}`)
        .then(res => res.json())
        .then(setHospitales);
      setHospitalId(""); // Reset hospital al cambiar provincia
    } else {
      setHospitales([]);
      setHospitalId("");
    }
  }, [provinciaId, provincias]);

  // Notifica hospital seleccionado
  useEffect(() => {
    if (hospitalId && onHospitalSeleccionado) {
      const hospitalSeleccionado = hospitales.find(h => h.id.toString() === hospitalId);
      onHospitalSeleccionado(hospitalSeleccionado);
    }
  }, [hospitalId, hospitales, onHospitalSeleccionado]);

  return (
    <BuscarPorHospital
      provincias={provincias}
      hospitales={hospitales}
      onProvincia={setProvinciaId}
      onHospital={setHospitalId}
      provinciaId={provinciaId}
      hospitalId={hospitalId}
    />
  );
}
