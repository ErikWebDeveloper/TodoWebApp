import StorageInterface from "./storageInterface";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default class FirestoreProvider extends StorageInterface {
  constructor(firebaseApp) {
    super();
    this.db = getFirestore(firebaseApp);
    this.binsCollection = collection(this.db, "listas");
  }

  async getAll() {
    const snapshot = await getDocs(this.binsCollection);
    const listas = [];
    snapshot.forEach((doc) => listas.push(doc.data()));
    return listas;
  }

  async get(id) {
    const ref = doc(this.db, "listas", id);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async create({ nombre }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const nuevaLista = {
      id,
      nombre,
      createdAt: now,
      updatedAt: now,
      items: [],
    };
    await setDoc(doc(this.db, "listas", id), nuevaLista);
    return nuevaLista;
  }

  async update(id, newData) {
    const ref = doc(this.db, "listas", id);
    const now = new Date().toISOString();
    await updateDoc(ref, { ...newData, updatedAt: now });
    const updatedDoc = await getDoc(ref);
    return updatedDoc.data();
  }

  async delete(id) {
    await deleteDoc(doc(this.db, "listas", id));
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
    await setDoc(doc(this.db, "listas", listaId), lista);
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
    await setDoc(doc(this.db, "listas", listaId), lista);
    return lista.items[index];
  }

  async reorderItems(listaId, itemId, direccion) {
    const lista = await this.get(listaId);
    if (!lista) return null;
    const items = [...lista.items];
    const index = items.findIndex((i) => i.id === itemId);
    const swapIndex = direccion === "arriba" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[swapIndex];
    items[swapIndex] = temp;

    const now = new Date().toISOString();
    items.forEach((item, i) => {
      item.orden = i;
      item.updatedAt = now;
    });

    lista.items = items;
    lista.updatedAt = now;
    await setDoc(doc(this.db, "listas", listaId), lista);
    return lista;
  }

  async deleteItem(listaId, itemId) {
    const lista = await this.get(listaId);
    if (!lista) return;
    lista.items = lista.items.filter((i) => i.id !== itemId);
    lista.updatedAt = new Date().toISOString();
    await setDoc(doc(this.db, "listas", listaId), lista);
  }
}
