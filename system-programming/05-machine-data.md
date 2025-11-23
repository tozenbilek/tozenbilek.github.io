---
layout: default
title: Machine-Level Programming Data
nav_order: 5
parent: System Programming
---

# Machine-Level Programming: Data

## 1. Arrays

### Basic Principle
Arrays are allocated as contiguous blocks of memory. `T A[L]` allocates `L * sizeof(T)` bytes.
*   **Identifier `A`**: Can be used as a pointer to the beginning of the array (`%rax` = address of A[0]).
*   **Access:** `A[i]` is at address `A + i * sizeof(T)`.
    *   Assembly: `movl (%rdx, %rcx, 4), %eax` (where `%rdx` is start, `%rcx` is index `i`, 4 is size of int).

### Nested Arrays (Multi-Dimensional)
*   **Declaration:** `int A[R][C]`
*   **Memory Layout:** Row-Major. Row 0, then Row 1, etc.
*   **Address Calculation:** `A[i][j]` is at `Mem[Start + (i * C * 4) + (j * 4)]`.
    *   Notice how we must know the **column count (C)** to jump rows.

## 2. Structures (structs)

*   **Layout:** Fields are stored sequentially in memory in order of declaration.
*   **Pointer:** Pointer to struct is pointer to its first byte.
*   **Access:** Compiler determines fixed offset for each field.
    *   `p->f` $\to$ `Mem[p + offset_of_f]`.

## 3. Alignment

To improve memory access performance, data must be aligned to addresses that are multiples of their size.

| Type | Size (K) | Alignment Rule |
|:---|:---:|:---|
| `char` | 1 | No restriction |
| `short` | 2 | Address must be multiple of 2 (Ends in 0, 2, 4...) |
| `int` / `float` | 4 | Address must be multiple of 4 (Ends in 0, 4, 8, C) |
| `double` / `long` | 8 | Address must be multiple of 8 (Ends in 0, 8) |

### Padding
Compilers insert "gap" bytes (padding) to ensure alignment rules are met.
*   **Internal Padding:** Between fields.
*   **External Padding:** At the end of the struct to align the *total size* (so arrays of structs work).

> **Tip:** To minimize padding/wasted space, declare struct fields from **largest to smallest** size.

## 4. Buffer Overflow (Security)

A major vulnerability in C.

*   **Cause:** Writing past the end of an array (usually on the stack).
*   **The Attack:**
    1.  Attacker inputs a string longer than the buffer.
    2.  The string overwrites the **Return Address** on the stack.
    3.  When function `ret`urns, it jumps to attacker's code instead of the original caller.

### Defenses
1.  **Stack Canary:** A random value placed between the buffer and the return address.
    *   Checked before `ret`. If changed, program aborts (`__stack_chk_fail`).
2.  **NX Bit (No-Execute):** Mark stack memory as non-executable.
3.  **ASLR (Address Space Layout Randomization):** Randomize stack/heap positions every run.


