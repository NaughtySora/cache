'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const LRU = require('../lib/eviction/LRU.js');

describe('LRU', () => {

  it('add/get', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 24);
    cache.set('c', 11);
    assert.equal(cache.get('b'), 24);
    cache.set('b', 42);
    assert.equal(cache.get('b'), 42);
    assert.equal(cache.get('a'), 1);
    cache.set('d', 55);
    assert.equal(cache.size, 3);
    assert.equal(cache.get('a'), 1);
    assert.equal(cache.get('c'), undefined);
  });

  it('clear', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.clear();
    assert.equal(cache.size, 0);
    assert.equal(cache.get('b'), undefined);
  });

});