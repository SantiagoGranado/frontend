// src/components/ConfirmarCita.jsx
export default function ConfirmarCita({ onConfirm, disabled }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className={`w-full rounded-xl px-4 py-3 font-medium shadow-sm focus:outline-none focus-visible:ring-2 cursor-pointer
          ${
            disabled
              ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
              : "bg-[#00f1dd] text-[#010031] hover:bg-[#00e6d2] focus-visible:ring-[#00f1dd]"
          }`}
      >
        Confirmar cita
      </button>
    </div>
  );
}
