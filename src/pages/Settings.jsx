import { useState, useEffect } from "react";
import { useLista } from "../context/ListaContext";

export default function SettingsPage() {
  const { config, updateStorage } = useLista();
  const [mode, setMode] = useState(config.mode || "local");
  const [jsonbinApiKey, setJsonbinApiKey] = useState(config.jsonbinApiKey || "");
  const [apifyToken, setApifyToken] = useState(config.apifyToken || "");
  const [apiKey, setApiKey] = useState(
    config.mode === "jsonbin"
      ? config.jsonbinApiKey || ""
      : config.mode === "apify"
      ? config.apifyToken || ""
      : ""
  );

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Actualiza apiKey mostrado cuando cambia el proveedor
  useEffect(() => {
    if (mode === "jsonbin") {
      setApiKey(jsonbinApiKey);
    } else if (mode === "apify") {
      setApiKey(apifyToken);
    } else {
      setApiKey("");
    }
  }, [mode, jsonbinApiKey, apifyToken]);

  // Sincroniza con cambios externos en config
  useEffect(() => {
    setMode(config.mode || "local");
    setJsonbinApiKey(config.jsonbinApiKey || "");
    setApifyToken(config.apifyToken || "");
    if (config.mode === "jsonbin") {
      setApiKey(config.jsonbinApiKey || "");
    } else if (config.mode === "apify") {
      setApiKey(config.apifyToken || "");
    } else {
      setApiKey("");
    }
  }, [config]);

  const handleSave = () => {
    setError("");
    if ((mode === "jsonbin" || mode === "apify") && !apiKey.trim()) {
      setError("Debes ingresar una API Key válida.");
      return;
    }
    // Guarda la clave correspondiente y actualiza el contexto
    if (mode === "jsonbin") {
      setJsonbinApiKey(apiKey);
      updateStorage(mode, apiKey);
    } else if (mode === "apify") {
      setApifyToken(apiKey);
      updateStorage(mode, apiKey);
    } else {
      updateStorage(mode, "");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Maneja el cambio en el input de la API Key
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    if (mode === "jsonbin") {
      setJsonbinApiKey(e.target.value);
    } else if (mode === "apify") {
      setApifyToken(e.target.value);
    }
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Configuración */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">
                <i className="bi bi-gear-fill me-2"></i>Configuración de almacenamiento
              </h2>

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
                  <option value="jsonbin">
                    ☁️ JSONBin.io
                  </option>
                  <option value="apify">
                    🛰️ Apify
                  </option>
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
                      onChange={handleApiKeyChange}
                      aria-describedby="apiHelp"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowKey((prev) => !prev)}
                    >
                      {showKey ? (
                        <>
                          <i className="bi bi-eye-slash"></i> Ocultar
                        </>
                      ) : (
                        <>
                          <i className="bi bi-eye"></i> Ver
                        </>
                      )}
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
                  <i className="bi bi-check-circle-fill me-2"></i>Configuración guardada correctamente.
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
                  <h2 className="h5 mb-3">
                    <i className="bi bi-lightbulb-fill me-2"></i>¿Cómo conectar con JSONBin.io?
                  </h2>
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
                  <h2 className="h5 mb-3">
                    <i className="bi bi-lightbulb-fill me-2"></i>¿Cómo conectar con Apify?
                  </h2>
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
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>Tu clave se almacena localmente. No la compartas.
                  </div>
                </>
              ) : (
                <>
                  <h2 className="h5 mb-3">
                    <i className="bi bi-info-circle-fill me-2"></i>¿Qué es el almacenamiento local?
                  </h2>
                  <p className="small mb-0">
                    Toda tu información se guarda en tu navegador. Si borras
                    datos o cambias de dispositivo, perderás tu contenido.
                  </p>
                  <p className="small text-muted">
                    Ideal para uso sin conexión.
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
