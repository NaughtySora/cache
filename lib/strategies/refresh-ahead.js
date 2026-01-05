'use strict';

const storage = new Map();
const cache = new Map();

const TTL = 5000;
const THRESHOLD = 2500;

const expires = () => Date.now() + TTL;

const api = {
  write(key, data) {
    storage.set(key, data);
    cache.set(key, { data, expires: expires() });
  },
  refresh(key) {
    const fresh = storage.get(key);
    cache.set(key, { data: fresh, expires: expires() });
    return fresh;
  },
  read(key) {
    const data = cache.get(key);
    if (data === undefined) return this.refresh(key);
    if ((data.expires - Date.now()) < THRESHOLD) {
      return this.refresh(key);
    }
    return data.data;
  }
};
