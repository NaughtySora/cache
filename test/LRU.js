'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { LRU } = require('../lib/eviction/LRU.js');

describe('LRU', () => {
  it('add/get', () => {
    const cache = new LRU(3);
    assert.equal(cache.limit, 3);
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

  it('evict', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.evict();
    assert.equal(cache.size, 2);
    assert.equal(cache.get('a'), undefined);
  });

  it('has', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    assert.equal(cache.has('a'), true);
    cache.evict();
    assert.equal(cache.size, 2);
    assert.equal(cache.has('b'), false);
    assert.equal(cache.get('b'), undefined);
  });

  it('peek', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    assert.equal(cache.peek('a'), true);
    cache.evict();
    assert.equal(cache.peek('a'), false);
    assert.equal(cache.size, 2);
    assert.equal(cache.get('a'), undefined);
  });

  it('delete', () => {
    const cache = new LRU(3);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.delete('b');
    cache.delete('g');
    assert.equal(cache.size, 2);
    assert.equal(cache.get('b'), undefined);
  });
});