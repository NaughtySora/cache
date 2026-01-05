# Cache

## Kinds
- browser (Cache-Control, ETag, Last-Modified)
- cdn
- application (LRU, Redis...)
- database (Query cache, Buffer pool)

## Strategies

#### Cache-Aside
- on read from cache: misses, read from source, write to cache and return data
- on write: invalidates cache or updates it
- simple, cold start, stale reads
- good for heave reads, system that can stand stale data

*Should be combined with cache ttl to refresh stale cache periodically*

#### Write-Through
- on write: updates cache, writes to datasource
- fresh cache, simple reads, latency for writes
- good consistency

*careful with errors writing to cache first, can lose data*

#### Write-behind
- on write: updates cache, puts data into some stash
- using async queue/timeout/threshold update datasource from stash
- possible data loss, hard recovery
- good for non critical data, analytics

#### Read-Through
- logically acts as Cache-Aside
- cache fetches data itself on miss
- abstracts client from knowing about caching

#### Refresh-Ahead
- on write: update cache and set ttl
- on read if stale, read db, refresh ttl
- if fresh, and some threshold passed, refresh data and ttl
- keeps cache fresh

#### Stale-While-Revalidate
- on write: refresh cache with ttl
- if cache miss, get data from source, refresh cache with ttl
- if cache hit, and ttl is still fresh return data, if ttl is expired return stale but 
puts update into queue and refresh asynchronously

#### Negative Caching
- on write: revalidate cache or update with fresh value + ttl
- on read: if source returns nothing assign key a specific value and small ttl, 
treat specific value as positive cache hit

## Write strategies

#### Write Coalescing
- Combine many writes into one, basically a debounce

## Eviction policies / Cache patterns

#### LRU - least recent used
- remove the least recently used item from the store
- uses hash map for O(1) access, double linked list for ordering, might as well use adjusted DLL
- used in general purpose caches (web, db buffers, in-memory cache)
- bad for large sequential reads, one time access

#### LFU - least frequent used
- remove item with lowest access count
- uses hashmap, frequency map and min frequency value
- used when recency predicts reuse, user sessions, web requests, ui data, screens, microservice read heavy
- bad when recency is not important, scan or streaming workload, analytics scans, full table reads, ETL jobs

#### MRU - most recent used
- remove the most recently used item
- uses hash map and dll
- good when recently accessed items are unlikely to be reused: 
- sequential scans, Streaming / ETL reads, Iterating over large datasets once
- bad when user driven workloads, hot keys accessed repeatedly, interactive systems


#### SLRU - segmented LRU, probationary
- only frequently reused items reach protected area.
- uses 2 LRU small and large one.
- evict from small, if large is full, move item in small
- good for web caches, db buffers, noisy traffic, mixed workload
- bad bc needs tuning, complexity, 

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
