---
title: "Practical Python Profiling: From Guessing to Knowing"
date: "Apr 2026"
tag: "Python"
excerpt: "Stop guessing where your Python code is slow — measure CPU, memory, and time with these drop-in decorators."
readTime: "4 min read"
---

# 🧠 Practical Python Profiling: From Guessing to Knowing

Performance issues are rarely obvious---and intuition is often wrong.

You might *feel* a function is slow or memory-heavy, but without
measurement, you're just guessing. This guide walks through a practical
way to profile:

-   Execution time
-   CPU usage
-   Memory consumption

------------------------------------------------------------------------
## 🚀 1. Function-Level Profiling with `cProfile`

``` python
import cProfile, pstats, io

def profile(fnc):
    def inner(*args, **kwargs):
        pr = cProfile.Profile()
        pr.enable()

        retval = fnc(*args, **kwargs)

        pr.disable()
        s = io.StringIO()
        ps = pstats.Stats(pr, stream=s).sort_stats('cumulative')
        ps.print_stats()

        print(s.getvalue())
        return retval

    return inner
```

**Usage:**

``` python
@profile
def slow_function():
    return sum(i * i for i in range(1_000_000))

slow_function()
# ncalls  tottime  cumtime  filename:lineno(function)
#      1    0.112    0.112  example.py:1(slow_function)
#  ...
```

------------------------------------------------------------------------

## 📊 2. Memory Monitoring

``` python
import os, time, threading
import psutil

def _current_mb():
    return psutil.Process(os.getpid()).memory_info().rss / 1e6

def _watch_memory(interval=10):
    peak = 0.0
    while True:
        current = _current_mb()
        peak = max(peak, current)
        print(f"Memory: {current:.1f} MB  |  Peak: {peak:.1f} MB")
        time.sleep(interval)

threading.Thread(target=_watch_memory, daemon=True).start()
```

**Usage:** call this once at startup — the daemon thread runs in the background and prints a live snapshot every 10 seconds alongside your application output:

```
Memory: 142.3 MB  |  Peak: 142.3 MB
Memory: 198.7 MB  |  Peak: 198.7 MB
Memory: 191.2 MB  |  Peak: 198.7 MB
```

------------------------------------------------------------------------

## ⚡ 3. CPU + Memory + Time Decorator

``` python
import psutil, time, threading
from functools import wraps

def monitor(stop_event, data, interval):
    process = psutil.Process()
    while not stop_event.is_set():
        data["cpu"].append(psutil.cpu_percent(interval=0.1))
        data["mem"].append(process.memory_info().rss / 1e6)
        time.sleep(interval)

def profiler(interval=1):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            data = {"cpu": [], "mem": []}
            stop_event = threading.Event()

            t = threading.Thread(target=monitor, args=(stop_event, data, interval))
            t.start()

            start = time.time()
            result = func(*args, **kwargs)
            end = time.time()

            stop_event.set()
            t.join()

            print(f"Time: {end - start:.2f}s")
            print(f"CPU Avg: {sum(data['cpu'])/len(data['cpu']):.2f}")
            print(f"Mem Max: {max(data['mem']):.2f} MB")

            return result
        return wrapper
    return decorator
```

**Usage:**

``` python
@profiler(interval=0.5)
def process_dataset(path):
    data = load(path)
    return transform(data)

process_dataset("large_file.parquet")
# Time: 4.83s
# CPU Avg: 67.40%
# Mem Max: 512.18 MB
```

------------------------------------------------------------------------

## 🧠 Key Takeaways

-   Measure before optimizing
-   Use `cProfile` for deep dives
-   Track memory for leaks
-   Combine metrics for real insight

------------------------------------------------------------------------
