# Automata Theory and Formal Languages

## Introduction to Automata Theory
- What is Automata Theory?
- Central Concepts of Automata Theory
- Formal Proofs

## What is Automata Theory?
Automata theory is the study of abstract computing devices (machines).

### Historical Background
- 1930s: Turing machines studied to define limits of computation.
- 1940s–50s: Finite automata and formal grammars (Chomsky).

## Why Study Automata?
Automata theory is core to CS, used in:
- Compilers (lexical analysis, parsing)
- Search engines
- Hardware design
- Natural language processing
- Understanding undecidable and intractable problems

## Automata, Computability and Complexity
- Complexity: classify problems as easy/hard
- Computability: solvable/non‑solvable problems
- Automata: mathematical models (finite automata, CFGs, Turing machines)

## Central Concepts

### Alphabets
- A finite non‑empty set of symbols Σ
- Examples: {0,1}, {a…z}, ASCII

### Strings
- Sequences of symbols from Σ
- Empty string: ε
- Length |w|

### Powers of an Alphabet
- Σ^k = strings of length k
- Σ* = all strings
- Σ+ = all non‑empty strings
- Concatenation: xy

### Languages
- Any subset L ⊆ Σ*
- Examples: {0ⁿ1ⁿ}, Σ*, ∅, {ε}

### Set‑Former Definitions
- {w | property about w}
- Examples: {0ⁿ1ⁿ | n ≥ 1}

### Decision Problems
Given w ∈ Σ*, decide whether w ∈ L.

## Automata Overview
Automata can:
- Decide membership
- Transduce strings

Types:
- Finite Automata (regular languages)
- Pushdown Automata (context‑free)
- Turing Machines (computable functions)

Deterministic vs nondeterministic models.

## Finite Automata
- Finite states, transitions, start/accept states
- Memory limited to state

### Examples
- On/Off switch automaton
- Recognizing “ilyas”
- Recognizing strings ending with “ing”

## Formal Proofs
Forms:
- Deductive proofs
- Inductive proofs
- Proof by contradiction
- Disproof via counterexample

### Deductive Proofs
Sequence of statements using inference rules.

### Example Theorem
If x is the sum of four positive integer squares → 2x ≥ x²

### Iff Proofs
Prove both directions (if and only if)

### Inductive Proofs
- Basis
- Inductive Hypothesis
- Inductive Step

### Structural Induction
Used for recursively defined structures (e.g., trees)

### Set Equivalences
To prove S = T show S ⊆ T and T ⊆ S

### Proof by Contradiction
Assume H and ¬C, derive falsehood.

