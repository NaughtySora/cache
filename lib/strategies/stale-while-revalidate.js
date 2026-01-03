'use strict';

const TTL = 5000;
const expires = () => Date.now() + TTL;

const storage = new Map();
const cache = new Map();

const queue = new Queue(20, (key) => {
  const data = storage.get(key);
  cache.set(key, { data, expires: expires() });
});



/**
 * the queue refresh strategy can be any
 * timeout / threshold / async queue
 */
class Queue {
  #store = [];
  #ms = 0;
  #job = Queue.#notImplJob;

  constructor(every, job) {
    this.#ms = every;
    this.#job = job;
    this.#init();
  }

  async #init() {
    const timer = setTimeout(async () => {
      const copy = this.#store.slice(0);
      const promises = [];
      while (copy.length > 0) {
        promises.push(this.#job(copy.pop()));
      }
      await Promise.all(promises);
      timer.refresh();
    }, this.#ms);
  }

  push(data) {
    this.#store.push(data);
  }

  static async #notImplJob() {
    throw new Error('Queue job isn\'t implemented');
  }
}

const api = {
  write(key, data) {
    storage.set(key, data);
    cache.set(key, { data, expired: expires() });
  },
  read(key) {
    const data = cache.get(key);
    if (data === undefined) {
      const data = storage.get(key);
      cache.set(key, { data, expired: expires() });
      return data;
    }
    if ((data.expires - Date.now()) > 0) return data.data;
    queue.push(key);
    return data.data;
  },
}
