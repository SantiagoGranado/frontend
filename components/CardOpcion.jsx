export default function CardOpcion({ icon, label, onClick }) {
  return (
    <button
      className="flex items-center gap-4 p-4 rounded-xl border shadow w-full active:scale-95 transition cursor-pointer"
      style={{
        borderColor: "#010031",
        backgroundColor: "#fff",
        color: "#010031",
        minHeight: "60px"
      }}
      onClick={onClick}
      type="button"
    >
      <span
        style={{
          backgroundColor: "#e7e8f6", // Mucho más visible, azul muy clarito
          borderRadius: "999px",
          padding: "0.45rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 38,
          minHeight: 38,
        }}
      >
        {icon}
      </span>
      <span className="font-semibold text-base sm:text-lg">{label}</span>
    </button>
  );
}
