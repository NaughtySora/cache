'use strict';

const storage = new Map();
const cache = new Map();
const queue = new Queue(10, ({ key, data }) => storage.set(key, data));

/**
 * the queue refresh strategy can be any
 * timeout / threshold / async queue
 */

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
    const copy = this.#store.slice(0);
    while (copy.length > 0) {
      promises.push(this.#job(copy.pop()));
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
  async write(key, data) {
    cache.set(key, data);
    await queue.push({ key, data });
  },
  read(key) {
    return cache.get(key);
  },
};
