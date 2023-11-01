class BlockStore {
  store;
  constructor() {
    this.store = new Map();
  }

  init(blocks) {
    blocks?.forEach(block => {
      const { businessId, schema } = block;
      try { this.store.set(`${businessId}`, JSON.parse(schema));} catch (e) { console.log("block parse error>>>", schema) }
    });
  }

  set(id, snippets) {
    this.store.set(id, snippets);
  }

  get(id) {
    return this.store.get(id);
  }

}

const singleton = new BlockStore();

export default singleton;
