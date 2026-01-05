'use strict';

const storage = new Map();
const cache = new Map();

const api = {
  write(id, data) {
    cache.delete(id);
    storage.set(id, data);
  },
  read(id) {
    const entity = cache.get(id);
    if (entity !== undefined) return entity;
    const fresh = storage.get(id);
    if (fresh !== undefined) cache.set(id, fresh);
    return fresh;
  },
};
