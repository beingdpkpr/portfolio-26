---
title: "Building a Developer Productivity Suite"
date: "Jul 2023"
tag: "Engineering"
excerpt: "How we built 7 internal tools that improved consultant productivity by 25% and were adopted by 100+ teams at o9 Solutions."
readTime: "5 min read"
---

## The Context

o9 Solutions serves 150+ enterprise clients, each with custom supply chain configurations. Consultants onboard clients by configuring planning rules, extracting tenant data, running test scenarios, and validating results. Each of those steps was manual, slow, and error-prone.

We built a productivity suite of 7 internal tools to systematise these workflows. Within six months of rollout, consultant onboarding time dropped by 25% and the tools were in daily use by 100+ internal teams.

## The Seven Tools

### 1. Tenant Extractor
Pulls a full snapshot of a tenant's configuration — rules, parameters, data mappings — into a portable format. What used to take 2–3 hours of manual export steps now takes under 5 minutes.

### 2. Builder
Scaffolds new tenant configurations from templates. Consultants select a client profile, answer a short wizard, and get a fully wired configuration ready for customization.

### 3. Performance Analyzer
Attaches to a live planning run and produces a structured performance report: step timings, memory peaks, data volumes, and bottleneck identification. Built on top of the same instrumentation layer we use for internal profiling.

### 4. Test Recorder
Records a consultant's actions against a tenant into a reproducible test script. Think "macro recorder" but for supply chain planning workflows.

### 5. Test Runner
Replays recorded test scripts against a target tenant and diffs the outputs. Used for regression testing before deploying configuration changes to production clients.

### 6. Rule Creator
A structured form-based UI for creating planning rules without writing raw JSON. Validates rule schemas inline and shows a preview of the generated configuration.

### 7. Dataset Multiplier
Takes a small seed dataset and scales it up by a configurable factor — useful for load testing and performance benchmarking without needing real production data.

## What Made This Work

**Dogfooding from day one.** We used every tool ourselves before releasing it. This caught UX issues that wouldn't show up in code review.

**One shared data format.** All seven tools read and write the same intermediate formats. This means tools can be chained — extract a tenant, multiply its dataset, run a performance analysis, record a test, all in sequence.

**Low barrier to contribution.** Each tool is a self-contained Python module with a simple CLI. New contributors can add a tool without touching the others.

## The Lesson

Internal tooling is infrastructure. It deserves the same design rigour as customer-facing systems. The compounding return on consultant time saved across 100+ teams made this one of the highest-ROI investments our team made that year.
