'use strict';

/**
 * Also could be adjusted DLL
 */

class DLL {
  #head = null;
  #tail = null;

  unshift(value) {
    const node = { value, next: null, prev: null };
    if (this.#head === null) {
      return this.#head = this.#tail = node;
    }
    const next = this.#head;
    this.#head = node;
    node.next = next;
    next.prev = node;
    return node;
  }

  pop() {
    if (this.#head === null) return;
    const tail = this.#tail;
    this.#tail = tail.prev;
    if (tail === this.#head) this.#head = null;
    return tail.value;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
  }

  detach(node) {
    const next = node.next;
    const prev = node.prev;
    if (next) next.prev = prev;
    if (prev) prev.next = next;
    if (node === this.#tail) this.#tail = node.prev;
    if (node === this.#head) this.#head = node.next;
    node.next = null;
    node.prev = null;
  }
}

class LRU {
  #list = new DLL();
  #store = new Map();
  #limit = 0;

  constructor(limit) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error('LRU requires a limit positive int parameter');
    }
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