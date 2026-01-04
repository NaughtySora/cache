'use strict';

const { assert } = require("../../internal/utils.js");
const DLL = require('../../internal/DLL.js');

class LFU {
  #store = new Map();
  #list = new Map();
  #min = Infinity;
  #limit = 0;

  constructor(limit) {
    assert.positiveInt(limit);
    this.#limit = limit;
  }

  #put(payload) {
    const freq = payload.freq;
    const list = this.#list.get(freq);
    this.#min = Math.min(this.#min, freq);
    if (list) return list.unshift(payload);
    const dll = new DLL();
    const node = dll.unshift(payload);
    this.#list.set(freq, dll);
    return node;
  }

  #update(key, value) {
    const node = this.#store.get(key);
    this.#list.get(node.value.freq).detach(node);
    node.value.value = value;
    node.value.freq++;
    this.#put(node.value);
  }

  #touch(node) {
    this.#list.get(node.value.freq).detach(node);
    node.value.freq++;
    this.#put(node.value);
  }

  #insert(key, value) {
    const store = this.#store;
    if (store.size >= this.#limit) {
      const node = this.#list.get(this.#min).pop();
      store.delete(node.value.key);
    }
    const node = { value, key, freq: 1, };
    store.set(key, this.#put(node));
  }

  set(key, value) {
    if (this.#store.has(key)) this.#update(key, value);
    else this.#insert(key, value);
  }

  get(key) {
    const node = this.#store.get(key);
    if (node === undefined) return;
    this.#touch(node);
    return node.value.value;
  }

  clear() {
    this.#store.clear();
    this.#list.clear();
  }

  get size() {
    return this.#store.size;
  }

  get limit() {
    return this.#limit;
  }
}

module.exports = LFU;