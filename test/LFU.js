'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const LFU = require('../lib/eviction/LFU.js');

describe('LFU', () => {
  it('add/get flow with many values', () => {
    const lfu = new LFU(3);
    assert.equal(lfu.limit, 3);
    lfu.set(1, 1);
    lfu.set(2, 2);
    lfu.set(3, 3);
    assert.equal(lfu.get(2), 2);
    lfu.set(4, 4);
    assert.equal(lfu.get(1), undefined);
  });

  it('add/get flow with one update', () => {
    const lfu = new LFU(1);
    lfu.set(1, 1);
    lfu.set(1, 2);
    lfu.set(1, 3);
    assert.equal(lfu.get(1), 3);
    lfu.set(42, 'a');
    assert.equal(lfu.get(1), undefined);
    assert.equal(lfu.get(42), 'a');
  });

  it('add/get flow with one replace', () => {
    const lfu = new LFU(1);
    lfu.set(1, 1);
    assert.equal(lfu.get(1), 1);
    lfu.set(42, 'a');
    assert.equal(lfu.get(1), undefined);
    assert.equal(lfu.get(42), 'a');
  });

  it('add/get flow with many values mixed', () => {
    const lfu = new LFU(5);
    lfu.set(1, 1);
    lfu.set(2, 2);
    lfu.set(3, 3);
    lfu.set(2, 42);
    assert.equal(lfu.size, 3);
    assert.equal(lfu.get(2), 42);
    lfu.set(1, 433);
    lfu.set(2, 501);
    lfu.set(6, 6);
    lfu.set(6, 42);
    lfu.set(10, 'a');
    assert.equal(lfu.get(6), 42);
    assert.equal(lfu.size, 5);
    lfu.set('key', 'value');
    assert.equal(lfu.get(3), undefined);
    assert.equal(lfu.size, 5);
    assert.equal(lfu.get('key'), 'value');
    assert.equal(lfu.get(1), 433);
    assert.equal(lfu.get(2), 501);
    assert.equal(lfu.get(6), 42);
    assert.equal(lfu.get(10), 'a');
  });

  it('clear', () => {
    const lfu = new LFU(3);
    lfu.set(1, 1);
    lfu.set(1, 2);
    lfu.set(1, 3);
    lfu.clear();
    assert.equal(lfu.size, 0);
  });
});