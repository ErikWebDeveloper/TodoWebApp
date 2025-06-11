import StorageInterface from "./storageInterface";

const API_URL = "https://api.jsonbin.io/v3/b";


export default class JsonBinProvider extends StorageInterface {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.bins = JSON.parse(localStorage.getItem("userBins") || "{}");

    this.HEADERS = {
      "Content-Type": "application/json",
      "X-Master-Key": this.apiKey,
    };

    // Si está vacío, intenta reconstruirlo desde el backend
    if (Object.keys(this.bins).length === 0) {
      //this.initialize();
    }
  }

  async initialize() {
    try {
      const res = await fetch(`${API_URL}`, {
        headers: this.HEADERS,
      });

      if (!res.ok) throw new Error("No se pudieron listar los bins");

      const json = await res.json();

      // Esto contiene todos los bins disponibles
      const binList = json.records;

      const newMap = {};

      for (const bin of binList) {
        const binId = bin.metadata.id;

        const binRes = await fetch(`${API_URL}/${binId}/latest`, {
          headers: this.HEADERS,
        });

        if (!binRes.ok) continue;

        const binData = await binRes.json();
        const internalId = binData.record?.id;

        if (internalId) {
          newMap[internalId] = binId;
        }
      }

      this.bins = newMap;
      this._saveLocal();
    } catch (err) {
      console.error("Error inicializando bins desde JSONBin:", err);
    }
  }

  _saveLocal() {
    localStorage.setItem("userBins", JSON.stringify(this.bins));
  }

  async getAll() {
    const result = [];
    for (const id in this.bins) {
      const lista = await this.get(id);
      if (lista) result.push(lista);
    }
    return result;
  }

  async get(id) {
    const binId = this.bins[id];
    if (!binId) return null;

    const res = await fetch(`${API_URL}/${binId}/latest`, {
      headers: this.HEADERS,
    });
    if (!res.ok) return null;

    const json = await res.json();
    return json.record;
  }

  async create({ nombre, isPublic = false }) {
    const now = new Date().toISOString();
    const newLista = {
      id: crypto.randomUUID(),
      nombre,
      createdAt: now,
      updatedAt: now,
      items: [],
    };

    const headers = {
      ...this.HEADERS,
      ...(isPublic ? { "X-Bin-Private": "false" } : {}),
      "X-Bin-Name": nombre,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(newLista),
    });

    if (!res.ok) throw new Error("No se pudo crear el bin");

    const json = await res.json();
    const binId = json.metadata.id;

    this.bins[newLista.id] = binId;
    this._saveLocal();

    return newLista;
  }

  async update(id, newData) {
    const lista = await this.get(id);
    if (!lista) return null;

    const updatedLista = {
      ...lista,
      ...newData,
      updatedAt: new Date().toISOString(),
    };

    await this._saveBin(id, updatedLista);
    return updatedLista;
  }

  async delete(id) {
    const binId = this.bins[id];
    if (!binId) return;

    const res = await fetch(`${API_URL}/${binId}`, {
      method: "DELETE",
      headers: this.HEADERS,
    });

    if (!res.ok) throw new Error("No se pudo eliminar el bin");

    delete this.bins[id];
    this._saveLocal();
  }

  async addItem(listaId, contenido) {
    const lista = await this.get(listaId);
    if (!lista) return null;

    const now = new Date().toISOString();
    const newItem = {
      id: crypto.randomUUID(),
      contenido,
      orden: lista.items?.length || 0,
      createdAt: now,
      updatedAt: now,
    };

    lista.items.push(newItem);
    lista.updatedAt = now;

    await this._saveBin(listaId, lista);
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

    await this._saveBin(listaId, lista);
    return lista.items[index];
  }

  async reorderItems(listaId, itemId, direccion) {
    const lista = await this.get(listaId);
    if (!lista) return null;

    const items = [...lista.items];

    const index = items.findIndex((i) => i.id === itemId);
    if (index === -1) return;

    const swapIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    // Intercambia las posiciones
    const temp = items[index];
    items[index] = items[swapIndex];
    items[swapIndex] = temp;

    // Reasigna orden según posición
    const now = new Date().toISOString();
    items.forEach((item, i) => {
      item.orden = i;
      item.updatedAt = now;
    });

    lista.items = items;
    lista.updatedAt = now;

    await this._saveBin(listaId, lista);
    return lista;
  }

  async deleteItem(listaId, itemId) {
    const lista = await this.get(listaId);
    if (!lista) return;

    lista.items = lista.items.filter((i) => i.id !== itemId);
    lista.updatedAt = new Date().toISOString();

    await this._saveBin(listaId, lista);
  }

  async _saveBin(id, data) {
    const binId = this.bins[id];
    if (!binId) throw new Error("Bin no encontrado");

    const res = await fetch(`${API_URL}/${binId}`, {
      method: "PUT",
      headers: this.HEADERS,
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("No se pudo guardar en el bin");
  }
}
