export default function NavbarProgreso({ progreso = 0.1 }) {
  // progreso: número entre 0 y 1 (porcentaje)
  return (
    <nav
      className="w-full flex flex-col items-center"
      style={{ background: "#fff", zIndex: 10, position: "sticky", top: 0 }}
    >
      <div className="w-full max-w-md flex justify-center items-center pt-10 pb-5 mt-2">
        <img
          src={"https://synaptia.clinic/wp-content/uploads/2023/09/Logo-Synaptia.png"}
          alt="Logo"
          className="h-12"
        />
      </div>
      <div className="w-full max-w-md px-3 mt-2 mb-5">
        <div
          className="w-full h-3 rounded-lg overflow-hidden"
          style={{ background: "#e5e7eb" }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              background: "#010031",
              width: `${Math.round(progreso * 100)}%`,
              minWidth: 20,
              maxWidth: "100%",
            }}
          />
        </div>
      </div>
    </nav>
  );
}
