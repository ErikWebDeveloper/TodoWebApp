import { createContext, useContext, useState, useEffect } from "react";
import JsonBinProvider from "../storage/jsonBinProvider";
import LocalStorageProvider from "../storage/localStorageProvider";
import ApifyProvider from "../storage/apifyProvider";

const ListaContext = createContext();

function getStoredConfig() {
  const mode = localStorage.getItem("storageMode") || "local";
  const jsonbinApiKey = localStorage.getItem("jsonbinApiKey") || "";
  const apifyToken = localStorage.getItem("apifyToken") || "";

  return {
    mode,
    apiKey:
      mode === "jsonbin" ? jsonbinApiKey : mode === "apify" ? apifyToken : "",
    jsonbinApiKey,
    apifyToken,
  };
}


function createStorage(mode, apiKey) {
  switch (mode) {
    case "jsonbin":
      return new JsonBinProvider(apiKey);
    case "apify":
      return new ApifyProvider(apiKey);
    default:
      return new LocalStorageProvider();
  }
}


export function ListaProvider({ children }) {
  const [listas, setListas] = useState([]);
  const [config, setConfig] = useState(getStoredConfig());
  const [storage, setStorage] = useState(() =>
    createStorage(config.mode, config.apiKey)
  );

  // Cargar datos al cambiar de storage
  useEffect(() => {
    (async () => {
      const data = await storage.getAll();
      setListas(data || []);
    })();
  }, [storage]);

  // Permite cambiar proveedor en caliente
  const updateStorage = (newMode, newApiKey = "") => {
    localStorage.setItem("storageMode", newMode);

    if (newMode === "jsonbin") {
      localStorage.setItem("jsonbinApiKey", newApiKey);
    } else if (newMode === "apify") {
      localStorage.setItem("apifyToken", newApiKey);
    }

    const updatedConfig = getStoredConfig();
    const newStorage = createStorage(updatedConfig.mode, updatedConfig.apiKey);

    setStorage(newStorage);
    setConfig(updatedConfig);
  };
  
  const createLista = async (nombre) => {
    if (nombre.trim() === "") return;
    const nuevaLista = await storage.create({ nombre });
    setListas((prev) => [...prev, nuevaLista]);
  };

  const updateLista = async (id, nombre) => {
    if (nombre.trim() === "") return;
    const listaActualizada = await storage.update(id, { nombre });
    if (listaActualizada) {
      setListas((prev) =>
        prev.map((l) => (l.id === id ? listaActualizada : l))
      );
    }
  };

  const deleteLista = async (id) => {
    await storage.delete(id);
    setListas((prev) => prev.filter((l) => l.id !== id));
  };

  const getLista = (id) => listas.find((l) => l.id === id);

  const addItem = async (listaId, contenido) => {
    if (contenido.trim() === "") return;
    const item = await storage.addItem(listaId, contenido);
    if (!item) return;
    setListas((prev) =>
      prev.map((l) =>
        l.id === listaId
          ? {
              ...l,
              items: [...(l.items || []), item],
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );
  };

  const reorderItems = async (listaId, itemId, direccion) => {
    await storage.reorderItems(listaId, itemId, direccion);
    const listaActualizada = await storage.get(listaId);
    setListas((prev) =>
      prev.map((l) => (l.id === listaId ? listaActualizada : l))
    );
  };

  const updateItem = async (
    listaId,
    itemId,
    contenido,
    orden = null,
    completado = null
  ) => {
    if (contenido.trim() === "") return;

    const item = await storage.updateItem(
      listaId,
      itemId,
      contenido,
      orden,
      completado
    );
    if (!item) return;

    setListas((prev) =>
      prev.map((l) =>
        l.id === listaId
          ? {
              ...l,
              items: l.items.map((i) => (i.id === itemId ? item : i)),
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );
  };

  const deleteItem = async (listaId, itemId) => {
    await storage.deleteItem(listaId, itemId);
    setListas((prev) =>
      prev.map((l) =>
        l.id === listaId
          ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
          : l
      )
    );
  };

  return (
    <ListaContext.Provider
      value={{
        listas,
        createLista,
        updateLista,
        deleteLista,
        getLista,
        addItem,
        updateItem,
        deleteItem,
        reorderItems,
        config,
        updateStorage,
      }}
    >
      {children}
    </ListaContext.Provider>
  );
}

export function useLista() {
  return useContext(ListaContext);
}
