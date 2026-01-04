'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const LFU = require('../lib/eviction/LFU.js');

describe('LFU', () => {
  it('add/get', () => {
    const lfu = new LFU(3);
    lfu.set(1, 5);
    lfu.set(1, 25);
    lfu.set(1, 255);
  });

  it('clear', () => { });
});