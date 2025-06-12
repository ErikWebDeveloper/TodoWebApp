import { useLista } from "../context/ListaContext";

export default function Footer() {
  const { config } = useLista();
  const mode = config?.mode;

  return (
    <footer
      className="text-secondary py-3 px-4 small text-center"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1030, // para estar por encima de contenido normal
        backgroundColor: "#10101030",
      }}
    >
      <div>
        <span className="opacity-75 me-2">Modo de almacenamiento:</span>
        <div className="d-inline-flex gap-2">
          <span
            className={`badge ${
              mode === "local" ? "bg-primary" : "bg-secondary"
            }`}
          >
            LocalStorage
          </span>
          <span
            className={`badge ${
              mode === "jsonbin" ? "bg-primary" : "bg-secondary"
            }`}
          >
            JSONBin.io
          </span>
          <span
            className={`badge ${
              mode === "apify" ? "bg-primary" : "bg-secondary"
            }`}
          >
            Apify
          </span>
        </div>
      </div>
    </footer>
  );
}
