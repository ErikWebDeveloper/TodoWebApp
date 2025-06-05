import StorageInterface from "./storageInterface";

const API_URL = "https://api.jsonbin.io/v3/b";

// Pon aquí tu X-Master-Key de JSONBin.io
const HEADERS = {
  "Content-Type": "application/json",
  "X-Master-Key": "TU_API_KEY_AQUI",
};

export default class JsonBinProvider extends StorageInterface {
  constructor(binId = null) {
    super();
    // Si no se pasa binId, intentamos cargarlo desde localStorage
    this.binId = binId || localStorage.getItem("binId");
  }

  async getAll() {
    if (!this.binId) return [];
    const res = await fetch(`${API_URL}/${this.binId}/latest`, {
      headers: HEADERS,
    });
    console.log(res)
    if (!res.ok) throw new Error("No se pudo obtener la lista");
    const json = await res.json();
    return json.record;
  }

  async get(id) {
    const listas = await this.getAll();
    return listas.find((l) => l.id === id);
  }

  async create(data) {
    const listas = await this.getAll();
    const now = new Date().toISOString();
    const newLista = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      items: [],
    };
    listas.push(newLista);
    await this._save(listas);
    return newLista;
  }

  async update(id, newData) {
    const listas = await this.getAll();
    const index = listas.findIndex((l) => l.id === id);
    if (index === -1) return null;
    listas[index] = {
      ...listas[index],
      ...newData,
      updatedAt: new Date().toISOString(),
    };
    await this._save(listas);
    return listas[index];
  }

  async delete(id) {
    const listas = await this.getAll();
    const nuevasListas = listas.filter((l) => l.id !== id);
    await this._save(nuevasListas);
  }

  async addItem(listaId, contenido) {
    const listas = await this.getAll();
    const now = new Date().toISOString();
    const index = listas.findIndex((l) => l.id === listaId);
    if (index === -1) return null;

    const newItem = {
      id: crypto.randomUUID(),
      contenido,
      orden: listas[index].items?.length || 0,
      createdAt: now,
      updatedAt: now,
    };

    listas[index].items = [...(listas[index].items || []), newItem];
    listas[index].updatedAt = now;

    await this._save(listas);
    return newItem;
  }

  async updateItem(
    listaId,
    itemId,
    contenido,
    nuevoOrden = null,
    completado = null
  ) {
    const listas = await this.getAll();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista) return null;

    const itemIndex = lista.items.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return null;

    lista.items[itemIndex] = {
      ...lista.items[itemIndex],
      contenido,
      orden: nuevoOrden !== null ? nuevoOrden : lista.items[itemIndex].orden,
      updatedAt: new Date().toISOString(),
      ...(completado !== null && { completado }),
    };

    lista.updatedAt = new Date().toISOString();

    await this._save(listas);
    return lista.items[itemIndex];
  }

  async deleteItem(listaId, itemId) {
    const listas = await this.getAll();
    const lista = listas.find((l) => l.id === listaId);
    if (!lista) return;
    lista.items = lista.items.filter((i) => i.id !== itemId);
    lista.updatedAt = new Date().toISOString();
    await this._save(listas);
  }

  async _save(data) {
    if (!this.binId) {
      // Crear bin nuevo la primera vez
      const res = await fetch(API_URL, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("No se pudo crear el bin en JSONBin.io");
      const json = await res.json();
      this.binId = json.metadata.id;
      localStorage.setItem("binId", this.binId);
      console.log("Nuevo bin creado con ID:", this.binId);
    } else {
      // Actualizar bin existente
      const res = await fetch(`${API_URL}/${this.binId}`, {
        method: "PUT",
        headers: HEADERS,
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error("No se pudo actualizar el bin en JSONBin.io");
    }
  }
}
