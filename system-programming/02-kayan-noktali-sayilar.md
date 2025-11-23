---
layout: default
title: Floating Point Numbers
nav_order: 2
parent: System Programming
---

# Floating Point Numbers

While integers form the basis of the computing world, the representation of fractional numbers is just as critical. In this section, we will discuss how these numbers are represented according to the universally accepted **IEEE 754** standard and the significant implications of this approach.

---

## 1. Fractional Binary Representation

Just like in the decimal system, the digits to the right of the "binary point" in the binary system represent negative powers of the base.

*   **Example:** The decimal value of the expression `101.11`₂ is:
    *   = (1 × 2²) + (0 × 2¹) + (1 × 2⁰) + (1 × 2⁻¹) + (1 × 2⁻²)
    *   = 4 + 0 + 1 + 0.5 + 0.25 = **5.75**₁₀

A significant consequence of this representation is that numbers that seem simple in the decimal system, like `0.1` (1/10), have an infinitely repeating expansion in the binary system. This inevitably leads to **precision errors** in representations with a finite number of bits.

**Question:** What is the decimal equivalent of the binary number `110.01`₂?

*   A) `5.25`
*   B) `6.25`
*   C) `6.5`
*   D) `5.5`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> (1 × 2²) + (1 × 2¹) + (0 × 2⁰) + (0 × 2⁻¹) + (1 × 2⁻²) = 4 + 2 + 0 + 0 + 0.25 = 6.25.</p>
</details>

---

## 2. IEEE 754 Standard: The Main Idea

To consistently represent fractional numbers across different systems, the universal **IEEE 754** standard is used. This standard breaks a number into three parts, similar to scientific notation:

**Number = (-1)ˢ × M × 2ᴱ**

*   **`s` - Sign:** Determines if the number is positive (`0`) or negative (`1`).
*   **`M` - Mantissa:** Determines the precision (the significant digits) of the number. It's also called the significand.
*   **`E` - Exponent:** Determines the magnitude of the number (how large or small it is).

These three parts are placed into specific bit fields in memory:

| Sign (s) | Exponent (exp) | Fraction (frac) |
|:--------:|:--------------:|:---------------:|
|  1 bit   |     k bits     |     n bits      |

The `float` and `double` types in C are two common implementations of this standard, offering different levels of precision:

| Type     | Total Bits | Sign (s) | Exponent (exp) | Fraction (frac) |
|:---------|:----------:|:--------:|:--------------:|:---------------:|
| `float`  |     32     |  1 bit   |     8 bits     |     23 bits     |
| `double` |     64     |  1 bit   |     11 bits    |     52 bits     |

The `exp` field doesn't store the exponent `E` directly. It stores a biased value. The `frac` field stores the fractional part of the mantissa `M`.

---

## 3. Converting a Decimal Number to `float` Step-by-Step

Let's convert the number `-12.75` into a 32-bit `float` piece by piece. Our goal is to fill the 32-bit `s | exp | frac` structure.

### **Step 1: Determine the Sign (`s`)**

*   **Task:** We look at whether our number is positive or negative.
*   **Analysis:** Our number is `-12.75`, which is negative.
*   **Result:** According to the IEEE 754 standard, the sign bit for negative numbers is **`1`**.
> **Found:** `s = 1`

---

### **Step 2: Convert the Absolute Value to Binary**

*   **Task:** We convert the positive version of the number (`12.75`) to binary. We do this in two parts: the integer part and the fractional part.
*   **Analysis (Integer Part):**
    *   The integer part is `12`. Converting 12 to binary gives `1100`₂. (8 + 4)
*   **Analysis (Fractional Part):**
    *   The fractional part is `0.75`. We can find the binary representation by checking powers of 2: `0.75 = 0.5 + 0.25 = 2⁻¹ + 2⁻²`. This gives `.11`₂.
    *   **Alternative Method (for any fraction):** Repeatedly multiply the fractional part by 2 and record the integer part.
        *   0.75 * 2 = **1**.50 -> First digit is 1
        *   0.50 * 2 = **1**.00 -> Second digit is 1
        *   Stop when the fractional part is 0. Reading the digits from top to bottom gives `.11`₂.
*   **Result:** Combining the two parts gives `1100.11`₂.
> **Found:** The binary form of the number is `1100.11`

---

### **Step 3: Normalize the Binary Number**

*   **Task:** We put our binary number into a scientific notation format that starts with `1.`, just like writing `1234` as `1.234 × 10³` in decimal.
*   **Analysis:** For `1100.11`, we need to move the binary point 3 places to the left to get the `1.` format.
*   **Result:** `1.10011 × 2³`.
    *   The exponent in this notation (`3`) is our **actual exponent (`E`)**.
    *   The part after the binary point (`10011`) is the start of our **fraction (`frac`)**.
> **Found:** Actual exponent `E = 3`, initial fraction `10011`

---

### **Step 4: Calculate the Biased Exponent (`exp`)**

*   **Task:** We need to fill the 8-bit `exp` field of the `float`. This field doesn't store the actual exponent `E` directly. Instead, it stores a "biased" value. For `float`, this bias is **127**.
*   **Analysis:** The formula is simple: `exp = E + Bias`
*   **Result:** `exp = 3 + 127 = 130`. Now we convert `130` to an 8-bit binary number: `10000010`.
> **Found:** `exp = 10000010`

---

### **Step 5: Fill the Fraction Field (`frac`)**

