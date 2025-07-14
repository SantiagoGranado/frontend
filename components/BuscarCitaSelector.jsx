import CardOpcion from "./CardOpcion";

const opciones = [
  {
    label: "Por Hospital",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        {/* Edificio principal */}
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          fill="#fff"
          stroke="#010031"
          strokeWidth="2"
        />
        {/* Cruz vertical */}
        <rect x="11" y="9" width="2" height="6" rx="1" fill="#010031" />
        {/* Cruz horizontal */}
        <rect x="9" y="11" width="6" height="2" rx="1" fill="#010031" />
        {/* Puerta */}
        <rect x="10" y="15" width="4" height="5" rx="1" fill="#010031" />
        {/* Ventanas laterales */}
        <rect x="5.5" y="9.5" width="2" height="2" rx="0.5" fill="#010031" />
        <rect x="16.5" y="9.5" width="2" height="2" rx="0.5" fill="#010031" />
      </svg>
    ),
    value: "hospital",
  },
  {
    label: "Por Especialidad",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        {/* Círculo izquierdo */}
        <circle cx="6.5" cy="8.5" r="2" stroke="#010031" strokeWidth="2" fill="white"/>
        {/* Círculo derecho */}
        <circle cx="17.5" cy="8.5" r="2" stroke="#010031" strokeWidth="2" fill="white"/>
        {/* Tubo */}
        <path d="M8.5 10.5C8.5 14.5 15.5 14.5 15.5 10.5" stroke="#010031" strokeWidth="2" fill="none" />
        {/* Bajada y campana */}
        <path d="M12 17v2.5a2 2 0 0 0 4 0V17" stroke="#010031" strokeWidth="2" fill="none"/>
        <circle cx="12" cy="17" r="1" fill="#010031"/>
      </svg>
    ),
    value: "especialidad",
  },
  {
    label: "Por Profesional",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        {/* Cabeza */}
        <circle cx="12" cy="8" r="4" stroke="#010031" strokeWidth="2" fill="white"/>
        {/* Cuerpo */}
        <path d="M6 21v-2a6 6 0 0 1 12 0v2" stroke="#010031" strokeWidth="2" fill="white"/>
        {/* Bata y detalles */}
        <path d="M12 12v3" stroke="#010031" strokeWidth="2"/>
        <path d="M9.5 21l1.5-4 1.5 4" stroke="#010031" strokeWidth="2" fill="none"/>
        <path d="M14.5 21l-1.5-4" stroke="#010031" strokeWidth="2" fill="none"/>
      </svg>
    ),
    value: "profesional",
  },
];

export default function BuscarCitaSelector({ onSelect }) {
  return (
    <div className="flex flex-col items-center min-h-[70vh] px-2">
      <h2
        className="text-lg sm:text-2xl font-semibold mb-7 text-center"
        style={{ color: "#010031" }}
      >
        ¿Cómo quieres buscar tu cita?
      </h2>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {opciones.map((op) => (
          <CardOpcion
            key={op.value}
            icon={op.icon}
            label={op.label}
            onClick={() => onSelect?.(op.value)}
          />
        ))}
      </div>
    </div>
  );
}
