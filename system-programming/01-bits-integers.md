---
layout: default
title: Bits and Integers
nav_order: 1
parent: System Programming
---

# Bits, Bytes, and Integers

## 1. Data Representation

*   **Byte:** 8 bits. Range: `0` to `255`.
*   **Hexadecimal:** 
    *   `0-9`, `A(10)`...`F(15)`.
    *   `0x100` = $16^2 = 256$. `0xFF` = $255$.
    *   Memorize: `A=1010`, `B=1011`, `C=1100`, `D=1101`, `E=1110`, `F=1111`.
    *   **Strings (C-Style):** Array of chars ending with `null` (`\0` or `0x00`).
        *   "123" $\to$ `0x31 0x32 0x33 0x00`.

### Data Sizes (32-bit vs 64-bit)

| C Type | 32-bit Size | 64-bit Size |
|:---|:---:|:---:|
| `char` | 1 byte | 1 byte |
| `short` | 2 bytes | 2 bytes |
| `int` | 4 bytes | 4 bytes |
| `long` | **4 bytes** | **8 bytes** |
| `char *` | **4 bytes** | **8 bytes** |

## 2. Endianness (Exam Favorite)
Storing `0x12345678` at address `0x100`.

| Address | **Little-Endian** (Intel/AMD) | **Big-Endian** (Network) |
|:---:|:---:|:---:|
| `0x100` | `78` (LSB) | `12` (MSB) |
| `0x101` | `56` | `34` |
| `0x102` | `34` | `56` |
| `0x103` | `12` (MSB) | `78` (LSB) |

> **Exam Tip:** Questions often cast `int*` to `char*` to test this.
> ```c
> int x = 0x12345678;
> char *p = (char *)&x;
> if (*p == 0x78) printf("Little Endian");
> ```

## 3. Bitwise Operations & Shifts

| Op | Logic | Common Usage |
|:-:|:---|:---|
| `&` | AND | **Clear/Mask:** `x & 0xFF` (Keep lower 8 bits). |
| `\|` | OR | **Set:** `x | (1<<7)` (Set 8th bit). |
| `^` | XOR | **Toggle:** `x ^ (1<<7)` (Flip 8th bit). |
| `~` | NOT | **Invert:** `~x` (Flip all bits). |

*   **Logical Right Shift (`>>`):** Fill with `0` (Unsigned).
*   **Arithmetic Right Shift (`>>`):** Fill with **Sign Bit** (Signed).
    *   `-8 >> 1` $\to$ `-4` (Preserves sign).
    *   **Negative Division Fix:** Arithmetic shift rounds *down* (e.g., $-3 >> 1 = -2$), but integer division rounds *toward zero* ($-3 / 2 = -1$).
        *   **Formula:** `(x + (1<<k) - 1) >> k` (Adds "bias" before shifting).

### Logical (`&&, ||, !`) vs Bitwise (`&, |, ~`)
*   **Bitwise:** Operates on bits. `~0x41` $\to$ `0xBE`.
*   **Logical:** Operates on boolean (Zero vs Non-Zero). `!0x41` $\to$ `0x00`.
    *   `!0x00` $\to$ `0x01`.
    *   `!!x` $\to$ Normalizes x to 0 or 1.

## 4. Signed Integers (Two's Complement)

*   **Range:** $[-2^{w-1}, 2^{w-1}-1]$. (e.g., 8-bit: `[-128, 127]`)
*   **Negation:** `-x = ~x + 1`
*   **TMin Anomaly:** `TMin` has no positive counterpart.
    *   `-TMin` = `TMin` (Overflows back to itself!).
    *   8-bit `TMin` (`-128`): `1000 0000`.
*   **Sign Bit:** MSB is `1` for negative numbers.

## 5. Casting & Promotion (The "Gotchas")

1.  **Signed $\to$ Unsigned:**
    *   Bit pattern stays same, value changes drastically if negative.
    *   `-1` (Signed) $\to$ `UMax` (Unsigned).
2.  **Small $\to$ Large:**
    *   **Unsigned:** Zero Extension (`00...`).
    *   **Signed:** Sign Extension (Copy MSB `11...` or `00...`).
3.  **Comparison Trap:**
    *   If comparing `signed` vs `unsigned`, **signed is promoted to unsigned**.
    *   `-1 < 0U` is **FALSE** because `-1` becomes `MAX_UINT`.

## ---------------------------------------------
## 🚀 ADVANCED: EXAM PREP & TRICKS
## ---------------------------------------------

### 6. Bit Manipulation Hacks (Memorize These)

| Goal | Formula | Explanation |
|:---|:---:|:---|
| **Is Power of 2?** | `!(x & (x - 1))` | Powers of 2 have single `1`. `1000 & 0111 == 0`. |
| **Clear Lowest Bit** | `x & (x - 1)` | `1010` & `1001` $\to$ `1000`. |
| **Get Lowest Bit** | `x & -x` | `-x` is `~x+1`. Isolates lowest `1`. |
| **Swap Vars** | `a^=b; b^=a; a^=b;` | No temp variable needed. |
| **Extract Byte k** | `(x >> (k*8)) & 0xFF` | Shifts byte to LSB position and masks it. |

### 7. Common C Puzzles

**Q1: Why does `(x > 0) || (x-1 < 0)` fail?**
*   If `x` is `TMin` (most negative), `x-1` overflows to `TMax` (positive). Both conditions become false (for specific TMin cases) or undefined behavior.

**Q2: Floating Point vs Int**
*   `int x = ...; float f = (float)x; int y = (int)f;`
*   **Is `x == y`?** NO! Large `int` values lose precision when cast to `float`.

**Q3: Shift Amount**
*   `int x = 1; x << 32;`
*   **Result:** Undefined Behavior in C! Shift amount must be $< w$.

### 8. Arithmetic Overflow Detection

How to check overflow without calculating the result?

*   **Addition (`x + y`):**
    *   If `x > 0, y > 0` but `sum < 0` $\to$ **Pos Overflow**.
    *   If `x < 0, y < 0` but `sum > 0` $\to$ **Neg Overflow**.
*   **Multiplication:**
    *   Check: `if (x != 0 && (x * y) / x != y)`. (Safe overflow check).
    *   Wait! `x*y` can overflow. Correct check involves division:
    *   `if (x != 0 && prod / x != y)` (assuming `prod` is computed).
    *   Better: Check limits before multiplying or use larger type (`long long`).

### 9. Important Constants (32-bit)

| Name | Value | Hex |
|:---|:---:|:---:|
| **UMax** | $2^{32}-1$ | `0xFFFFFFFF` |
| **TMax** | $2^{31}-1$ | `0x7FFFFFFF` |
| **TMin** | $-2^{31}$ | `0x80000000` |
| **-1** | $-1$ | `0xFFFFFFFF` |

> **Note:** `TMax + 1 == TMin` (Overflow).