*   **Task:** We need to fill the 23-bit `frac` field of the `float`.
*   **Analysis:** The initial fraction we found in Step 3 was `10011`. This is the part of the mantissa that comes after the implicit leading `1.`. We complete this by adding zeros to the end until it is 23 bits long.
*   **Result:** `10011`**`000000000000000000`** (5 bits + 18 zeros)
> **Found:** `frac = 10011000000000000000000`

---

### **Final Step: Assemble the Pieces!**

Now we have all the parts of the puzzle. Let's combine them in the `s | exp | frac` order:

*   **s:** `1`
*   **exp:** `10000010`
*   **frac:** `10011000000000000000000`

**Result:**
`1 10000010 10011000000000000000000`

This is the exact 32-bit `float` representation of `-12.75` in memory.

**Question:** In the `-12.75` example above, if the number were `+12.75`, how many bits in total would change in the 32-bit pattern?

*   A) Only 1 bit
*   B) All 32 bits
*   C) 8 bits
*   D) None

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: A.</b> The sign of the number only affects the leftmost sign bit (`s`). All other `exp` and `frac` bits are calculated based on the absolute value of the number (`12.75`), so they would remain the same. The sign bit would change from `1` to `0`, meaning only 1 bit would change.</p>
</details>

---

## 4. Special Cases: Zero, Infinity, and NaN

The value of the `exp` field determines how the bits are interpreted. It acts as a switch for different categories of numbers.

*   **Normalized Numbers (`exp` is not all `0`s or all `1`s):** This is the most common case. The mantissa is assumed to have an implicit leading `1.` (e.g., `1.frac`).

*   **Denormalized Numbers (`exp` is all `0`s):** This represents very small numbers close to zero. The implicit leading bit is `0.` (e.g., `0.frac`). If `frac` is also all zeros, the number is **Zero** (`+0.0` or `-0.0`).

*   **Special Values (`exp` is all `1`s):**
    *   If `frac` is all zeros, the value is **Infinity**. This is the result of operations like `1.0 / 0.0`.
    *   If `frac` is not all zeros, the value is **NaN (Not a Number)**. This represents the result of invalid operations like `sqrt(-1)` or `0.0 / 0.0`.

**Question:** A `float` number has an `exp` field of all `1`s and a `frac` field that is not zero. What is this number?

*   A) Infinity
*   B) Not a Number (NaN)
*   C) Zero
*   D) A denormalized number

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> An `exp` field of all `1`s indicates a special case. A non-zero `frac` field specifies that this special case is `NaN` (Not a Number).</p>
</details>

---

## 5. Floating Point Practice Problems

**Question 1:** What is the hexadecimal representation of the decimal number `6.5` as a 32-bit IEEE 754 `float`?

*   A) `0x40D00000`
*   B) `0xC0D00000`
*   C) `0x41D00000`
*   D) `0x3F800000`

<details>
  <summary>Show Answer</p>
  <p><b>Answer: A.</b> Let's solve it step-by-step:
  <ol>
      <li><b>Sign (s):</b> The number is positive, so `s = 0`.</li>
      <li><b>Binary Conversion:</b> `6.5` = `4 + 2 + 0.5` = `110.1`₂.</li>
      <li><b>Normalization:</b> `110.1` = `1.101 × 2²`. The actual exponent is `E = 2`.</li>
      <li><b>Exponent (exp) Calculation:</b> `exp = E + bias` = `2 + 127 = 129`. The 8-bit binary for `129` is `10000001`₂.</li>
      <li><b>Fraction (frac) Calculation:</b> The part after the `1.` in normalization is `101`. We pad it to 23 bits: `10100000000000000000000`.</li>
      <li><b>Combine:</b> `s | exp | frac` = `0 | 10000001 | 10100000000000000000000`.</li>
      <li><b>Convert to Hex:</b> Grouping these 32 bits into 4-bit chunks gives `0100 0000 1101 0000 ...` = `40D00000`.</li>
  </ol>
  </p>
</details>

**Question 2:** What is the decimal number represented by the 32-bit `float` hexadecimal value `0xC1480000`?

*   A) `12.5`
*   B) `25.0`
*   C) `-12.5`
*   D) `-25.0`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> Let's go in reverse, step-by-step:
  <ol>
      <li><b>Convert Hex to Binary:</b> `0xC1480000` = `1100 0001 0100 1000 0000 0000 0000 0000`₂.</li>
      <li><b>Split into Parts:</b> `s | exp | frac`
          <ul>
              <li><b>s (sign):</b> `1` (The number is negative)</li>
              <li><b>exp (exponent):</b> `10000010`₂ = `130`</li>
              <li><b>frac (fraction):</b> `1001000...`</li>
          </ul>
      </li>
      <li><b>Find the Actual Exponent:</b> `E = exp - bias` = `130 - 127 = 3`.</li>
      <li><b>Find the Value:</b> The formula is `(-1)ˢ × (1.frac)₂ × 2ᴱ`. (The leading `1.` is implicit for normalized numbers).
          <ul>
              <li>`= (-1)¹ × (1.1001)₂ × 2³`</li>
              <li>`= -1 × (1100.1)₂` (Move the binary point 3 places to the right)</li>
              <li>`= -1 × (8 + 4 + 0 + 0 + 0.5)`</li>
              <li><b>`= -12.5`</b></li>
          </ul>
      </li>
  </ol>
  </p>
</details>
---