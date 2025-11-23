---
layout: default
title: Machine-Level Programming Basics
nav_order: 3
parent: System Programming
---

# Machine-Level Programming: Basics

## 1. Architecture Overview (Programmer's View)

*   **PC (Program Counter):** Called `%rip` (Instruction Pointer) in x86-64. Stores address of next instruction.
*   **Register File:** 16 named locations storing 64-bit values (heavily used).
*   **Condition Codes:** Store status of most recent arithmetic operation (CF, ZF, SF, OF).
*   **Memory:** Byte-addressable array. Code, user data, stack all live here.

## 2. Data Formats & Suffixes

Assembly instructions often have a suffix indicating operation size.

| C Declaration | Intel Data Type | Assembly Suffix | Size (Bytes) |
|:---|:---|:---:|:---:|
| `char` | Byte | `b` | 1 |
| `short` | Word | `w` | 2 |
| `int` | Double Word | `l` | 4 |
| `long` / `char *` | Quad Word | `q` | 8 |
| `float` | Single Precision | `s` | 4 |
| `double` | Double Precision | `l` (or `d` in AVX) | 8 |

> **Note:** `movl` moves 4 bytes, `movq` moves 8 bytes.

## 3. x86-64 Integer Registers

16 General Purpose Registers. All 64-bits wide.
*   Lower bits can be accessed independently for backward compatibility.

| 64-bit (Quad) | 32-bit (Double) | 16-bit (Word) | 8-bit (Byte) | Purpose / Convention |
|:---|:---|:---|:---|:---|
| `%rax` | `%eax` | `%ax` | `%al` | **Return Value** |
| `%rbx` | `%ebx` | `%bx` | `%bl` | Callee Saved |
| `%rcx` | `%ecx` | `%cx` | `%cl` | 4th Arg |
| `%rdx` | `%edx` | `%dx` | `%dl` | 3rd Arg |
| `%rsi` | `%esi` | `%si` | `%sil` | 2nd Arg |
| `%rdi` | `%edi` | `%di` | `%dil` | **1st Arg** |
| `%rbp` | `%ebp` | `%bp` | `%bpl` | Callee Saved (Base Ptr) |
| `%rsp` | `%esp` | `%sp` | `%spl` | **Stack Pointer** |
| `%r8` - `%r15` | `%r8d`... | `%r8w`... | `%r8b`... | 5th, 6th Args, etc. |

> **Crucial Rule:** Instructions generating a **32-bit** result (e.g., `addl`, `movl`) set the **upper 32 bits of the destination register to ZERO**.

## 4. Operand Types

1.  **Immediate:** Constant integer data. Prefixed with `$`.
    *   Example: `$0x400`, `$-53`.
2.  **Register:** One of the 16 registers.
    *   Example: `%rax`, `%r13`.
3.  **Memory:** 8 consecutive bytes of memory at address given by register.
    *   Example: `(%rax)`.

## 5. Memory Addressing Modes

The most powerful feature of x86-64. Used for array indexing and pointer arithmetic.

### General Form
$$ D(R_b, R_i, S) $$

*   **Effective Address** = $Mem[Reg[R_b] + Reg[R_i] \times S + D]$
*   **$D$ (Displacement):** Constant "offset" (1, 2, or 4 bytes).
*   **$R_b$ (Base Register):** Any register.
*   **$R_i$ (Index Register):** Any register except `%rsp`.
*   **$S$ (Scale):** Must be **1, 2, 4, or 8**.

### Examples
Assume `%rdx = 0xf000`, `%rcx = 0x100`.

| Syntax | Calculation | Address Result | Use Case |
|:---|:---|:---|:---|
| `0x8(%rdx)` | $0xf000 + 8$ | `0xf008` | Struct field access |
| `(%rdx, %rcx)` | $0xf000 + 0x100$ | `0xf100` | Array element |
| `4(%rdx, %rcx)` | $0xf000 + 0x100 + 4$ | `0xf104` | Array + Offset |
| `(%rdx, %rcx, 4)` | $0xf000 + 0x100 \times 4$ | `0xf400` | Int array access |
| `0x80( , %rdx, 2)` | $0xf000 \times 2 + 0x80$ | `0x1e080` | Weird math |

## 6. Data Movement (MOV)

*   `movq Source, Dest`
*   **Constraint:** Cannot move from **Memory to Memory** in a single instruction!
    *   Must load to register first.
    *   Valid: `movq $5, %rax`, `movq %rax, (%rbx)`.
    *   Invalid: `movq (%rax), (%rbx)`.

