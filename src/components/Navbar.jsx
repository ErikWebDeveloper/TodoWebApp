import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";


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

  // Determina el próximo tema y su texto
  const nextTheme =
    theme === "system"
      ? isDark
        ? "light"
        : "dark"
      : theme === "dark"
      ? "light"
      : "dark";
  const nextThemeLabel =
    nextTheme === "dark"
      ? "Oscuro"
      : "Claro";
  const nextThemeIcon =
    nextTheme === "dark"
      ? <i className="bi bi-moon-fill"></i>
      : <i className="bi bi-sun-fill"></i>;

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
              <li className="nav-item d-flex align-items-center">
                {/* Switch de tema */}
                <div className="form-check form-switch d-flex align-items-center mb-0 ms-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="themeSwitch"
                    checked={nextTheme === "dark"}
                    onChange={handleToggle}
                    aria-label="Cambiar tema"
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label ms-2 d-flex align-items-center"
                    htmlFor="themeSwitch"
                    style={{ cursor: "pointer" }}
                  >
                    {nextThemeIcon}
                    <span className="ms-1">{nextThemeLabel}</span>
                    {theme === "system" && (
                      <span className="ms-1 text-muted small">(Sistema)</span>
                    )}
                  </label>
                </div>
              </li>
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
  );
}
