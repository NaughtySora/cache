'use strict';

const { LRU } = require('./LRU.js');
const { assert } = require('../../internal/utils.js');

class ARC {
  #recent = null;
  #frequent = null;
  #ghostRecent = null;
  #ghostFrequent = null;
  #limit = 0;

  constructor(limit) {
    assert.positiveInt(limit);
    this.#limit = limit;
    this.#recent = new LRU(limit);
    this.#frequent = new LRU(limit);
    this.#ghostRecent = new LRU(limit);
    this.#ghostFrequent = new LRU(limit);
  }

  #demote() {
    const node = this.#frequent.detach();
    this.#recent.set(node.key, node.value);
  }

  set(key, value) {
    if (this.#frequent.peek(key)) {
      return void this.#frequent.set(key, value);
    }
    if (this.#recent.peek(key)) {
      this.#recent.delete(key);
      if (this.#frequent.full) this.#demote();
      return void this.#frequent.set(key, value);
    }
    // on miss
    // 1. no entry found, insert into T1
    // 2. ghostRecent has the key, move value into frequent
    // 3. ghostFrequent has the key, move value into frequent
  }

  get(key) { }

}

module.exports = ARC;