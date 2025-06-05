export default class StorageInterface {
  async getAll() {
    throw new Error("getAll not implemented");
  }
  async get(id) {
    throw new Error("get not implemented");
  }
  async create(data) {
    throw new Error("create not implemented");
  }
  async update(id, data) {
    throw new Error("update not implemented");
  }
  async delete(id) {
    throw new Error("delete not implemented");
  }
}
