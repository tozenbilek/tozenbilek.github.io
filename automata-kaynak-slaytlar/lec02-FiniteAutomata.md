# Finite Automata

## Topics
- Deterministic Finite Automaton (DFA)
- Non-Deterministic Finite Automaton (NFA)
- Equivalence of DFA and NFA

## Deterministic Finite Automaton (DFA)
A DFA is a 5-tuple **A = (Q, Σ, δ, q₀, F)**:
- Q: finite set of states  
- Σ: alphabet  
- δ: transition function (q, a) → p  
- q₀: start state  
- F: accepting states

### Graph Representation
- States = nodes  
- Final states = double circles  
- Start state = arrow  
- Transitions = labeled arcs

### Example DFA
Accepts strings without two consecutive `1`'s.

### Extended Delta Function (δ̂)
- δ̂(q, ε) = q  
- δ̂(q, xa) = δ(δ̂(q, x), a)

### Language of a DFA
L(A) = { w | δ̂(q₀, w) ∈ F }  
Regular languages = languages accepted by DFAs.

---

## DFA Examples
- Strings ending in `001`
- Strings starting with `0` and ending with `1`
- Strings with even number of 0's and 1's

---

## Non-Deterministic Finite Automaton (NFA)
NFA = (Q, Σ, δ, q₀, F)  
Differences from DFA:
- Can have multiple transitions for same symbol  
- Can have ε-transitions  
- Accepts if *any path* leads to final state

### Formal Definition
δ : Q × (Σ ∪ {ε}) → P(Q)

### ε-Closure
ECLOSE(q) = set of states reachable from q using ε transitions.

### Extended Delta (NFA)
- δ̂(q, ε) = ECLOSE(q)
- δ̂(q, xa) = union of ECLOSE(δ(r, a)) for r in δ̂(q, x)

### Acceptance
w is accepted if δ̂(q₀, w) intersects F.

---

## NFA Examples
- Ends with `01`
- Decimal numbers with optional sign and decimal point

---

## Equivalence of DFA and NFA
Subset construction converts any NFA → DFA.

### DFA Construction
- Qᴅ = P(Qᴺ)  
- qᴅ = ECLOSE(q₀)  
- Fᴅ = subsets intersecting F  
- δᴅ(S, a) = union of ECLOSE(δ(p, a)) for p in S

### Theorems
1. L(D) = L(N) for subset construction DFA.  
2. A language is accepted by some DFA **iff** by some NFA.

---

## Summary
- DFAs and NFAs recognize the same class: **Regular Languages**.
- NFAs may have ε-transitions and nondeterminism, DFAs do not.
- Subset construction may create up to 2ⁿ states (worst case).

