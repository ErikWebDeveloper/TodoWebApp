import StorageInterface from "./storageInterface";

const STORAGE_KEY = "listas";

export default class LocalStorageProvider extends StorageInterface {
  getAll() {
    const data = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(data) || [];
  }

  get(id) {
    const listas = this.getAll();
    return listas.find((l) => l.id === id);
  }

  create(data) {
    const listas = this.getAll();
    const now = new Date().toISOString();
    const newLista = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    listas.push(newLista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
    return newLista;
  }

  update(id, newData) {
    const listas = this.getAll();
    const now = new Date().toISOString();
    const index = listas.findIndex((l) => l.id === id);
    if (index === -1) return null;
    listas[index] = { ...listas[index], ...newData, updatedAt: now };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
    return listas[index];
  }

  delete(id) {
    const listas = this.getAll().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
  }

  addItem(listaId, contenido) {
    const listas = this.getAll();
    const now = new Date().toISOString();
    const index = listas.findIndex((l) => l.id === listaId);
    if (index === -1) return null;

    const lista = listas[index];
    const newItem = {
      id: crypto.randomUUID(),
      contenido,
      orden: lista.items?.length || 0,
      createdAt: now,
      updatedAt: now,
    };

    lista.items = [...(lista.items || []), newItem];
    lista.updatedAt = now;
    listas[index] = lista;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
    return newItem;
  }

  updateItem(listaId, itemId, contenido, nuevoOrden = null, completado = null) {
    const listas = this.getAll();
    const now = new Date().toISOString();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista || !lista.items) return null;

    const index = lista.items.findIndex((i) => i.id === itemId);
    if (index === -1) return null;

    const item = lista.items[index];
    const updatedItem = {
      ...item,
      contenido,
      orden: nuevoOrden !== null ? nuevoOrden : item.orden,
      updatedAt: now,
      ...(completado !== null && { completado }),
    };

    lista.items[index] = updatedItem;
    lista.updatedAt = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
    return updatedItem;
  }

  deleteItem(listaId, itemId) {
    const listas = this.getAll();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista || !lista.items) return;

    lista.items = lista.items.filter((i) => i.id !== itemId);
    lista.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
  }

  reorderItems(listaId, itemId, direccion) {
    const listas = this.getAll();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista || !Array.isArray(lista.items)) return null;

    const index = lista.items.findIndex((i) => i.id === itemId);
    if (index === -1) return null;

    const targetIndex = direccion === "arriba" ? index - 1 : index + 1;

    // Asegurarse de que el nuevo índice esté dentro de los límites
    if (targetIndex < 0 || targetIndex >= lista.items.length) return null;

    // Intercambiar los ítems
    const items = [...lista.items];
    [items[index], items[targetIndex]] = [items[targetIndex], items[index]];

    // Actualizar los valores de orden según la nueva posición
    const now = new Date().toISOString();
    lista.items = items.map((item, i) => ({
      ...item,
      orden: i,
      updatedAt: now,
    }));

    lista.updatedAt = now;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listas));
    return lista.items;
  }
}
