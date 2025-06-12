import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { theme, isDark, changeTheme } = useTheme();
  const location = useLocation();
  const navbarCollapseRef = useRef(null);

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    const collapseEl = navbarCollapseRef.current;
    if (collapseEl?.classList.contains("show")) {
      new window.bootstrap.Collapse(collapseEl).hide();
    }
  }, [location]);

  const handleToggle = () => {
    const newTheme =
      theme === "system"
        ? isDark
          ? "light"
          : "dark"
        : theme === "dark"
        ? "light"
        : "dark";
    changeTheme(newTheme);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar bg-dark shadow-sm bg-body-tertiary">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
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
              <li className="nav-item">
                <button
                  className={`btn btn-${
                    isDark ? "light" : "dark"
                  } d-flex align-items-center gap-2`}
                  onClick={handleToggle}
                  aria-label="Cambiar tema"
                >
                  {theme === "system" ? (
                    <>
                      {isDark ? (
                        <i className="bi bi-moon-stars-fill"></i>
                      ) : (
                        <i className="bi bi-sun-fill"></i>
                      )}
                      <span>
                        {isDark ? "Oscuro (Sistema)" : "Claro (Sistema)"}
                      </span>
                    </>
                  ) : (
                    <>
                      {theme === "dark" ? (
                        <i className="bi bi-moon-fill"></i>
                      ) : (
                        <i className="bi bi-sun-fill"></i>
                      )}
                      <span>
                        {theme === "dark"
                          ? "Oscuro (Manual)"
                          : "Claro (Manual)"}
                      </span>
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
