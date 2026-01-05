'use strict';

const { assert } = require('../../internal/utils.js');
const { LRU } = require('./LRU.js');

class SegmentedLRU {
  #ratio = 0.8;
  #prohibition = null;
  #protected = null;

  constructor(size) {
    assert.positiveInt(size);
    const large = (size * this.#ratio) >> 0;
    this.#prohibition = new LRU(size - large);
    this.#protected = new LRU(large);
  }

  set(key, value) {

  }

  get(key) {

  }

  clear() {

  }

  get size() {

  }

  get limit() {

  }

}

module.exports = SegmentedLRU;