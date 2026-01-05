'use strict';

const TTL = 5000;
const NULL_TTL = 300;

const expires = (ttl = TTL) => Date.now() + ttl;

const storage = new Map();
const cache = new Map();

const api = {
  write(key, data) {
    storage.set(key, data);
    cache.set(key, { data, expires: expires() });
  },
  read(key) {
    const data = cache.get(key);
    if (data !== undefined) return data.data;
    const fresh = storage.get(key);
    if (fresh === undefined) {
      cache.set(key, { data: null, expires: expires(NULL_TTL) });
      return null;
    }
    return fresh;
  }
};
