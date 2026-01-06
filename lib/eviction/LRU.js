'use strict';

const { assert } = require("../../internal/utils.js");
const DLL = require("../../internal/DLL.js");

let lookUp = null;

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
    if (store.has(key)) {
      const node = store.get(key);
      list.detach(node);
      node.value.value = value;
      list.unshift(node.value);
    } else {
      if (this.full) store.delete(list.pop().key);
      const node = list.unshift({ key, value });
      store.set(key, node);
    }
  }

  get(key) {
    const node = this.#store.get(key);
    if (node === undefined) return;
    this.#list.detach(node);
    this.#list.unshift(node.value);
    return node.value.value;
  }

  clear() {
    this.#list.clear();
    this.#store.clear();
  }

  evict() {
    this.detach();
  }

  detach() {
    const node = this.#list.pop();
    this.#store.delete(node.key);
    return node;
  }

  delete(key) {
    const node = this.#store.get(key);
    if (node === undefined) return;
    this.#list.detach(node);
  }

  get size() {
    return this.#store.size;
  }

  get limit() {
    return this.#limit;
  }

  get full() {
    return this.size >= this.#limit;
  }

  static {
    lookUp = Object.create(null);
    lookUp.list = list => list.#list;
    lookUp.store = list => list.#store;
  }
}

module.exports = { LRU, lookUp };