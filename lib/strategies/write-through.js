'use strict';

const storage = new Map();
const cache = new Map();

const api = {
  write(id, data) {
    cache.set(id, data);
    storage.set(id, data);
  },
  read(id) {
    const entity = cache.get(id);
    if (entity !== undefined) return entity;
    return storage.get(id);
  },
};
