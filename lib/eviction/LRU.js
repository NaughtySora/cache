'use strict';

const { assert } = require("../../internal/utils.js");
const DLL = require("../../internal/DLL.js");

class LRU {
  #list = new DLL();
  #store = new Map();
  #limit = 0;

  constructor(limit) {
    assert.positiveInt(limit);
    this.#limit = limit;
  }

  set(key, value) {
    const store = this.#store;
    const list = this.#list;
    const exists = store.has(key);
    if (!exists && store.size >= this.#limit) {
      const { key } = list.pop();
      store.delete(key);
    }
    if (exists) {
      const node = store.get(key);
      list.detach(node);
      node.value.value = value;
      list.unshift(node.value);
    } else {
      const node = list.unshift({ key, value });
      store.set(key, node);
    }
  }

  get(key) {
    const node = this.#store.get(key);
    if (node) {
      this.#list.detach(node);
      this.#list.unshift(node.value);
      return node.value.value;
    }
  }

  clear() {
    this.#list.clear();
    this.#store.clear();
  }

  get size() {
    return this.#store.size;
  }

  get limit() {
    return this.#limit;
  }
}

module.exports = LRU;