'use strict';

// Refresh-Ahead
// Stale-While-Revalidate
// Write Coalescing
// Negative Caching

/**
 * @description Cache-Aside
 */
{
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
}

/**
 * @description Write-Through
 */
{
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
}

/**
 * @description Write-behind
 */
{
  const storage = new Map();
  const cache = new Map();
  const queue = new Queue(10, ({ id, data }) => storage.set(id, data));

  class Queue {
    #store = [];
    #threshold = 0;
    #limit = 0;
    #job = Queue.#notImplJob;

    constructor(limit, job) {
      this.#limit = limit;
      this.#job = job;
    }

    async #flush() {
      const promises = [];
      while (this.#store.length > 0) {
        promises.push(this.#job(this.#store.pop()));
      }
      await Promise.all(promises);
    }

    async push(data) {
      if (this.#threshold === this.#limit) {
        await this.#flush();
      }
      this.#store.push(data);
    }

    static async #notImplJob() {
      throw new Error('Queue job isn\'t implemented');
    }
  }

  const api = {
    async write(id, data) {
      cache.set(id, data);
      await queue.push({ id, data });
    },
    read(id) {
      return cache.get(id);
    },
  };

}

/**
 * @description Read-Through
 */
{
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
}

/**
 * @description Refresh-Ahead
 */
{
  const storage = new Map();
  const cache = new Map();
  const api = {
    ttl: 5000,
    threshold: 2500,
    write(key, data) {
      const ttl = this.ttl;
      storage.set(key, data);
      cache.set(key, { data, expires: Date.now() + ttl });
    },
    refresh(key) {
      const ttl = this.ttl;
      const fresh = storage.get(key);
      cache.set(key, { data: fresh, expires: Date.now() + ttl });
      return fresh;
    },
    read(key) {
      const { data, expires } = cache.get(key);
      if (data === undefined) return this.refresh(key);
      if ((expires - Date.now()) < this.threshold) {
        return this.refresh(key);
      }
      return data;
    }
  };
}

/**
 * @description Stale-While-Revalidate
 */

{
  
}