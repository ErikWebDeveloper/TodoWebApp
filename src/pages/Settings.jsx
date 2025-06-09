import { useState, useEffect } from "react";
import { useLista } from "../context/ListaContext";

export default function SettingsPage() {
  const { config, updateStorage } = useLista();
  const [mode, setMode] = useState(config.mode);
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setError("");

    if (mode === "jsonbin" && !apiKey.trim()) {
      setError("Debes ingresar una API Key válida para usar JSONBin.");
      return;
    }

    updateStorage(mode, apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    setMode(config.mode);
    setApiKey(config.apiKey);
  }, [config]);

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Sección de Configuración */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">⚙️ Configuración de almacenamiento</h2>

              <div className="form-check form-switch mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="modoSwitch"
                  checked={mode === "jsonbin"}
                  onChange={(e) =>
                    setMode(e.target.checked ? "jsonbin" : "local")
                  }
                />
                <label className="form-check-label" htmlFor="modoSwitch">
                  Usar JSONBin.io (si está apagado, se usa LocalStorage)
                </label>
              </div>

              {mode === "jsonbin" && (
                <div className="mb-4">
                  <label htmlFor="apiKey" className="form-label">
                    Clave API (Master Key)
                  </label>
                  <div className="input-group">
                    <input
                      type={showKey ? "text" : "password"}
                      className="form-control"
                      id="apiKey"
                      placeholder="Ej: xxxxxx-xxxxxx"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      aria-describedby="apiHelp"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowKey((prev) => !prev)}
                    >
                      {showKey ? "🔒 Ocultar" : "👁️ Ver"}
                    </button>
                  </div>
                  <div id="apiHelp" className="form-text">
                    Tu clave se guarda solo en tu navegador.
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-2">{error}</div>
                  )}
                </div>
              )}

              <button className="btn btn-primary" onClick={handleSave}>
                Guardar configuración
              </button>

              {saved && (
                <div className="alert alert-success mt-3" role="alert">
                  ✅ Configuración guardada correctamente.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Ayuda */}
        <div className="col-md-6">
          <div className="card bg-body-tertiary border-0 shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">🧠 ¿Cómo conectar con JSONBin.io?</h2>
              <ol className="small mb-0">
                <li>
                  Ve a{" "}
                  <a
                    href="https://jsonbin.io"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    jsonbin.io
                  </a>{" "}
                  y haz clic en <strong>Sign In</strong>.
                </li>
                <li>
                  Regístrate con Google o crea una cuenta gratuita.
                  <br />
                  <small className="text-muted">
                    La cuenta gratuita incluye{" "}
                    <strong>10.000 peticiones únicas</strong>, que puedes usar
                    sin límite de tiempo. No se renuevan mensualmente, pero
                    puedes comprar más si las necesitas.
                  </small>
                </li>

                <li>
                  Ve a tu panel (Dashboard) y copia la{" "}
                  <strong>Secret API Key</strong> (Master Key) desde{" "}
                  <em>Settings &gt; API Key</em>.
                </li>
                <li>
                  Pega esa clave en el campo de esta página y guarda la
                  configuración.
                </li>
              </ol>
              <div className="alert alert-warning mt-3 p-2 small">
                ⚠️ Asegúrate de no compartir tu clave con nadie. Se guarda solo
                en tu navegador.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
