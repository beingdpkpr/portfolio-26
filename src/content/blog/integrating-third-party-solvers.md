---
title: "Integrating Third-Party Solvers at Scale"
date: "Nov 2023"
tag: "Systems"
excerpt: "Lessons from integrating 6+ optimization solvers including Samsung NSR with Boost serialization and Parquet-based data exchange."
readTime: "6 min read"
---

## Why Solver Integration Is Hard

Modern supply chain optimization platforms don't ship with a single monolithic solver. Clients have varying constraints — regulatory, cost, preference — that mean the "best" solver depends on the problem. At o9 Solutions, we needed to support a growing catalogue: GLPK, Gurobi, CPLEX, Samsung NSR, and others.

The challenge isn't invoking a solver. It's building an abstraction that lets you swap solvers without rewriting orchestration logic, data pipelines, or result parsers.

## The Abstraction Layer

We built a thin adapter interface in C++ that each solver integration implements:

```cpp
class ISolverAdapter {
public:
    virtual void loadProblem(const ProblemSpec& spec) = 0;
    virtual SolveStatus solve(const SolverParams& params) = 0;
    virtual SolutionResult extractSolution() = 0;
    virtual ~ISolverAdapter() = default;
};
```

Each solver has its own adapter class. The platform calls the interface; it never knows which solver is underneath.

## Boost Serialization for Problem Specs

Transferring problem data between Python orchestration and C++ solvers requires a fast, compact binary format. We chose Boost.Serialization because:

1. It handles complex nested object graphs natively.
2. It supports versioning — critical when problem spec schemas evolve.
3. It integrates cleanly with our existing C++ codebase.

## Samsung NSR: The Interesting Case

NSR (Network Supply Replenishment) is Samsung's proprietary solver optimized for multi-echelon inventory problems. The integration was non-trivial because NSR expects data in a very specific columnar format that differs from our internal representation.

We wrote a dedicated transformer layer that converts our internal `ProblemSpec` into NSR's expected schema using Parquet as the transport format. Parquet's columnar layout maps well to NSR's input expectations and gave us ~70% faster data load times vs. the CSV-based approach we had been prototyping with.

## Lessons Learned

- **Define the abstraction boundary before writing any solver-specific code.** We violated this once (with CPLEX, early on) and paid for it with 3 weeks of refactoring.
- **Version your serialization formats.** Solvers update. Your problem spec evolves. Without versioning, upgrades become migrations.
- **Test with production-scale datasets early.** Solvers that perform well on toy problems can behave very differently at 500k+ variables.
