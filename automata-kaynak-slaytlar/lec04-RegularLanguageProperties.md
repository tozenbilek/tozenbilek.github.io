# Properties of Regular Languages

## Topics
- Minimization & Equivalence of Automata  
- Closure Properties  
- Decision Properties  
- Pumping Lemma  

---

# 1. Minimization & Equivalence of Automata

## 1.1 Indistinguishable States
Two states p and q are **indistinguishable** if:

For all w ∈ Σ\* :  
δ̂(p, w) ∈ F ⟺ δ̂(q, w) ∈ F

Meaning:  
They behave identically on all strings → can be merged.

Indistinguishability is an **equivalence relation** (reflexive, symmetric, transitive).

---

## 1.2 Table Filling Algorithm (Distinguishability)

### Basis  
Mark every pair (p, q) where one is accepting and the other is not.

### Induction  
Mark (p, q) if for some symbol a:  
δ(p, a) and δ(q, a) are already marked as distinguishable.

### Result  
Unmarked pairs = indistinguishable → merge them.

---

## 1.3 DFA Minimization Using Table Filling
1. Find all distinguishable pairs  
2. Partition states into equivalence classes  
3. Replace each class by one state → minimal DFA

The minimal DFA is unique up to renaming of states.

---

# 2. Closure Properties of Regular Languages

Regular languages are closed under:

1. **Union**  
   L ∪ M is regular  
   Proof via REs or DFAs

2. **Concatenation**  
   LM is regular  

3. **Kleene Star**  
   L\* is regular  

4. **Complement**  
   Replace accepting states with non-accepting ones  

5. **Intersection**  
   Product construction:  
   States = QL × QM  
   Accepting = FL × FM  

6. **Difference**  
   L − M = L ∩ (¬M)

7. **Reversal**  
   Reverse edges, new start → ε transitions to old finals.

8. **Homomorphism**  
   Replace each symbol with a string  
   h(L) is regular  

9. **Inverse Homomorphism**

---

# 3. Decision Properties of Regular Languages

## 3.1 Emptiness Test
L is empty iff no final state is reachable from start.

## 3.2 Finiteness Test
Language is **infinite** iff:
- The DFA has a cycle **reachable from start**,  
- And the cycle leads to a final state.

## 3.3 More Decision Problems
- L1 ⊆ L2?  
  Check if L1 − L2 = ∅  
- Does L contain ε?  
  Check start state ∈ F  
- Does L contain a palindrome?  
  Build M ∩ MR and check emptiness  

---

# 4. Pumping Lemma for Regular Languages

If L is regular, then ∃n such that any w with |w| > n can be decomposed as:

w = xyz  
with:

1. y ≠ ε  
2. |xy| ≤ n  
3. x yᵏ z ∈ L for all k ≥ 0  

Used to prove languages are **not regular**.

---

## 4.1 Classic Non-Regular Examples

### Example 1: {0ⁿ1ⁿ | n ≥ 1}
Choose w = 0ⁿ1ⁿ  
y consists only of 0s → pumping breaks balance → contradiction.

### Example 2: Strings with equal numbers of 0s and 1s  
Same structure as above.

### Example 3: Strings of 1’s whose length is prime  
Pumping destroys primality → contradiction.

### Example 4: Strings with more 0s than 1s  
Pumping reduces 0’s → contradiction.

### Example 5: Unequal number of 0s and 1s  
Use closure under complement + pumping lemma.

---

# Summary

## Minimization  
- Use table filling to merge indistinguishable states.  
- Minimal DFA is unique up to renaming.

## Closure Properties  
Regular languages are closed under many operations (union, intersection, difference, reversal, homomorphism…).

## Decision Properties  
We can decide: emptiness, finiteness, subset, ε ∈ L, palindromes, etc.

## Pumping Lemma  
Every regular language is pumpable; use this to prove non-regularity.

---

This Markdown file is generated from the slide deck.  
