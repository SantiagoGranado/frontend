// FormularioDatosPaciente.jsx
import { useMemo, useRef, useState } from "react";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h4 id="terms-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h4>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto pr-1 text-sm leading-6 text-gray-700">
          {children}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FormularioDatosPaciente({
  onSubmit,
  loading = false,
  activityId,
}) {
  const [form, setForm] = useState({
    USER_FIRST_NAME: "",
    USER_SECOND_NAME: "",
    USER_DATE_OF_BIRTH: "",
    USER_EMAIL: "",
    USER_MOBILE_PHONE: "",
    USER_GENDER: "",
    USER_ID_NUMBER: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const refs = {
    USER_FIRST_NAME: useRef(null),
    USER_SECOND_NAME: useRef(null),
    USER_DATE_OF_BIRTH: useRef(null),
    USER_EMAIL: useRef(null),
    USER_MOBILE_PHONE: useRef(null),
    USER_GENDER: useRef(null),
    USER_ID_NUMBER: useRef(null),
    TERMS: useRef(null),
  };

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const validators = {
    USER_FIRST_NAME: (v) => (v.trim() ? "" : "El nombre es obligatorio."),
    USER_SECOND_NAME: (v) =>
      v.trim() ? "" : "Los apellidos son obligatorios.",
    USER_DATE_OF_BIRTH: (v) => {
      if (!v) return "La fecha de nacimiento es obligatoria.";
      if (v > todayISO) return "La fecha no puede ser futura.";
      const y = parseInt(v.slice(0, 4), 10);
      const yearNow = new Date().getFullYear();
      if (yearNow - y > 120) return "Revisa la fecha de nacimiento.";
      return "";
    },
    USER_EMAIL: (v) => {
      if (!v.trim()) return "El email es obligatorio.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      return re.test(v) ? "" : "Introduce un email válido.";
    },
    USER_MOBILE_PHONE: (v) => {
      if (!v.trim()) return "El teléfono es obligatorio.";
      const digits = v.replace(/[^\d]/g, "");
      return digits.length >= 9 && digits.length <= 15
        ? ""
        : "Introduce un teléfono válido (9–15 dígitos).";
    },
    USER_GENDER: (v) => (v ? "" : "Selecciona una opción."),
    USER_ID_NUMBER: () => "",
  };

  function validateAll(current = form) {
    const nextErrors = {};
    for (const key of Object.keys(validators)) {
      const msg = validators[key](current[key] ?? "");
      if (msg) nextErrors[key] = msg;
    }
    if (!acceptedTerms)
      nextErrors.TERMS = "Debes aceptar los términos para continuar.";
    return nextErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value) }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](form[name]) }));
    }
  }

  function focusFirstError(errs) {
    const firstKey = Object.keys(errs)[0];
    const map = { TERMS: refs.TERMS, ...refs };
    if (firstKey && map[firstKey]?.current) {
      map[firstKey].current.focus();
      map[firstKey].current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validateAll();
    setTouched((t) => {
      const all = { ...t };
      Object.keys(validators).forEach((k) => (all[k] = true));
      return all;
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }
    const payload = activityId ? { ...form, ACTIVITY_LID: activityId } : form;
    onSubmit(payload);
  }

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition " +
    "focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 " +
    "placeholder:text-gray-400";
  const labelBase = "text-sm font-medium text-gray-700";
  const errorText = "mt-1 text-xs text-red-600";
  const fieldWrap = "space-y-1";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-xl rounded-2xl border bg-white p-6 shadow-sm"
        noValidate
      >
        <div className="mb-4 text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            Tus datos personales
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Usaremos esta información para confirmar tu cita.
          </p>
        </div>

        {/* Nombre y apellidos */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className={fieldWrap}>
            <label htmlFor="USER_FIRST_NAME" className={labelBase}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              ref={refs.USER_FIRST_NAME}
              id="USER_FIRST_NAME"
              name="USER_FIRST_NAME"
              value={form.USER_FIRST_NAME}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. Laura"
              className={`${inputBase} ${
                errors.USER_FIRST_NAME ? "border-red-400" : "border-gray-200"
              }`}
              aria-invalid={!!errors.USER_FIRST_NAME}
              aria-describedby="err-firstname"
            />
            {touched.USER_FIRST_NAME && errors.USER_FIRST_NAME && (
              <p id="err-firstname" className={errorText}>
                {errors.USER_FIRST_NAME}
              </p>
            )}
          </div>

          <div className={fieldWrap}>
            <label htmlFor="USER_SECOND_NAME" className={labelBase}>
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              ref={refs.USER_SECOND_NAME}
              id="USER_SECOND_NAME"
              name="USER_SECOND_NAME"
              value={form.USER_SECOND_NAME}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. García López"
              className={`${inputBase} ${
                errors.USER_SECOND_NAME ? "border-red-400" : "border-gray-200"
              }`}
              aria-invalid={!!errors.USER_SECOND_NAME}
              aria-describedby="err-secondname"
            />
            {touched.USER_SECOND_NAME && errors.USER_SECOND_NAME && (
              <p id="err-secondname" className={errorText}>
                {errors.USER_SECOND_NAME}
              </p>
            )}
          </div>
        </div>

        {/* Fecha de nacimiento */}
        <div className={`mt-4 ${fieldWrap}`}>
          <label htmlFor="USER_DATE_OF_BIRTH" className={labelBase}>
            Fecha de nacimiento<span className="text-red-500">*</span>
          </label>
          <input
            ref={refs.USER_DATE_OF_BIRTH}
            id="USER_DATE_OF_BIRTH"
            name="USER_DATE_OF_BIRTH"
            type={form.USER_DATE_OF_BIRTH ? "date" : "text"} // ← Cambio dinámico
            value={form.USER_DATE_OF_BIRTH}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={(e) => (e.target.type = "date")} // ← Cambiar a date al hacer focus
            placeholder="Fecha de nacimiento" // ← Placeholder visible cuando está vacío
            max={todayISO}
            className={`${inputBase} ${
              errors.USER_DATE_OF_BIRTH ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.USER_DATE_OF_BIRTH}
            aria-describedby="err-dob"
          />
          {touched.USER_DATE_OF_BIRTH && errors.USER_DATE_OF_BIRTH && (
            <p id="err-dob" className={errorText}>
              {errors.USER_DATE_OF_BIRTH}
            </p>
          )}
        </div>

        {/* Email */}
        <div className={`mt-2 ${fieldWrap}`}>
          <label htmlFor="USER_EMAIL" className={labelBase}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            ref={refs.USER_EMAIL}
            id="USER_EMAIL"
            name="USER_EMAIL"
            type="email"
            inputMode="email"
            value={form.USER_EMAIL}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="tu@email.com"
            className={`${inputBase} ${
              errors.USER_EMAIL ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.USER_EMAIL}
            aria-describedby="err-email"
          />
          {touched.USER_EMAIL && errors.USER_EMAIL && (
            <p id="err-email" className={errorText}>
              {errors.USER_EMAIL}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div className={`mt-2 ${fieldWrap}`}>
          <label htmlFor="USER_MOBILE_PHONE" className={labelBase}>
            Teléfono móvil <span className="text-red-500">*</span>
          </label>
          <input
            ref={refs.USER_MOBILE_PHONE}
            id="USER_MOBILE_PHONE"
            name="USER_MOBILE_PHONE"
            inputMode="tel"
            value={form.USER_MOBILE_PHONE}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+34 612 345 678"
            className={`${inputBase} ${
              errors.USER_MOBILE_PHONE ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.USER_MOBILE_PHONE}
            aria-describedby="err-phone"
          />
          {touched.USER_MOBILE_PHONE && errors.USER_MOBILE_PHONE && (
            <p id="err-phone" className={errorText}>
              {errors.USER_MOBILE_PHONE}
            </p>
          )}
        </div>

        {/* Sexo */}
        <div className={`mt-2 ${fieldWrap}`}>
          <label htmlFor="USER_GENDER" className={labelBase}>
            Sexo <span className="text-red-500">*</span>
          </label>
          <select
            ref={refs.USER_GENDER}
            id="USER_GENDER"
            name="USER_GENDER"
            value={form.USER_GENDER}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputBase} ${
              errors.USER_GENDER ? "border-red-400" : "border-gray-200"
            }`}
            aria-invalid={!!errors.USER_GENDER}
            aria-describedby="err-gender"
          >
            <option value="">Selecciona una opción</option>
            <option value="M">Hombre</option>
            <option value="F">Mujer</option>
            <option value="O">Otro / Prefiero no decirlo</option>
          </select>
          {touched.USER_GENDER && errors.USER_GENDER && (
            <p id="err-gender" className={errorText}>
              {errors.USER_GENDER}
            </p>
          )}
        </div>

        {/* NIF/Pasaporte (opcional) */}
        <div className={`mt-2 ${fieldWrap}`}>
          <label htmlFor="USER_ID_NUMBER" className={labelBase}>
            NIF/Pasaporte <span className="text-gray-400">(opcional)</span>
          </label>
          <input
            ref={refs.USER_ID_NUMBER}
            id="USER_ID_NUMBER"
            name="USER_ID_NUMBER"
            value={form.USER_ID_NUMBER}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Ej. 12345678Z"
            className={`${inputBase} ${
              errors.USER_ID_NUMBER ? "border-red-400" : "border-gray-200"
            }`}
          />
          {touched.USER_ID_NUMBER && errors.USER_ID_NUMBER && (
            <p className={errorText}>{errors.USER_ID_NUMBER}</p>
          )}
        </div>

        {/* Términos */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-start gap-3">
            <input
              ref={refs.TERMS}
              id="ACCEPT_TERMS"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                setErrors((prev) => ({
                  ...prev,
                  TERMS: e.target.checked ? "" : prev.TERMS,
                }));
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300"
              aria-invalid={!!errors.TERMS}
              aria-describedby="err-terms"
            />
            <label htmlFor="ACCEPT_TERMS" className="text-sm text-gray-700">
              He leído y acepto los{" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800 cursor-pointer"
              >
                términos de tratamiento de datos
              </button>
              .
            </label>
          </div>
          {errors.TERMS && (
            <p id="err-terms" className="mt-2 text-xs text-red-600">
              {errors.TERMS}
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-black transition shadow-sm
    ${
      loading
        ? "bg-[#00f1dd]/60 cursor-not-allowed"
        : "bg-[#00f1dd] hover:bg-[#00d8c6] cursor-pointer"
    }`}
        >
          {loading && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Reservando..." : "Confirmar cita"}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Al confirmar, aceptas nuestra política de privacidad y el tratamiento
          de datos para gestionar tu cita.
        </p>
      </form>

      {/* Modal de Términos */}
      <Modal
        open={showTerms}
        onClose={() => setShowTerms(false)}
        title="Términos de tratamiento de datos"
      >
        <p>
          Autorizo a que estos datos sean incluidos en una base de datos interna
          del Instituto de Neurociencias Synaptia y utilizados únicamente para
          valoración de inclusión en un ensayo clínico con nuevas terapias en
          epilepsia u otros estudios o posibilidades de tratamiento.
        </p>
      </Modal>
    </>
  );
}
