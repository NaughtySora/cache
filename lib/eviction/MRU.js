'use strict';

const { LRU, lookUp } = require('./LRU.js');

class MRU extends LRU {
  set(key, value) {
    const store = lookUp.store(this);
    const list = lookUp.list(this);
    if (store.has(key)) {
      const node = store.get(key);
      list.detach(node);
      node.value.value = value;
      list.unshift(node.value);
    } else {
      if (store.size >= this.limit) store.delete(list.shift().key);
      const node = list.unshift({ key, value });
      store.set(key, node);
    }
  }
}

module.exports = MRU;