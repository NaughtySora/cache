'use strict';

const { assert } = require('../../internal/utils.js');
const { LRU } = require('./LRU.js');

class SegmentedLRU {
  #ratio = 0.8;
  #probationary = null;
  #protected = null;

  constructor(size) {
    assert.positiveInt(size);
    const large = (size * this.#ratio) >> 0;
    this.#probationary = new LRU((size - large) >> 0);
    this.#protected = new LRU(large);
  }

  #demote() {
    const node = this.#protected.detach();
    this.#probationary.set(node.key, node.value);
  }

  set(key, value) {
    if (this.#protected.has(key)) {
      return void this.#protected.set(key, value);
    }
    if (this.#probationary.has(key)) {
      this.#probationary.delete(key);
      if (this.#protected.full) this.#demote();
    }
    this.#probationary.set(key, value);
  }

  get(key) {
    const node = this.#protected.get(key, value);
    if (node !== undefined) return node.value;
    const weak = this.#probationary.get(key);
    if (weak === undefined) return;
    this.#probationary.delete(weak.key);
    if (this.#protected.full) this.#demote();
    this.#protected.set(weak.key, weak.value);
    return weak.value;
  }

  clear() {
    this.#probationary.clear();
    this.#protected.clear();
  }

  get size() {
    return [this.#probationary.size, this.#protected.size];
  }

  get limit() {
    return [this.#probationary.limit, this.#protected.limit];
  }
}

module.exports = SegmentedLRU;