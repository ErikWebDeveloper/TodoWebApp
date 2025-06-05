import { createContext, useContext, useState, useEffect } from "react";
import LocalStorageProvider from "../storage/localStorageProvider";
import JsonBinProvider from "../storage/jsonBinProvider";

const ListaContext = createContext();
const storage = new LocalStorageProvider();
//const storage = new JsonBinProvider();

export function ListaProvider({ children }) {
  const [listas, setListas] = useState([]);

  useEffect(() => {
    const data = storage.getAll();
    setListas(data);
  }, []);

  const createLista = (nombre) => {
    const nuevaLista = storage.create({ nombre });
    setListas((prev) => [...prev, nuevaLista]);
  };

  const updateLista = (id, nombre) => {
    const listaActualizada = storage.update(id, { nombre });
    if (listaActualizada) {
      setListas((prev) =>
        prev.map((l) => (l.id === id ? listaActualizada : l))
      );
    }
  };

  const deleteLista = (id) => {
    storage.delete(id);
    setListas((prev) => prev.filter((l) => l.id !== id));
  };

  const getLista = (id) => listas.find((l) => l.id === id);

  const addItem = (listaId, contenido) => {
    const item = storage.addItem(listaId, contenido);
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

  const updateItem = (
    listaId,
    itemId,
    contenido,
    orden = null,
    completado = null
  ) => {
    const item = storage.updateItem(
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

  const deleteItem = (listaId, itemId) => {
    storage.deleteItem(listaId, itemId);
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
