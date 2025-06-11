import { Outlet, Link, NavLink, useLocation } from "react-router-dom";
import { useLista } from "../context/ListaContext";
import { useEffect, useRef } from "react";

export default function MainLayout() {
  const { config } = useLista();
  const mode = config?.mode;
  const location = useLocation();
  const navbarCollapseRef = useRef(null);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    const collapseEl = navbarCollapseRef.current;
    if (collapseEl?.classList.contains("show")) {
      new window.bootstrap.Collapse(collapseEl).hide();
    }
  }, [location]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <header>
        <nav className="navbar navbar-expand-md navbar bg-dark shadow-sm bg-body-tertiary">
          <div className="container">
            {/* Logo */}
            <Link
              to="/"
              className="navbar-brand d-flex align-items-center gap-2"
            >
              <span className="bg-success text-white fw-bold rounded px-2 py-1 shadow-sm">
                ✅ ToDo
              </span>
              <span className="fw-light">Web App</span>
            </Link>

            {/* Botón de colapso */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            {/* Menú colapsable */}
            <div
              className="collapse navbar-collapse"
              id="mainNavbar"
              ref={navbarCollapseRef}
            >
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink to="/settings" className="nav-link">
                    Configuración
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container my-4 flex-grow-1">
        <Outlet />
      </main>

      <footer
        className="text-secondary py-3 px-4 small text-center"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1030, // para estar por encima de contenido normal
          backgroundColor: "#10101030"
        }}
      >
        <div>
          <span className="opacity-75 me-2">Modo de almacenamiento:</span>
          <span className="badge bg-primary">
            {mode === "jsonbin" ? "JSONBin.io" : "LocalStorage"}
          </span>
        </div>
      </footer>
    </div>
  );
}
