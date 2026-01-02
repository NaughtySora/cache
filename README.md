# Cache

## Kinds
- browser (Cache-Control, ETag, Last-Modified)
- cdn
- application (LRU, Redis...)
- database (Query cache, Buffer pool)

## Strategies

#### Cache-Aside
- reads from cache, misses, read from source, write to cache and return data
- on write invalidates cache or updates it
- simple, cold start, stale reads
- good for heave reads, system that can stand stale data
*can/should be combined with cache ttl to refresh stale cache periodically*

#### Write-Through
- on write update cache, write to datasource.
- cache fresh, simple reads, latency for writes
- good consistency
*careful with errors writing to cache first, can lose data*

#### Write-behind
- on write update cache, put data into some stash
- queue/timeout/threshold the stash and batch all the data into datasource
- possible data loss, hard recovery
- good for non critical data, analytics

#### Read-Through
- cache fetches data itself on miss
- centralized logic
- complex cache logic
- logically acts as Cache-Aside, but the responsibility for polling data is on cache entity
which sounds pretty bad first, but conceptually some internal library uses layered "good structure"
and exposes for user only one facade and user will not see the actual polling and caching.

for example we have internals 
_cache
_storage 
entity - user-land code aka facade
```js
 entity.get(key);
 // but internally it will
 const data = _cache.get(key);
 if(data !== undefined) return data;
 const fresh = _storage.get(key);
 _cache.set(key, fresh);
 return fresh; 
```

#### Refresh-Ahead
- on write set ttl
- on read if stale, read db, refresh ttl
- if fresh, and some threshold broke, (ttl - limit < threshold) refresh data and ttl
- so the data stay "hot"

#### Stale-While-Revalidate
- serve stale
- refresh async

#### Write Coalescing
- Combine many writes into one

#### Negative Caching

## Eviction policies / Cache patterns
- LRU - least recent used
- LFU - least frequent used
- MRU - most recent used
- SLRU - segmented LRU, probationary, only frequently reused items reach protected area.
- ARC - adaptive replacement cache, Uses ghost lists
- CLOCK/CLOCK-Pro - approximate LRU with a clock hand
- FIFO - first in first out
- TTL - time based
- Random replacements - cheap
- Ghost objects - keeps identity, tracking access
- Lazy initialization - loads field on first access
- Virtual Proxy - object stands in for real object, fetches on demand (danger Hidden I/O)
- Value holder - caches computed result lazy
- Eager Loading - loads everything upfront, latency > memory
- Preemptive read / Prefetching - loads data before its requested
- Sequential read-ahead - if you read page N, loads N+1, N+2
- Graph-based prefetch - loads related entities
- Predictive prefetch - based on tracked data
- Speculative execution - loads data that might be needed

## Revalidation policy
- TTL - simple, risky, popular
- Version based - good correctness, cheap, required version flows
- Conditional - Etag, Last-Modified
- On-demand

## Structures

### Page cache
- fixed-size blocks
- Used by OS, DBs

### Query cache

### Materialized views
- Precomputed result
- Manual or scheduled refresh

### Object cache
- ORM entities
- Identity map

### Memoization

## Best thing ive ever heard about TTL 
You are not 'forgetting correctness'.
You are limiting how long a mistake is allowed to exist.

Because there is no library, no service that 100% correct, 100% alive and reliable.
Some issues happen, like bad requests, failures, connection issues, deploys or config misses,
human factor, code bugs and etc. 
Better have a revalidation strategy even if your plan looks 'correct and flawless'
