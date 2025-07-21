// components/FormularioDatosPaciente.jsx
import { useState } from "react";

export default function FormularioDatosPaciente({ onSubmit, loading }) {
  const [form, setForm] = useState({
    USER_FIRST_NAME: "",
    USER_SECOND_NAME: "",
    USER_DATE_OF_BIRTH: "",
    USER_EMAIL: "",
    USER_MOBILE_PHONE: "",
    USER_GENDER: "",
    USER_ID_NUMBER: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg border bg-white max-w-md mx-auto mt-8">
      <h3 className="font-bold text-lg mb-2 text-center">Tus datos personales</h3>
      <div className="flex gap-2">
        <input className="input w-1/2" name="USER_FIRST_NAME" value={form.USER_FIRST_NAME} onChange={handleChange} placeholder="Nombre" required />
        <input className="input w-1/2" name="USER_SECOND_NAME" value={form.USER_SECOND_NAME} onChange={handleChange} placeholder="Apellidos" required />
      </div>
      <input className="input w-full" type="date" name="USER_DATE_OF_BIRTH" value={form.USER_DATE_OF_BIRTH} onChange={handleChange} required />
      <input className="input w-full" type="email" name="USER_EMAIL" value={form.USER_EMAIL} onChange={handleChange} placeholder="Email" required />
      <input className="input w-full" name="USER_MOBILE_PHONE" value={form.USER_MOBILE_PHONE} onChange={handleChange} placeholder="Teléfono" required />
      <select className="input w-full" name="USER_GENDER" value={form.USER_GENDER} onChange={handleChange} required>
        <option value="">Sexo</option>
        <option value="M">Hombre</option>
        <option value="F">Mujer</option>
        <option value="O">Otro</option>
      </select>
      <input className="input w-full" name="USER_ID_NUMBER" value={form.USER_ID_NUMBER} onChange={handleChange} placeholder="NIF/Pasaporte (opcional)" />
      <button type="submit" className="btn w-full" disabled={loading}>
        {loading ? "Reservando..." : "Confirmar reserva"}
      </button>
    </form>
  );
}
