---
title: "Clean Code: The Stuff That Actually Matters"
date: "Apr 2026"
tag: "Architecture"
excerpt: "A practical take on Uncle Bob's Clean Code — the principles I actually use, and a few I push back on."
readTime: "7 min read"
---

# Clean Code: The Stuff That Actually Matters

I first read *Clean Code* in college and almost forgot about it — skimming it the way you do when you feel like you already get it. Then I started working at an MNC as the sole developer, writing internal tools. The code wasn't terrible, but it wasn't good either. Over the years I've come to realise that writing code isn't the hard part — writing it *well*, with the right data structures, proper naming, and all the small disciplines in this post, is what actually matters. I went back and read the book properly after that.

What follows isn't a summary of Uncle Bob's book — there are plenty of those. It's the parts I keep coming back to, the parts I've seen teams skip, and a few places where I think the advice deserves some nuance.

---

## The real cost of bad code isn't bugs — it's velocity

Most teams don't collapse under bad code immediately. They slow down. Features take longer. Simple changes ripple into unexpected places. Onboarding a new developer goes from a week to a month.

The irony is that messy code often *feels* faster to write in the moment. It usually isn't — but even when it is, you're borrowing from future-you at a terrible interest rate. At some point the debt comes due, and the only options are a painful refactor or a full rewrite.

Clean code is the discipline of not borrowing in the first place.

---

## Naming things well is more important than most developers think

> *"There are only two hard things in Computer Science: cache invalidation and naming things."*  
> — Phil Karlton

This joke lands because it's true. A bad name forces every reader to hold extra context in their head. A good name makes the code explain itself.

A few rules I live by:

**Reveal intent, not mechanics.** `delay_in_seconds` beats `ds`. `user_lookup_by_id` beats `user_list` when the structure is actually a dictionary. The name should tell you what the thing *is*, not how it's stored.

**Ditch the encodings.** Hungarian notation (`str_name`, `m_id`) was designed for editors with no autocomplete. Your IDE knows the type. Your reader doesn't need the prefix.

**Use searchable names for magic values.** A loop with `i < 5` is fine. A loop with `i < 5` where 5 means "work days per week" is a lurking bug. Name it.

```python
# ❌ What is 5?
for i in range(5):
    schedule_shift(i)

# ✅ Now it's obvious, and easy to change
WORK_DAYS_PER_WEEK = 5
for i in range(WORK_DAYS_PER_WEEK):
    schedule_shift(i)
```

For classes: nouns. `Account`, `OrderRepository`, `AddressParser`. Avoid `Manager`, `Helper`, or `Utils` — these are naming bankruptcy. When everything lives in `UserManager`, the name has stopped doing any work.

For functions: verbs. `create_order`, `save_user`, `process_payment`. Predicates get a prefix: `is_admin`, `has_permission`, `all_settings_are_valid`. And pick one word per concept — if you have both `get_user` and `fetch_user` in the same codebase, future readers will spend ten minutes figuring out if they're different.

---

## Functions: small, single-purpose, no surprises

Two rules that cover most of the problems I've seen:

**Do one thing.** If you can write an honest "and" in a function's description — "this validates the input *and* sends the email" — you have two functions. Split them.

**No hidden side effects.** A function named `check_password` that also initialises a session is a trap. Someone will call it expecting a check, not a state mutation. Name the side effect or remove it.

On arguments: three is a reasonable maximum. When you find yourself writing four or more, it's almost always a sign that those arguments belong together as an object:

```python
# ❌ Too many loose arguments — easy to pass them in the wrong order
def connect_to_server(address, port, username, password, secure): ...

# ✅ A dataclass gives the arguments meaning and groups related config
from dataclasses import dataclass

@dataclass
class ConnectionSettings:
    address: str
    port: int
    username: str
    password: str
    secure: bool

def connect_to_server(settings: ConnectionSettings): ...
```

One I feel strongly about: **avoid boolean flag arguments**. A function that takes a boolean to switch between two modes is really two functions pretending to be one. `render_widget(True)` tells the reader nothing. `render_widget_expanded()` does.

---

## Comments are often the wrong solution

Here's the honest version: most comments exist because the code failed to explain itself.

```python
# ❌ This comment exists because the condition is unreadable
# Check if employee is eligible for full benefits
if not (employee.flags & EmployeeFlags.HOURLY) and employee.age > 65:
    ...

# ✅ The code now says what it means
if employee.is_eligible_for_full_benefits():
    ...
```

Comments also go stale. The code gets updated; the comment doesn't. Now you have two sources of truth and one of them is wrong — and you don't know which.

That said, there are legitimate uses. Public API docs, legal notices, and the occasional explanation of *why* something non-obvious exists. The test I use: if removing the comment would confuse a future reader who fully understands the language, it earns its place. If it just describes what the next line does, delete it.

---

## The refactoring techniques I use most

**Extract variable** — when a complex expression needs a name, give it one. The next reader (usually future-me) will thank you.

```python
from datetime import date

employed_at_least_five_years = (date.today() - employee.hire_date).days >= 365 * 5
is_eligible_for_benefits = not employee.is_hourly or employed_at_least_five_years

if is_open_enrollment and is_eligible_for_benefits:
    enroll(employee)
```

**Guard clauses** — don't nest the happy path. Handle error conditions early and return, then write the normal flow without nesting:

```python
# ❌ Nested — the real logic is buried
def read_file(user, file_path):
    if user is not None:
        if file_path is not None:
            return file_path.read_text()

# ✅ Fail fast, then proceed cleanly
def read_file(user, file_path):
    if user is None:
        raise ValueError("User not found")
    if file_path is None:
        raise ValueError("File path not provided")
    return file_path.read_text()
```

**Move locals closer to usage** — variables declared at the top of a 60-line function are noise. Declare them where they're used. It reduces the mental window a reader needs to hold open.

---

## YAGNI and DRY — useful, but with caveats

**YAGNI** ("You Ain't Gonna Need It") is a good default. I've seen more complexity from premature abstractions than from any other source. But I'd add: *you still need good abstractions for what you have now*. YAGNI means don't build for hypothetical future requirements — not don't design well.

**DRY** ("Don't Repeat Yourself") is widely understood but often applied too aggressively. Some duplication is accidental and should be extracted. But sometimes two pieces of code *look* the same and have different reasons to change — forcing them into a shared abstraction creates coupling that makes future changes harder. The question isn't "does this look the same?" but "will these two things always change together?"

---

## The boy scout rule

> *Leave the campground cleaner than you found it.*

This is the one I come back to most. You don't have to fix everything. You don't have to refactor the whole module. Just leave whatever you touch slightly better: rename a confusing variable, extract an obvious function, delete a comment that no longer applies.

Individual commits are small. Compound interest is not.

---

Clean code isn't about writing perfect code on the first try — it's about the discipline to improve it as you go. It's a habit more than a skill, and like most habits, it gets easier the longer you keep it.
