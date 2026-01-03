'use strict';

const cache = () => ({ _store: {}, set() { }, get() { } });
const storage = () => ({ _store: {}, set() { }, get() { } });

class Entity {
  #name;
  #sql;
  #cache = null;
  #connection = null;

  constructor(name) {
    this.#name = name;
    this.#sql = ``;
    this.#cache = cache();
    this.#connection = storage();
  }

  findOne(key) {
    const data = this.#cache.get(key);
    if (data !== undefined) return data;
    const fresh = this.#connection.get(key);
    if (fresh === undefined) return fresh;
    this.#cache.set(key, data);
    return fresh;
  }
}

// user land
// const { Entity } = require('some-library');

const post = new Entity('post');
const data = post.findOne('12355');