'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const SegmentedLRU = require('../lib/eviction/SegmentedLRU.js');

describe('SegmentedLRU', () => {
  it('initialization', () => {
    const cache = new SegmentedLRU(10);
    assert.equal(cache.size, 0);
    assert.equal(cache.limit, 10);
  });

  it('basic use', () => {
    const cache = new SegmentedLRU(5);
    assert.equal(cache.size, 0);
    assert.equal(cache.limit, 5);
    cache.set(1, 1);
    assert.equal(cache.get(1), 1);
    assert.equal(cache.size, 1);
    cache.set(2, 2);
    assert.equal(cache.get(2), 2);
    assert.equal(cache.size, 2);
    cache.set(2, 4);
    assert.equal(cache.get(2), 4);
    assert.equal(cache.size, 2);
    cache.set(3, 3);
    cache.set(2, 2);
    cache.set(4, 4);
    cache.set(5, 5);
    assert.equal(cache.size, 3);
    cache.set(3, 5);
    cache.get(3);
    cache.set(4, 6);
    cache.set(4, 7);
    cache.set(3, 8);
    cache.get(3);
    cache.set(10, 12);
    cache.get(10);
    assert.equal(cache.size, 5);
    cache.clear();
    assert.equal(cache.size, 0);
  });
});