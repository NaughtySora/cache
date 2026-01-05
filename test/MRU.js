'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const MRU = require('../lib/eviction/MRU.js');

describe('MRU', () => {
  it('add/get', () => {
    const cache = new MRU(3);
    assert.equal(cache.limit, 3);
    cache.set('a', 1);
    cache.set('b', 24);
    cache.set('c', 11);
    cache.set('b', 100);
    assert.equal(cache.get('b'), 100);
    cache.set('d', 333);
    assert.equal(cache.get('b'), undefined);
    assert.equal(cache.get('d'), 333);
    cache.set('v', 21);
    assert.equal(cache.size, 3);
    assert.equal(cache.get('d'), undefined);
    assert.equal(cache.get('a'), 1);
    assert.equal(cache.get('v'), 21);
    assert.equal(cache.get('c'), 11);
  });

  it('clear', () => {
    const cache = new MRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.clear();
    assert.equal(cache.size, 0);
    assert.equal(cache.get('b'), undefined);
  });
});