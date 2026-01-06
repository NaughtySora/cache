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

  shift() {
    if (this.#head === null) return;
    const head = this.#head;
    this.#head = head.next;
    if (head.next !== null) head.next.prev = null;
    if (this.#head === null) this.#tail = null;
    return head.value;
  }

  pop() {
    if (this.#head === null) return;
    const tail = this.#tail;
    this.#tail = tail.prev;
    if (tail.prev !== null) tail.prev.next = null;
    if (this.#tail === null) this.#head = null;
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

  makeFirst(node) {
    this.detach(node);
    this.#unshift(node);
  }

  get isEmpty() {
    return this.#head === null;
  }

  [Symbol.iterator]() {
    let pointer = this.#head;
    return {
      next() {
        if (pointer === null) return { done: true };
        const next = { value: pointer.value, done: false };
        pointer = pointer.next;
        return next;
      }
    }
  }
}

module.exports = DLL;