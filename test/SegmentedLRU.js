'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const SegmentedLRU = require('../lib/eviction/SegmentedLRU.js');

describe('SegmentedLRU', () => {
  it('constructor', () => {
    const cache = new SegmentedLRU(10);
    assert.deepEqual(cache.size, [0, 0]);
    assert.deepEqual(cache.limit, [2, 8]);
  });
});