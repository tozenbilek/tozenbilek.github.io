---
layout: default
title: Floating Point
nav_order: 2
parent: System Programming
---

# Floating Point (IEEE 754)

## 1. Fractional Binary Numbers

Tıpkı ondalık sayılarda ($10^{-1}, 10^{-2}$) olduğu gibi, ikilik tabanda da nokta sağı $2^{-k}$ şeklinde ilerler.

*   **Değer:** $\sum_{k=-j}^i b_k \times 2^k$
*   **Örnek:** $101.11_2$
    *   $1 \times 4 + 0 \times 2 + 1 \times 1 + 1 \times (1/2) + 1 \times (1/4)$
    *   $4 + 1 + 0.5 + 0.25 = 5.75$
*   **Sınırlama:** $0.1$ (1/10) gibi sayılar binary'de **sonsuz devirli** olduğu için tam ifade edilemez. Bu da finansal hesaplamalarda hata riskidir.

## 2. IEEE 754 Representation

Bilgisayarlar reel sayıları şu formülle saklar:

$$ V = (-1)^s \times M \times 2^E $$

*   **s (Sign):** İşaret biti (0: Pozitif, 1: Negatif).
*   **M (Significand/Mantissa):** Kesirli kısım.
*   **E (Exponent):** Üs değeri (Ağırlık).

### Formatlar

| Özellik | Single Precision (float) | Double Precision (double) |
|:---|:---:|:---:|
| **Total Bits** | 32 | 64 |
| **Sign (s)** | 1 bit | 1 bit |
| **Exp (k)** | 8 bits | 11 bits |
| **Frac (n)** | 23 bits | 52 bits |
| **Bias** | 127 | 1023 |

## 3. Sayı Kategorileri (Exam Critical)

Exp (Üs) bitlerine bakarak sayının türünü anlarız.

### A. Normalized Values (Exp $\neq$ 00...0 ve Exp $\neq$ 11...1)
En yaygın durumdur.
*   **Exponent (E):** $Exp - Bias$
*   **Significand (M):** $1.frac$ (Başta gizli bir 1 vardır: **Implicit Leading 1**).
    *   Bu sayede 23 bitlik alanda 24 bitlik hassasiyet sağlanır.

### B. Denormalized Values (Exp = 00...0)
Sıfıra çok yakın sayıları ifade etmek için kullanılır.
*   **Exponent (E):** $1 - Bias$ (Dikkat: 0 - Bias değil!)
*   **Significand (M):** $0.frac$ (Gizli 1 yoktur, başta 0 vardır).
*   **Amaç:**
    1.  **Sıfırı Temsil Etmek:** +0 ve -0.
    2.  **Gradual Underflow:** Sayıların aniden sıfır olması yerine yavaşça küçülmesini sağlamak.

### C. Special Values (Exp = 11...1)
*   **Infinity ($\infty$):** Eğer `Frac == 0` ise. (Örn: $1.0 / 0.0$).
*   **NaN (Not a Number):** Eğer `Frac != 0` ise. (Örn: $\sqrt{-1}$, $\infty - \infty$).

## 4. Rounding (Yuvarlama)

IEEE 754 varsayılan olarak **Round-to-Even** (En yakın çifte yuvarlama) kullanır.
Amaç istatistiksel sapmayı (bias) engellemektir.

**Kural:**
1.  Tam ortada değilse (0.5 değilse): En yakına yuvarla.
2.  Tam ortadaysa (Örn: ...1.5):
    *   Eğer LSB (Least Significant Bit) **0 ise** (çift), aşağı yuvarla.
    *   Eğer LSB **1 ise** (tek), yukarı yuvarla (çift yap).

**Örnek (Ondalıkta Round-to-Even):**
*   $1.4 \to 1$
*   $1.6 \to 2$
*   $1.5 \to 2$ (2 çifttir)
*   $2.5 \to 2$ (2 çifttir, aşağı yuvarladı!)

## 5. Floating Point Operations

### Çarpma
1.  Sign: $s1 \oplus s2$
2.  Exp: $E1 + E2$
3.  Frac: $M1 \times M2$
4.  **Normalize:** Eğer $M \ge 2$, sağa kaydır ve E'yi artır.
5.  **Round:** Frac kısmını sığdır.

### Toplama
1.  **Align:** Küçük üslü sayının virgülünü kaydırarak üsleri eşitle.
2.  **Add:** $M1 + M2$
3.  **Normalize & Round.**

### Matematiksel Özellikler
*   **Associativity (Birleşme) YOKTUR!**
    *   `(3.14 + 1e10) - 1e10` $\to$ `0.0` (3.14 kaybolur).
    *   `3.14 + (1e10 - 1e10)` $\to$ `3.14`.
    *   Bu yüzden float toplarken küçük sayıları önce toplamak daha doğrudur.

## 6. Casting (C Dili)

*   **int $\to$ float:** Yuvarlama olabilir (int 32 bit, float'un frac kısmı 23 bit).
*   **int/float $\to$ double:** Tam dönüşüm (double'ın frac kısmı 52 bit, int'i kapsar).
*   **double $\to$ float:** Overflow (+Inf) veya Rounding olabilir.
*   **float/double $\to$ int:**
    *   Kesir atılır (**Truncation**, round-to-zero).
    *   Örn: `1.999` $\to$ `1`.
    *   Overflow olursa (int sınırını aşarsa): **Undefined Behavior** (genelde TMin döner).

> **Exam Tip:**
> ```c
> int x = ...;
> float f = (float) x;
> double d = (double) x;
> ```
> *   `x == (int)(float) x` : **FALSE** (Büyük int'lerde veri kaybı).
> *   `x == (int)(double) x` : **TRUE** (Double int'i kapsar).
> *   `f == (float)(double) f` : **TRUE**.
> *   `d == (double)(float) d` : **FALSE** (Double $\to$ Float veri kaybeder).
