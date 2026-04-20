---
title: "Python Performance Analysis"
date: "Apr 2026"
tag: "Python"
excerpt: "Practical techniques to speed up pandas code — from apply() and swifter to numpy vectorization, hash lookups, and memory-efficient patterns."
readTime: "6 min read"
---

When I first started using pandas for data analysis, I started using loops. However, loops are time consuming and so I started looking for alternatives and that is what I am trying to share with everyone.

## The apply() Method

We can use `apply` with a lambda function.

The performance of `apply` function depends on the content of the expression.

## Swifter apply()

It is a combination of pandas `apply` (non-parallel) and dask `apply` (parallelized). Since swifter toggles between these two modes, it is faster than dask. Refer to the reference section for more detail.

This is a third-party library which has to be installed before importing.

## Numpy vectorize()

The vectorized function evaluates `pyfunc` over successive tuples of the input arrays like the Python `map` function, except it uses the broadcasting rules of numpy.

The data type of the output of vectorized is determined by calling the function with the first element of the input. This can be avoided by specifying the `otypes` argument.

## Vectorization

Vectorization is used to speed up Python code without using loops.

Using such a function can help in minimizing the running time of code efficiently.

> **Note:** We might not be able to use vectorization for all kinds of operations. Pandas tries to provide vectorized functions in such cases.

**Split each row:** We use `map` as it is the fastest for this approach, but there are functions like `partition` that do the same thing. For code reference, please refer to the Sample Code section.

## Other Observations

### Use inplace

Many Pandas operations have an `inplace` parameter, always defaulting to `False`, meaning the original DataFrame is untouched and the operation returns a new DataFrame.

When setting `inplace=True`, the operation might work on the original DataFrame, but it might still work on a copy behind the scenes and just reassign the reference when done.

**Pros:** Can be both faster and less memory intensive.

**Cons:**

- Prevents chained/functional syntax: `df.dropna().rename().sum()...` which offers a chance for lazy evaluation.
- When using `inplace=True` on an object which is potentially a slice/view of an underlying DataFrame, Pandas has to do a `SettingWithCopy` check, which is expensive. `inplace=False` avoids this.
- Less consistent and predictable behaviour behind the scenes.

### Use Hash for Lookups

Hash lookup is lightning fast. We can replace series lookup with hash lookup in Python using a single line of code (`to_dict()`).

Use `describe()` and `memory_usage()` functions to get the stats of your DataFrame and the memory details.

## Sample Code

```python
# APPLY with lambda FUNCTION
df['lamdba'] = df.apply(lambda x: x['a'] + x['b'], axis=1)

# APPLY with FUNCTION
df['lambda_func'] = df.apply(addTwoCols, axis=1)

import swifter
# SWIFTER APPLY with lambda FUNCTION
df['lambda_swifter'] = df.swifter.apply(lambda x: x['a'] + x['b'], axis=1)

# NP VECTORIZE
df['vectorize'] = np.vectorize(lambda x, y: x + y)(df['a'], df['b'])

# VECTORIZATION
df['vec'] = df['a'] + df['b']

# NUMERIC VECTORIZATION
df['num_vec'] = df['a'].values + df['b'].values

# STRING SPLIT - using map
capaConsPeg1[FROM_ACTIVITY1] = capaConsPeg1['ROUTE_CODE'].map(lambda x: x.split('@')[0])
capaConsPeg1[FROM_ACTIVITY2] = capaConsPeg1['ROUTE_CODE'].map(lambda x: x.split('@')[1])
capaConsPeg1[FROM_ACTIVITY3] = capaConsPeg1['ROUTE_CODE'].map(lambda x: x.split('@')[2])

# STRING SPLIT - using Partition function
capaConsPeg7[FROM_ACTIVITY1], capaConsPeg7[FROM_ACTIVITY2], capaConsPeg7[FROM_ACTIVITY3] = \
    capaConsPeg7['ROUTE_CODE'].str.partition('@')

# STRING SPLIT - using str.split
capaConsPeg2[FROM_ACTIVITY1], capaConsPeg2[FROM_ACTIVITY2], capaConsPeg2[FROM_ACTIVITY3] = \
    capaConsPeg3['ROUTE_CODE'].str.split('@', n=2, expand=True) \
    .rename(columns={0: FROM_ACTIVITY1, 1: FROM_ACTIVITY2, 2: FROM_ACTIVITY3})

# STRING SPLIT - using str.split (another approach)
capaConsPeg4[FROM_ACTIVITY1], capaConsPeg4[FROM_ACTIVITY2], capaConsPeg4[FROM_ACTIVITY3] = \
    pd.DataFrame(
        capaConsPeg4['ROUTE_CODE'].str.split('@', n=2).tolist(),
        columns=[FROM_ACTIVITY1, FROM_ACTIVITY2, FROM_ACTIVITY3]
    )
```

## Best Practices

- Always use vectorization wherever possible. It is the most efficient way to code without using third-party libraries.
- Use numpy when dealing with numeric data.
- Swifter is not available in the o9 platform, so ignore it for now.
- Use `inplace=True` wherever possible.
- Use hash for lookups.

## References

- [swifter](https://github.com/jmcarpenter2/swifter)
- [One word of code to stop using pandas so slowly](https://towardsdatascience.com/one-word-of-code-to-stop-using-pandas-so-slowly-793e0a81343c)
- [How to make your pandas loop 71,803 times faster](https://towardsdatascience.com/how-to-make-your-pandas-loop-71-803-times-faster-805030df4f06)
- [numpy.vectorize documentation](https://numpy.org/doc/stable/reference/generated/numpy.vectorize.html)
- [Performance of pandas apply vs np.vectorize](https://stackoverflow.com/questions/52673285/performance-of-pandas-apply-vs-np-vectorize-to-create-new-column-from-existing-c)
