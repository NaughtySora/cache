'use strict';
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const DLL = require('../internal/DLL.js');

describe('DLL', () => {
  it('Iterator', () => {
    const list = new DLL();
    list.unshift(3);
    list.unshift(2);
    list.unshift(1);
    assert.deepEqual([...list], [1, 2, 3]);
  });

  it('shift/unshift', () => {
    const list = new DLL();
    list.unshift(3);
    list.unshift(2);
    list.unshift(1);
    assert.deepEqual([...list], [1, 2, 3]);
    list.shift();
    assert.deepEqual([...list], [2, 3]);
    list.shift();
    assert.deepEqual([...list], [3]);
    list.shift();
    assert.deepEqual([...list], []);
    list.shift();
    assert.deepEqual([...list], []);
  });

  it('pop', () => {
    const list = new DLL();
    list.unshift(3);
    list.unshift(2);
    list.unshift(1);
    assert.deepEqual([...list], [1, 2, 3]);
    list.pop();
    assert.deepEqual([...list], [1, 2]);
    list.pop();
    assert.deepEqual([...list], [1]);
    list.pop();
    assert.deepEqual([...list], []);
    list.pop();
    assert.deepEqual([...list], []);
  });

  it('detach', () => {
    const list = new DLL();
    const n1 = list.unshift(3);
    const n2 = list.unshift(2);
    const n3 = list.unshift(1);
    list.detach(n2);
    assert.deepEqual([...list], [1, 3]);
    list.detach(n3);
    assert.deepEqual([...list], [3]);
    list.detach(n1);
    assert.deepEqual([...list], []);
    list.detach(n2);
    assert.deepEqual([...list], []);
  });

  it('attach', () => {
    const list = new DLL();
    const n1 = list.unshift(3);
    list.unshift(2);
    const n3 = list.unshift(1);
    list.detach(n1);
    assert.deepEqual([...list], [1, 2]);
    list.attach(n1);
    assert.deepEqual([...list], [3, 1, 2]);
    list.detach(n1);
    assert.deepEqual([...list], [1, 2]);
    list.attach(n1);
    assert.deepEqual([...list], [3, 1, 2]);
    list.detach(n3);
    assert.deepEqual([...list], [3, 2]);
  });
});