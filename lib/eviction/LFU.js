'use strict';

const { assert } = require("../../internal/utils.js");
const DLL = require('../../internal/DLL.js');

class LFU {
  #store = new Map();
  #list = new Map();
  #min = Infinity;
  #node = null;
  #limit = 0;

  constructor(limit) {
    assert.positiveInt(limit);
    this.#limit = limit;
  }

  #next(node) {
    const min = Math.min(this.#min, node.value.freq);
    if (min >= this.#min) return;
    this.#min = min;
    this.#node = node;
  }

  #attach(node) {
    const freq = node.value.freq;
    const list = this.#list.get(freq);
    this.#next(node);
    if (list) return list.attach(node);
    const dll = new DLL();
    dll.attach(node);
    this.#list.set(freq, dll);
  }

  #detach(node) {
    const freq = node.value.freq;
    const list = this.#list.get(freq);
    list.detach(node);
    if (list.isEmpty) this.#list.delete(freq);
  }

  #update(key, value) {
    const node = this.#store.get(key);
    this.#detach(node);
    node.value.value = value;
    node.value.freq++;
    this.#attach(node);
  }

  #touch(node) {
    this.#detach(node);
    node.value.freq++;
    this.#attach(node);
  }

  #evict() {
    const node = this.#node;
    const freq = node.value.freq;
    const list = this.#list.get(freq);
    list.detach(node);
    if (list.isEmpty) this.#list.delete(freq);
    this.#store.delete(node.value.key);
  }

  #insert(key, value) {
    const store = this.#store;
    if (store.size >= this.#limit) this.#evict();
    this.#attach({
      value: { value, key, freq: 1, },
      next: null,
      prev: null,
    });
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