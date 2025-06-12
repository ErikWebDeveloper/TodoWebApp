import { useState, useEffect } from "react";
import { useLista } from "../context/ListaContext";

export default function SettingsPage() {
  const { config, updateStorage } = useLista();
  const [mode, setMode] = useState(config.mode || "local");
  const [apiKey, setApiKey] = useState(config.apiKey || "");


  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setError("");

    if ((mode === "jsonbin" || mode === "apify") && !apiKey.trim()) {
      setError("Debes ingresar una API Key válida.");
      return;
    }

    updateStorage(mode, apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    console.log("Configuración cargada:", config);
    setMode(config.mode || "local");
    setApiKey(config.apiKey || "");
  }, [config]);
  

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Configuración */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">⚙️ Configuración de almacenamiento</h2>

              <div className="mb-4">
                <label htmlFor="storageMode" className="form-label">
                  Selecciona el proveedor:
                </label>
                <select
                  className="form-select"
                  id="storageMode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="local">
                    🗃️ LocalStorage (modo sin conexión)
                  </option>
                  <option value="jsonbin">☁️ JSONBin.io</option>
                  <option value="apify">🛰️ Apify</option>
                </select>
              </div>

              {(mode === "jsonbin" || mode === "apify") && (
                <div className="mb-4">
                  <label htmlFor="apiKey" className="form-label">
                    Clave API ({mode === "jsonbin" ? "JSONBin" : "Apify"})
                  </label>
                  <div className="input-group">
                    <input
                      type={showKey ? "text" : "password"}
                      className="form-control"
                      id="apiKey"
                      placeholder="Tu clave secreta"
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

        {/* Tutorial */}
        <div className="col-md-6">
          <div className="card bg-body-tertiary border-0 shadow-sm">
            <div className="card-body">
              {mode === "jsonbin" ? (
                <>
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
                      y accede a tu cuenta.
                    </li>
                    <li>
                      Desde el panel, copia tu <strong>Secret API Key</strong>.
                    </li>
                    <li>Pégala aquí en el campo de configuración y guarda.</li>
                  </ol>
                </>
              ) : mode === "apify" ? (
                <>
                  <h2 className="h5 mb-3">🧠 ¿Cómo conectar con Apify?</h2>
                  <ol className="small mb-0">
                    <li>
                      Ve a{" "}
                      <a
                        href="https://console.apify.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        console.apify.com
                      </a>{" "}
                      y accede a tu cuenta.
                    </li>
                    <li>
                      Haz clic en tu nombre &gt;{" "}
                      <strong>Integrations &gt; API</strong>.
                    </li>
                    <li>
                      Copia tu <strong>Token de API</strong>.
                    </li>
                    <li>Pega el token aquí y guarda.</li>
                    <li>¡Listo! Se creará un dataset único en tu cuenta.</li>
                  </ol>
                  <div className="alert alert-warning mt-3 p-2 small">
                    ⚠️ Tu clave se almacena localmente. No la compartas.
                  </div>
                </>
              ) : (
                <>
                  <h2 className="h5 mb-3">
                    ℹ️ ¿Qué es el almacenamiento local?
                  </h2>
                  <p className="small mb-0">
                    Toda tu información se guarda en tu navegador. Si borras
                    datos o cambias de dispositivo, perderás tu contenido.
                  </p>
                  <p className="small text-muted">
                    Ideal para pruebas rápidas o uso sin conexión.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
