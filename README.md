# Cache

## Kinds
- browser (Cache-Control, ETag, Last-Modified)
- cdn
- application (LRU, Redis...)
- database (Query cache, Buffer pool)

## Strategies

#### Cache-Aside (Lazy loading)
- on reads - from cache, misses, read from source, 
write to cache and return data.
- on write - invalidates cache or updates it
- simple, cold start, stale reads
- good for heave reads, system that can stand stale data

#### Write-Through
- Cache updates on write
- write into cache, write into datasource.
- cache fresh, simple reads, latency for writes
- good consistency

#### Write-behind
- write cache, update source later
- fast writes
- possible data loss, hard recovery
- good for non critical data, analytics

#### Read-Through
- cache fetches data itself on miss
- centralized logic
- complex cache logic

#### Refresh-Ahead
- refresh item before TTL expires

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
