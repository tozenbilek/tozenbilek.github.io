---
layout: default
title: Machine-Level Programming Arithmetic & Control
nav_order: 4
parent: System Programming
---

# Machine-Level Programming: Arithmetic & Control

## 1. The `leaq` Instruction (Load Effective Address)

Although designed for memory calculation, it's often used for **arithmetic**.

*   **Logic:** `leaq S(Rb, Ri), D` $\to$ `D = Rb + S*Ri`.
*   **Key:** Does NOT access memory. Just computes the address.
*   **Usage:** Fast multiplication by constants (e.g., `x * 12`).
    *   `leaq (%rdi, %rdi, 2), %rax` $\to$ `rax = rdi * 3`
    *   `shlq $2, %rax` $\to$ `rax = rax * 4` (Total: `rdi * 12`)

## 2. Arithmetic Operations

| Instruction | Effect | Description |
|:---|:---|:---|
| `incq D` | `D++` | Increment |
| `decq D` | `D--` | Decrement |
| `negq D` | `D = -D` | Negate |
| `notq D` | `D = ~D` | Bitwise Complement |
| `addq S, D` | `D += S` | Add |
| `subq S, D` | `D -= S` | Subtract |
| `imulq S, D` | `D *= S` | Multiply (Signed) |
| `xorq S, D` | `D ^= S` | Exclusive-OR (Zeroing: `xorq %rax, %rax`) |
| `andq S, D` | `D &= S` | Bitwise AND |
| `orq S, D` | `D \|= S` | Bitwise OR |
| `salq k, D` | `D <<= k` | Left Shift |
| `sarq k, D` | `D >>= k` | Arithmetic Right Shift (Sign extend) |
| `shrq k, D` | `D >>= k` | Logical Right Shift (Zero fill) |

## 3. Condition Codes (Flags)

Single-bit registers set by arithmetic/logical ops (but NOT by `leaq`).

*   **ZF (Zero Flag):** Result is `0`.
*   **SF (Sign Flag):** Result is negative (MSB is 1).
*   **CF (Carry Flag):** Unsigned overflow (Carry out of MSB).
*   **OF (Overflow Flag):** Signed overflow (Two pos add to neg, etc.).

> **`cmpq S2, S1`:** Computes `S1 - S2`, sets flags, discards result.
> **`testq S2, S1`:** Computes `S1 & S2`, sets flags (ZF, SF), discards result.

## 4. Jumps & Control Flow

Instructions that change the `%rip` based on flags.

| Instruction | Condition | Description |
|:---|:---|:---|
| `jmp` | 1 | Unconditional |
| `je` / `jz` | ZF | Equal / Zero |
| `jne` / `jnz` | ~ZF | Not Equal / Not Zero |
| `js` | SF | Negative |
| `jns` | ~SF | Non-Negative |
| `jg` / `jnle` | ~(SF^OF) & ~ZF | Greater (Signed) |
| `jl` / `jnge` | SF^OF | Less (Signed) |
| `ja` / `jnbe` | ~CF & ~ZF | Above (Unsigned >) |
| `jb` / `jnae` | CF | Below (Unsigned <) |

## 5. Control Structures

### A. Conditional Move (`cmov`)
Avoids branching (and prediction errors) by computing both values and selecting one.
*   `val = Test ? Then_Val : Else_Val;`
*   Computed as: Calculate both `Then` and `Else`, then `cmove` based on `Test`.

### B. Loops
All loops (`while`, `for`) are translated into `cmp` + `jmp`.
*   **Do-While:** Simplest. Body $\to$ Test $\to$ Jump Back.
*   **While:** Jump to Test $\to$ Test $\to$ Body $\to$ Jump to Test.
*   **For:** Init $\to$ While Loop.

### C. Switch Statements
Implemented using a **Jump Table** for efficiency when cases are dense (e.g., case 0, 1, 2, 3).
*   Table is an array of code addresses.
*   `jmp *.L4(,%rdi,8)` (Indirect jump using table entry).

## 6. Procedures & The Stack (Brief)

*   **Stack:** Grows **down** (high addr $\to$ low addr). `%rsp` points to top.
*   **`pushq S`:** `rsp -= 8`; `Mem[rsp] = S`.
*   **`popq D`:** `D = Mem[rsp]`; `rsp += 8`.
*   **`call Label`:** Push return address, Jump to Label.
*   **`ret`:** Pop return address, Jump to it.

### Calling Conventions (System V AMD64)
*   **Passing Args:** `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. (Others on stack).
*   **Caller-Saved:** `%rax`, `%rcx`, `%rdx`, `%r8-11`. (Can be overwritten by function).
*   **Callee-Saved:** `%rbx`, `%rbp`, `%r12-15`. (Must be restored if used).

