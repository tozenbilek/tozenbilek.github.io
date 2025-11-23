---
layout: default
title: Bits and Integers (Sheet)
nav_order: 1
parent: System Programming
---

# Bits, Bytes, and Integers (Cheat Sheet)

## 1. Data Representation

*   **Bit:** 0 or 1.
*   **Byte:** 8 bits. Range: `0` to `255` (Hex: `00` to `FF`).
*   **Word:** Natural data size (usually 32 or 64 bits).
*   **Hexadecimal:** Base 16. Each digit = 4 bits.
    *   Digits: `0-9`, `A(10)`, `B(11)`, `C(12)`, `D(13)`, `E(14)`, `F(15)`.
    *   Example: `0xC3` = `1100 0011`

## 2. Endianness (Byte Ordering)
How multi-byte data (e.g., `0x76543210`) is stored in memory addresses.

| Type | Description | Addr A | A+1 | A+2 | A+3 |
|:---|:---|:---:|:---:|:---:|:---:|
| **Big-Endian** | MSB first (Human readable, Network) | `76` | `54` | `32` | `10` |
| **Little-Endian** | LSB first (Intel, AMD) | `10` | `32` | `54` | `76` |

## 3. Bitwise Operations

| Op | Name | Logic | Usage |
|:-:|:---:|:---|:---|
| `&` | **AND** | 1 if both 1 | **Masking** (Clear bits) |
| `\|` | **OR** | 1 if any 1 | **Setting** bits |
| `^` | **XOR** | 1 if diff | **Toggling** bits |
| `~` | **NOT** | Invert all | One's Complement |

### Shift Operations
*   `<<` **Left Shift:** Fill with `0`. Equivalent to multiplying by $2^k$.
*   `>>` **Right Shift:**
    *   **Logical:** Fill with `0` (Use for **Unsigned**).
    *   **Arithmetic:** Fill with **Sign Bit** (Use for **Signed**). Preserves sign.

## 4. Integer Representations

### Unsigned
*   **Range:** `0` to $2^w - 1$
*   **Interpretation:** Pure magnitude.

### Signed (Two's Complement)
*   **Range:** $-2^{w-1}$ to $2^{w-1} - 1$
*   **Sign Bit (MSB):** `0` = Positive, `1` = Negative.
*   **Negation Formula:** `-x = ~x + 1`
*   **Anomaly (TMin):** Most negative number (e.g., `-128`) has no positive counterpart.

| 4-Bit Binary | Unsigned Value | Signed Value |
|:---:|:---:|:---:|
| `1111` | 15 | -1 |
| `1000` | 8 | -8 (TMin) |
| `0111` | 7 | 7 (TMax) |

## 5. Casting & Conversions

### Expansion (Small $\to$ Large)
*   **Unsigned:** **Zero Extension** (Add `0`s to left).
*   **Signed:** **Sign Extension** (Copy **Sign Bit** to left).
    *   Ex: 4-bit `-3` (`1101`) $\to$ 8-bit `-3` (`1111 1101`).

### Truncation (Large $\to$ Small)
*   **Rule:** Discard most significant bits. Result is reinterpreted.
    *   Ex: `int 260` (`...1 0000 0100`) $\to$ `char` (`0000 0100` = 4).

### Implicit Casting Trap
If you mix `signed` and `unsigned`, **signed is cast to unsigned**.
```c
if (-1 < 0U) // FALSE! -1 becomes UMAX (Huge number)
```

## 6. Overflow Rules

*   **Unsigned:** Modular arithmetic (Wraps around).
*   **Signed:**
    *   **Pos + Pos = Neg** $\to$ Overflow.
    *   **Neg + Neg = Pos** $\to$ Overflow.
    *   **Pos + Neg** $\to$ Never Overflows.
