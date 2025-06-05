import { createContext, useContext, useState, useEffect, useMemo } from "react";
import JsonBinProvider from "../storage/jsonBinProvider";
import LocalStorageProvider from "../storage/localStorageProvider";

const ListaContext = createContext();

function getStorageProvider() {
  const useLocal = false;
  if (useLocal) {
    return new LocalStorageProvider();
  } else {
    const binId = localStorage.getItem("binId");
    return new JsonBinProvider(binId);
  }
}

export function ListaProvider({ children }) {
  const [listas, setListas] = useState([]);
  // Creamos storage solo una vez y memoizado
  const storage = useMemo(() => getStorageProvider(), []);

  useEffect(() => {
    (async () => {
      const data = await storage.getAll();
      setListas(data || []);
    })();
  }, [storage]);

  const createLista = async (nombre) => {
    const nuevaLista = await storage.create({ nombre });
    setListas((prev) => [...prev, nuevaLista]);
  };

  const updateLista = async (id, nombre) => {
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

  const updateItem = async (
    listaId,
    itemId,
    contenido,
    orden = null,
    completado = null
  ) => {
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
      }}
    >
      {children}
    </ListaContext.Provider>
  );
}

export function useLista() {
  return useContext(ListaContext);
}
