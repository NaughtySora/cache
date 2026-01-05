'use strict';

const assert = {
  positiveInt(value) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('positive integer is required');
    }
  },
};

module.exports = { assert };
