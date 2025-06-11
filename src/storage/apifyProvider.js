import StorageInterface from "./storageInterface";
import { v4 as uuidv4 } from "uuid";

const BASE_URL = "https://api.apify.com/v2/key-value-stores";

export default class ApifyProvider extends StorageInterface {
  constructor(apiToken) {
    super();
    this.apiToken = apiToken;
    this.storeId = localStorage.getItem("apifyStoreId") || null;
    this.recordsMap = JSON.parse(
      localStorage.getItem("apifyRecordsMap") || "{}"
    );
  }

  async initialize() {
    if (this.storeId) return;

    const response = await fetch(`${BASE_URL}?token=${this.apiToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "MyListAppStore" }),
    });

    const data = await response.json();
    this.storeId = data.data.id;
    localStorage.setItem("apifyStoreId", this.storeId);
  }

  _saveMap() {
    localStorage.setItem("apifyRecordsMap", JSON.stringify(this.recordsMap));
  }

  async getAll() {
    const listas = [];
    for (const id in this.recordsMap) {
      const data = await this.get(id);
      if (data) listas.push(data);
    }
    return listas;
  }

  async get(id) {
    const recordKey = this.recordsMap[id];
    if (!recordKey) return null;

    const response = await fetch(
      `${BASE_URL}/${this.storeId}/records/${recordKey}?token=${this.apiToken}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    return data;
  }

  async create({ nombre }) {
    await this.initialize();
    const id = uuidv4();
    const now = new Date().toISOString();
    const lista = {
      id,
      nombre,
      createdAt: now,
      updatedAt: now,
      items: [],
    };

    const response = await fetch(
      `${BASE_URL}/${this.storeId}/records/${id}?token=${this.apiToken}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lista),
      }
    );

    if (!response.ok) throw new Error("No se pudo crear la lista en Apify");

    this.recordsMap[id] = id;
    this._saveMap();

    return lista;
  }

  async update(id, newData) {
    const old = await this.get(id);
    if (!old) return null;

    const updated = {
      ...old,
      ...newData,
      updatedAt: new Date().toISOString(),
    };

    await fetch(
      `${BASE_URL}/${this.storeId}/records/${id}?token=${this.apiToken}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }
    );

    return updated;
  }

  async delete(id) {
    if (!this.recordsMap[id]) return;

    await fetch(
      `${BASE_URL}/${this.storeId}/records/${id}?token=${this.apiToken}`,
      {
        method: "DELETE",
      }
    );

    delete this.recordsMap[id];
    this._saveMap();
  }

  async addItem(listaId, contenido) {
    const lista = await this.get(listaId);
    if (!lista) return null;

    const now = new Date().toISOString();
    const newItem = {
      id: uuidv4(),
      contenido,
      orden: lista.items?.length || 0,
      createdAt: now,
      updatedAt: now,
    };

    lista.items.push(newItem);
    lista.updatedAt = now;

    await this.update(listaId, lista);
    return newItem;
  }

  async updateItem(
    listaId,
    itemId,
    contenido,
    nuevoOrden = null,
    completado = null
  ) {
    const lista = await this.get(listaId);
    if (!lista) return null;

    const index = lista.items.findIndex((i) => i.id === itemId);
    if (index === -1) return null;

    lista.items[index] = {
      ...lista.items[index],
      contenido,
      orden: nuevoOrden !== null ? nuevoOrden : lista.items[index].orden,
      updatedAt: new Date().toISOString(),
      ...(completado !== null && { completado }),
    };

    lista.updatedAt = new Date().toISOString();
    await this.update(listaId, lista);
    return lista.items[index];
  }

  async reorderItems(listaId, itemId, direccion) {
    const lista = await this.get(listaId);
    if (!lista) return null;

    const items = [...lista.items];
    const index = items.findIndex((i) => i.id === itemId);
    const swapIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];

    const now = new Date().toISOString();
    items.forEach((item, i) => {
      item.orden = i;
      item.updatedAt = now;
    });

    lista.items = items;
    lista.updatedAt = now;
    await this.update(listaId, lista);
    return lista;
  }

  async deleteItem(listaId, itemId) {
    const lista = await this.get(listaId);
    if (!lista) return;

    lista.items = lista.items.filter((i) => i.id !== itemId);
    lista.updatedAt = new Date().toISOString();

    await this.update(listaId, lista);
  }
}
