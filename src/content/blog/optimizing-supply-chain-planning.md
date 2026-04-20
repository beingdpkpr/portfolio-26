---
title: "Optimizing Supply Chain Planning with Python"
date: "Mar 2024"
tag: "Architecture"
excerpt: "How we achieved 50% reduction in batch computation time through targeted re-engineering of core supply planning components at o9 Solutions."
readTime: "8 min read"
---

## The Problem

Supply chain planning at enterprise scale is computationally expensive. Our core TLB (Time-phased Lot-Sizing and Bucketing), MRP (Material Requirements Planning), and IOP (Inventory Optimization and Planning) modules were written over several years by multiple teams with different performance assumptions. By 2022, batch runs for large clients were taking 4–6 hours — unacceptable for near-real-time planning workflows.

## Profiling First, Optimizing Second

The cardinal rule of performance engineering: never guess. We instrumented every major computation step using Python's `cProfile` and a custom timing decorator that wrote structured JSON logs to our observability stack.

Three hotspots emerged immediately:

- **Redundant DataFrame copies** inside nested loops — each iteration was allocating gigabytes of intermediate state.
- **O(n²) lookup patterns** where we were doing linear scans against large demand/supply arrays instead of using hash-based indices.
- **Eager evaluation** of demand trees that produced full exploded BOMs even when only a subset of nodes needed updating.

## Key Optimizations

### 1. Lazy BOM Expansion

We replaced the full-BOM expansion at the start of each planning run with a lazy iterator pattern. Nodes are only expanded when a planning rule actually requests them. For clients with 500,000+ SKUs, this eliminated 40% of the computation before any other change.

```python
class LazyBOMExpander:
    def __init__(self, raw_bom: dict):
        self._raw = raw_bom
        self._cache: dict = {}

    def expand(self, sku_id: str) -> list:
        if sku_id not in self._cache:
            self._cache[sku_id] = self._compute(sku_id)
        return self._cache[sku_id]
```

### 2. Vectorized Demand Netting

Replaced row-by-row pandas iteration with vectorized NumPy operations for demand netting. This alone cut the netting phase from 45 minutes to under 4 minutes on our largest client dataset.

### 3. Parquet-based Intermediate Storage

Switched inter-process data handoff from CSV to Parquet with Snappy compression. Read times dropped by 70% and memory usage during deserialization fell by roughly 30%.

## Results

After a 6-week re-engineering sprint:

- **Batch time**: 4–6 hours → 2–2.5 hours (50% reduction)
- **Peak memory**: 32GB → 22GB per worker (30% reduction)
- **Client impact**: zero regressions across 150+ deployed configurations

## Lessons

Performance work at this scale requires patience and rigour. The profiling data will surprise you — it always does. The bottleneck is almost never where you expect it.
