'use strict';

const { assert } = require("../../internal/utils.js");
const DLL = require('../../internal/DLL.js');

class LFU {
  #cache = [];
  #store = new Map();
  #list = new Map();
  #min = Infinity;
  #limit = 0;

  constructor(limit) {
    assert.positiveInt(limit);
    this.#limit = limit;
  }

  #attach(node) {
    const freq = node.value.freq;
    this.#min = Math.min(this.#min, freq);
    const list = this.#list.get(freq);
    if (list) return list.attach(node);
    const dll = this.#cache.pop() ?? new DLL();
    dll.attach(node);
    this.#list.set(freq, dll);
  }

  #detach(node) {
    const freq = node.value.freq;
    const list = this.#list.get(freq);
    list.detach(node);
    if (!list.isEmpty) return;
    if (this.#min === freq) this.#min++;
    this.#list.delete(freq);
    this.#cache.push(list);
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
    const list = this.#list.get(this.#min);
    const node = list.pop();
    this.#store.delete(node.key);
    if (!list.isEmpty) return;
    this.#list.delete(this.#min);
    this.#cache.push(list);
  }

  #insert(key, value) {
    if (this.#store.size >= this.#limit) this.#evict();
    const node = {
      value: { value, key, freq: 1, },
      next: null,
      prev: null,
    };
    this.#attach(node);
    this.#store.set(key, node);
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
    this.#cache.length = 0;
    this.#min = Infinity;
  }

  get size() {
    return this.#store.size;
  }

  get limit() {
    return this.#limit;
  }
}

module.exports = LFU;