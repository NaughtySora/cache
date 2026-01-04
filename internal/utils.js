'use strict';

const assert = {
  positiveInt(value) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('LRU requires a limit positive int parameter');
    }
  },
};

module.exports = { assert };
