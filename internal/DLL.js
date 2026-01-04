'use strict';

class DLL {
  #head = null;
  #tail = null;

  #unshift(node) {
    if (this.#head === null) {
      return this.#head = this.#tail = node;
    }
    const next = this.#head;
    this.#head = node;
    node.next = next;
    next.prev = node;
    return node;
  }

  unshift(value) {
    return this.#unshift({ value, next: null, prev: null });
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

  attach(node) {
    return this.#unshift(node);
  }

  get isEmpty() {
    return this.#head === null;
  }
}

module.exports = DLL;