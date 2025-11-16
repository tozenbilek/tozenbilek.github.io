# Regular Expressions and Regular Languages

## Topics
- Regular Expressions
- Conversion: Regular Expression → NFA
- Conversion: Finite Automata → Regular Expression
- Algebraic Laws for Regular Expressions

---

# 1. Regular Expressions

Regular expressions (REs) are an algebraic way to describe **regular languages**.

### Key Facts
- Every RE defines a **regular language**.
- Every regular language can be recognized by a **DFA**, **NFA**, and can be described by a **regular expression**.
- For each RE `E`, there exists a DFA `A` such that `L(E) = L(A)`.

---

## 1.1 Operations on Languages
Given languages L and M:

- **Union:** `L ∪ M`
- **Concatenation:** `LM = { xy | x ∈ L, y ∈ M }`
- **Powers:**  
  - `L⁰ = {ε}`  
  - `L¹ = L`  
  - `Lᵏ⁺¹ = LLᵏ`
- **Kleene Star:** `L* = ⋃ᵢ≥0 Lⁱ`

---

## 1.2 Definition of Regular Expressions

### Basis
| Regular Expression | Denoted Language |
|------------------|------------------|
| ∅ | {} |
| ε | {ε} |
| a ∈ Σ | {a} |

### Inductive Rules
- **Union:** `E1 + E2`  
- **Concatenation:** `E1E2`
- **Kleene Star:** `E*`
- **Parentheses:** `(E)`

### Operator Precedence
1. `*` (highest)
2. Concatenation
3. `+` (lowest)

Example:  
`ab* + c` means `(a(b*)) + c`.

---

## 1.3 Examples
- Σ = {0,1}
- `01` → {01}
- `01 + 0` → {01, 0}
- `0(1+0)` → {01, 00}
- `0*` → all strings of zeros
- `(0+1)*` → all binary strings
- `(0+10)*(ε+1)` → binary strings without consecutive 1’s

---

## 1.4 Writing Regular Expressions for Languages
- Start with `0` and end with `1`:  
  `0(0+1)*1`

- At least two consecutive zeros:  
  `(0+1)*00(0+1)*`

- No consecutive zeros:  
  `(1+01)*(ε + 0)`

- Even number of zeros:  
  `1*(01*01*)*`

---

# 2. Converting Regular Expressions to NFA

**Goal:** Construct an NFA for any regular expression.

### Base NFAs
- For ε
- For ∅
- For a single symbol

### Inductive Constructions
1. **Union R+S:** ε-transitions to choice of R or S  
2. **Concatenation RS:** connect accept(R) → start(S) via ε  
3. **Kleene Star R\*:** new start & accept with ε-loops  
4. **Parentheses:** no effect on automaton

Examples include building NFAs for `(0+1)*1(0+1)`.

---

# 3. Converting NFA/DFA to Regular Expressions

Uses **Generalized NFAs (GNFA)** and **state elimination**.

## Steps
1. Convert DFA → GNFA  
   - Add new start state with ε-transition  
   - Add new final state with ε-transitions from old accepting states  
   - Replace labels with regular expressions  
2. Eliminate states one by one  
3. Final single label is the equivalent RE

### State Elimination Formula
If removing state `qk`, for transitions `qi → qj`:

```
new Rij = Rij + Rik (Rkk)* Rkj
```

---

# 4. Algebraic Laws for Regular Expressions

## 4.1 Associativity & Commutativity
- Union is commutative and associative
- Concatenation is associative but not commutative

## 4.2 Identities & Annihilators
- Identity for union: `∅`
- Identity for concatenation: `{ε}`
- Annihilator for concatenation: `∅`

## 4.3 Distributive Laws
- `R(M+N) = RM + RN`
- `(M+N)R = MR + NR`

## 4.4 Idempotence
- `M + M = M`

## 4.5 Closure Laws
- `∅* = ε`
- `ε* = ε`
- `L+ = LL*`
- `(L*)* = L*`

---

# 5. Discovering Algebraic Laws
To test if `Exp1 = Exp2` is a true law:
1. Replace variables with actual symbols.
2. Convert to REs.
3. Check language equivalence (e.g., using DFAs).

Examples validated:
- `R(M+N) = RM + RN`
- `(M+N)* = (M*N*)*`

---

This summary covers the entire slide deck.  
