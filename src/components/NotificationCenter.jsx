export default function NotificationCenter({ notifications }) {
  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{
        zIndex: 1100,
        maxWidth: "100%",
        maxHeight: "100vh",
        overflowY: "auto",
        pointerEvents: "none", // evita bloquear clics debajo
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="d-flex flex-column align-items-end gap-2">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`toast show text-white bg-${note.type}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              minWidth: "250px",
              pointerEvents: "auto", // permite cerrar
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div className="d-flex">
              <div className="toast-body">{note.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Cerrar"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Animación suave */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              transform: translateY(-10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
