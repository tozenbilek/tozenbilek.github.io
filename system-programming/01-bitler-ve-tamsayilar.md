---
layout: default
title: Bits and Integers
nav_order: 1
parent: System Programming
---

# Bits, Bytes, and Integers

The foundation of everything in the digital world is **bits**. In this section, we will examine how data is represented and manipulated in this most basic form, and how it constitutes more complex structures like integers.

---

## 1. Binary Representation

Computers only understand two states to store and process information: on or off, high voltage or low voltage. The digits corresponding to these two states are **1** and **0**. A single 1 or 0 is called a **bit**.

*   **Byte:** A group of 8 bits. It is the smallest addressable unit in memory. A byte can take on 256 (2⁸) different values, from `00000000` to `11111111`.
*   **Word:** The natural data size that a processor handles in a single operation. In modern systems, it is usually 32-bit (4 bytes) or 64-bit (8 bytes).

**Hexadecimal Representation:** Since binary numbers can be very long, the more compact hexadecimal (base 16) representation is often used. Each hexadecimal digit corresponds to 4 bits.
*   Digits: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F`

The following table shows the decimal and hexadecimal equivalents of a 4-bit binary number:

| Decimal | Binary | Hexadecimal |
|:-------:|:------:|:-----------:|
|    0    | `0000` |     `0`     |
|    1    | `0001` |     `1`     |
|    2    | `0010` |     `2`     |
|    3    | `0011` |     `3`     |
|    4    | `0100` |     `4`     |
|    5    | `0101` |     `5`     |
|    6    | `0110` |     `6`     |
|    7    | `0111` |     `7`     |
|    8    | `1000` |     `8`     |
|    9    | `1001` |     `9`     |
|   10    | `1010` |     `A`     |
|   11    | `1011` |     `B`     |
|   12    | `1100` |     `C`     |
|   13    | `1101` |     `D`     |
|   14    | `1110` |     `E`     |
|   15    | `1111` |     `F`     |

*   Example: `1111 1111` (binary) = `255` (decimal) = `FF` (hexadecimal)

**Question 1:** What is the 8-bit binary equivalent of the hexadecimal number `0xC3`?

*   A) `11000011`
*   B) `10100101`
*   C) `11001100`
*   D) `11100011`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: A.</b> Each digit in hexadecimal corresponds to 4 bits. `C` is 12 in decimal, and its binary equivalent is `1100`. The binary equivalent of `3` is `0011`. Combining these, we get `11000011`.</p>
</details>

**Question 2:** What is the maximum value an 8-bit `unsigned char` can hold?

*   A) `127`
*   B) `256`
*   C) `255`
*   D) `128`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> With 8 bits, 2⁸ = 256 different values can be represented. For unsigned integers, this range starts from `0` and goes up to `255` (256 numbers including `0`).</p>
</details>

---

## 2. Memory Organization and Endianness

### Byte Ordering (Endianness)

Memory is an array of bytes, each with a consecutive address. When storing a data type that spans multiple bytes, such as an `int`, the rule that determines the order in which these bytes are placed (from low address to high address) is called **Endianness**.

To understand this, let's consider the 4-byte number `0x76543210`. The bytes of this number are:
*   `76` (Most Significant Byte, MSB)
*   `54`
*   `32`
*   `10` (Least Significant Byte, LSB)

There are two ways to place this number in memory starting at address `A`:

*   **Big-Endian:** Bytes are ordered from **most significant to least significant**, just as we write and read them. The most significant byte (`76`) goes to the lowest address. Network protocols often use this order.

*   **Little-Endian:** Bytes are ordered from **least significant to most significant**, i.e., in reverse. The least significant byte (`10`) goes to the lowest address. Most modern processors (Intel, AMD) use this method.

The following table shows how the number `0x76543210` is placed in memory in the two orders:

| Address | Big-Endian Value | Little-Endian Value |
|:-------:|:----------------:|:-------------------:|
|    A    |       `76`       |        `10`         |
|   A+1   |       `54`       |        `32`         |
|   A+2   |       `32`       |        `54`         |
|   A+3   |       `10`       |        `76`         |

**Question 1:** In a Little-Endian system, if the 32-bit integer `0x12345678` is written to memory address `0x100`, what byte value is found at address `0x101`?

*   A) `0x12`
*   B) `0x34`
*   C) `0x56`
*   D) `0x78`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> In Little-Endian systems, the least significant (rightmost) byte is written to the lowest address. The order would be: Address `0x100`: `0x78`, Address `0x101`: `0x56`, Address `0x102`: `0x34`, Address `0x103`: `0x12`.</p>
</details>

**Question 2:** In a Big-Endian system, if the 32-bit integer `0x12345678` is written to memory address `0x100`, what byte value is found at address `0x101`?

*   A) `0x12`
*   B) `0x34`
*   C) `0x56`
*   D) `0x78`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> In Big-Endian systems, the most significant (leftmost) byte is written to the lowest address. The order would be: Address `0x100`: `0x12`, Address `0x101`: `0x34`, Address `0x102`: `0x56`, Address `0x103`: `0x78`.</p>
</details>

---

## 3. Bit-Level Logical Operations

The C language has powerful operators that allow us to manipulate the bits of integers directly. These operators provide low-level control and optimization possibilities.

Let's use `a = 93` (i.e., `01011101`) and `b = 148` (i.e., `10010100`) for examples.

### Logical Operators

*   `&` **(AND):** The result is `1` if both corresponding bits are `1`. It is often used to "mask" (isolate) or "clear" specific bits.
    ```
      01011101  (a)
    & 10010100  (b)
      --------
      00010100  (Result: 20)
    ```

*   `|` **(OR):** The result is `1` if at least one of the two bits is `1`. It is used to "set" specific bits (make them 1).
    ```
      01011101  (a)
    | 10010100  (b)
      --------
      11011101  (Result: 221)
    ```

*   `^` **(XOR - Exclusive OR):** The result is `1` if the two bits are different (`0` and `1`). It is used to "toggle" specific bits.
    ```
      01011101  (a)
    ^ 10010100  (b)
      --------
      11001001  (Result: 201)
    ```

*   `~` **(NOT):** Inverts all the bits of a single number (`0`s become `1`s, and `1`s become `0`s).
    ```
    ~ 01011101  (a)
      --------
      10100010  (Result: -94, in 2's complement)
    ```

| A | B | A & B (AND) | A \| B (OR) | A ^ B (XOR) |
|:-:|:-:|:-----------:|:-----------:|:-----------:|
| 0 | 0 |      0      |      0      |      0      |
| 0 | 1 |      0      |      1      |      1      |
| 1 | 0 |      0      |      1      |      1      |
| 1 | 1 |      1      |      1      |      0      |

### Shift Operations

These operators shift the bits of a number to the left or right by a specified amount.

*   `<<` **(Left Shift):** Shifts all bits to the left. Vacated positions on the right are filled with `0`s. `x << k` is equivalent to multiplying `x` by `2^k`.
    ```
    a << 3;  // Shift 93 left by 3 bits

    Start: 01011101 (93)
    Result:    11101000 (232)
    ```

*   `>>` **(Right Shift):** Shifts all bits to the right. There are two types:
    *   **Logical Right Shift:** Vacated positions on the left are always filled with `0`s. This is applied to `unsigned` integers in C.
        ```
        unsigned int u = 240; // 11110000
        u >> 2;

        Start: 11110000 (240)
        Result:    00111100 (60)
        ```
    *   **Arithmetic Right Shift:** Vacated positions on the left are filled by copying the **sign bit** (the leftmost bit) to preserve the number's sign. This is applied to `signed` integers. It ensures that division works correctly for negative numbers.
        ```
        signed char s = -16; // 11110000 (8-bit 2's complement)
        s >> 2;

        Start: 11110000 (-16)
        Result:    11111100 (-4)
        ```

**Question 1:** The expression `(x & 1)` is used to determine if an integer `x` is odd or even. If `x = 7` (binary `0111`), what is the result and what does it mean?

*   A) `0` (Number is even)
*   B) `1` (Number is even)
*   C) `1` (Number is odd)
*   D) `0` (Number is odd)

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> The least significant bit (the rightmost bit) of a number is `1` if the number is odd, and `0` if it is even. The `& 1` operation (ANDing with `0001`) clears all other bits and checks only this rightmost bit. The result of `0111 & 0001` is `0001`, which is `1`, so the number is odd.</p>
</details>

**Question 2:** What `OR` operation should be applied to `x = 176` (binary `10110000`) to set its 3rd bit (from the right, starting at 0) to `1`?

*   A) `x | 4`
*   B) `x | 2`
*   C) `x | 8`
*   D) `x | 16`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> The number with only the 3rd bit set to `1` is `00001000`, which is `8` in decimal. The `OR` operation with a bit that is `1` always results in `1`. The result of `10110000 | 00001000` is `10111000`, setting the 3rd bit to `1`.</p>
</details>

---

## 4. Integer Representations

Understanding how computers store integers helps us prevent many common programming errors (e.g., `overflow`). There are two main ways to represent numbers.

### Unsigned Integers
In this method, all bits of a number directly represent its magnitude. There are no negative numbers or sign information.

*   A `w`-bit unsigned integer can take values between **0** and **2ʷ-1**.
*   **Example (4-bit):** Can represent 16 different numbers from `0000` (0) to `1111` (15).

### Signed Integers: Two's Complement
This is the standard method for signed integers in modern computers, which greatly simplifies arithmetic operations.

*   **Sign Bit:** The leftmost bit is reserved for the sign. `0` indicates the number is positive, and `1` indicates it is negative.
*   **Value Range:** A `w`-bit signed integer can take values between **-2ʷ⁻¹** and **2ʷ⁻¹-1**.
*   **Example (4-bit):** Can represent 16 different numbers from `-2³` (-8) to `2³-1` (+7).

> **Crucial Detail (TMin Anomaly):** The range of Two's Complement is asymmetric. There is one more negative number than positive numbers.
> *   Example (8-bit): Range is `-128` to `+127`.
> *   The value `-128` (TMin) has **no positive counterpart**. Attempting to take the negative `-(-128)` typically results in overflow and returns `-128` again!

The following table shows how a 4-bit number is interpreted as unsigned and signed (two's complement):

| Bit Pattern | Unsigned Value | Signed (Two's Complement) Value |
|-------------|----------------|---------------------------------|
|    0000     |        0       |                0                |
|    0001     |        1       |                1                |
|    ...      |       ...      |               ...               |
|    0111     |        7       |                7                |
|    1000     |        8       |               -8                |
|    1001     |        9       |               -7                |
|    ...      |       ...      |               ...               |
|    1111     |       15       |               -1                |

**Finding the Negative of a Number (Practical Method): `(~x + 1)`**

To find the negative (`-x`) of a number `x`:
1.  Invert all bits of the number (`~` operator).
2.  Add 1 to the result.

**Example: Let's make 5 into -5 (on 4 bits)**
1.  The bit pattern for `5` is: `0101`
2.  Invert all bits (`~`): `1010`
3.  Add 1 to the result: `1010 + 1 = 1011`
4.  Looking at the table, we see that `1011` indeed corresponds to `-5`.

The main advantage of this system is that addition and subtraction operations can be performed with the same hardware circuit for both signed and unsigned numbers.

**Question 1:** In 8-bit Two's Complement, how is the negative of `5` (binary `00000101`), which is `-5`, represented?

*   A) `10000101`
*   B) `11111011`
*   C) `11111010`
*   D) `00001010`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> We use the formula `~x + 1` to find the negative of `x`.
  1. `x` = `00000101`
  2. `~x` = `11111010` (invert all bits)
  3. `~x + 1` = `11111011`</p>
</details>

**Question 2:** What is the largest positive value a 16-bit `signed` integer can hold?

*   A) `65535`
*   B) `32767`
*   C) `65536`
*   D) `32768`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> The range of a `w`-bit signed integer is from `-2^(w-1)` to `2^(w-1) - 1`. For `w=16`, the largest value is `2^15 - 1 = 32768 - 1 = 32767`.</p>
</details>

**Question 3:** What is the result of applying a 3-bit arithmetic right shift (`>> 3`) to the 8-bit `signed char` `-80` (`10110000`)?

*   A) `20`
*   B) `-40`
*   C) `10`
*   D) `-10`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: D.</b> An arithmetic right shift copies the sign bit (`1`) into the vacated bits on the left to preserve the sign. The operation `10110000` >> 3 results in `11110110`. This bit pattern corresponds to `-10` in 8-bit Two's Complement. This is practically equivalent to the division ` -80 / (2^3) = -10`.</p>
</details>

---

## 5. Casting, Expansion, and Truncation

In languages like C, it is common to convert between different integer types (like assigning a `short` to an `int`). These conversions are done automatically by the compiler, but knowing how the bits change behind the scenes is critical to understanding unexpected errors.

### Expanding: From Smaller to Larger Type
This is representing a value with more bits (e.g., from 4-bit to 8-bit). Preserving the value is essential.

*   **Zero Extension:** Used for `unsigned` numbers. `0`s are added to the left of the number (to the most significant bits).
*   **Sign Extension:** Used for `signed` numbers. To preserve the original sign of the number, the new bits are filled by copying the **sign bit**.

### Truncating: From Larger to Smaller Type
This is representing a value with fewer bits (e.g., from 8-bit to 4-bit). This operation can result in data loss, and the value of the number can change completely.

*   The rule is simple: The most significant bits (the bits on the left) are simply **discarded**.

**Question 1:** If the 4-bit `signed` integer `-3` (`1101`) is expanded to an 8-bit integer using `Sign Extension`, what is the result?

*   A) `00001101`
*   B) `00000011`
*   C) `11111101`
*   D) `10000011`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> During `Sign Extension`, the original sign bit (the leftmost `1` for `-3`) is copied to the newly added bits to preserve the sign. Therefore, the result is `11111101`.</p>
</details>

**Question 2:** What is the result if the 32-bit `int` `260` (`...0001 0000 0100`) is truncated to an 8-bit `char`?

*   A) `4`
*   B) `-4`
*   C) `100`
*   D) `-260`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: A.</b> Truncation discards the most significant bits. The last 8 bits of the number `260` are `00000100`, which is equal to `4` in decimal.</p>
</details>

### Implicit Casting Surprises (Signed vs Unsigned)

In C, if an operation involves both `signed` and `unsigned` numbers, the `signed` number is implicitly cast to `unsigned`. This can lead to non-intuitive behavior in comparison operations (`<`, `>`).

**Example:** Is `-1 < 0`?
*   Mathematically: **Yes**.
*   In C (`signed int` vs `unsigned int`): **No!**

```c
int x = -1;
unsigned int u = 0;

if (x < u) {
    printf("True");
} else {
    // This block runs!
    printf("False");
}
```

**Reason:** When `-1` is cast to `unsigned`, it acts like `UMAX` (all bits are `1`, e.g., `4294967295` for 32-bit). Since `UMAX` is clearly not smaller than `0`, the condition fails. This is a common source of bugs and security vulnerabilities.

---

## 6. Integer Addition and Overflow

Computer arithmetic is different from real-world mathematics because it operates with a **finite number of bits**. If an `int` is 32 bits, it can represent 2³² different numbers, but no more. This limitation can cause the result of a simple operation like addition to be different than expected, a situation called **overflow**.

### Unsigned Addition & Overflow

Unsigned integers can be thought of as numbers on a circle. For example, a 4-bit number ranges from 0 to 15. When you add 1 to 15, you go back to the beginning, 0. This is called **modular arithmetic**.

In unsigned addition, when the result exceeds the maximum value representable by `w` bits (2ʷ-1), the result is taken modulo `2ʷ`. This means the result "wraps around".

### Signed Addition & Overflow

In Two's Complement addition, overflow is detected when the result has a logically incorrect sign.

**Overflow Detection Rules:**
1.  **Positive Overflow:** If the sum of two **positive** numbers yields a **negative** result.
2.  **Negative Overflow:** If the sum of two **negative** numbers yields a **positive** result.
3.  *Note:* The sum of a positive and a negative number **never** causes an overflow.

**Question 1:** What is the result and why, if the operation `5 + 5` is performed using 4-bit `signed` integers?

*   A) `10` (Correct result)
*   B) `-6` (Positive overflow occurred)
*   C) `10` (Correct as unsigned)
*   D) `2` (Negative overflow occurred)

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: B.</b> The 4-bit pattern for `5` is `0101`. `0101 + 0101 = 1010`. The pattern `1010` corresponds to `-6` in 4-bit Two's Complement. Since the sum of two positive numbers is negative, this is a case of positive `overflow`.</p>
</details>

**Question 2:** What is the result of `250 + 10` using 8-bit `unsigned char` variables?

*   A) `260`
*   B) `-4`
*   C) `4`
*   D) `-252`

<details>
  <summary>Show Answer</summary>
  <p><b>Answer: C.</b> An 8-bit unsigned integer can hold values from `0` to `255`. `250 + 10 = 260`, which is outside this range. The result is found by `260 mod 256`, which is `4`. This is a case of `unsigned overflow`.</p>
</details>

---