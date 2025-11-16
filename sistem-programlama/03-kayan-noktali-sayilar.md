---
layout: default
title: Kayan Noktalı Sayılar (Floating Point)
nav_order: 3
parent: Sistem Programlama
---

# Kayan Noktalı Sayılar (Floating Point)

Tamsayılar, sayı dünyasının sadece bir kısmıdır. Bilimsel, mühendislik ve grafik hesaplamaları gibi birçok alanda ondalıklı, yani "reel" sayılarla çalışmamız gerekir. Bu bölümde, bu sayıların bilgisayarda **IEEE 754** standardına göre nasıl temsil edildiğini ve bu temsilin getirdiği önemli sonuçları inceleyeceğiz.

---

## 1. Kesirli İkili Sayılar

Tıpkı ondalık sistemde virgülün sağındaki basamakların 10'un negatif kuvvetlerini (1/10, 1/100) temsil etmesi gibi, ikili sistemde de "binary point"in sağındaki basamaklar 2'nin negatif kuvvetlerini (1/2, 1/4, 1/8) temsil eder.

**Örnek:**
`101.11` (binary) = (1 * 2²) + (0 * 2¹) + (1 * 2⁰) + (1 * 2⁻¹) + (1 * 2⁻²)
= 4 + 0 + 1 + 0.5 + 0.25
= `5.75` (decimal)

Ancak burada önemli bir kısıtlama vardır: Sadece paydası 2'nin kuvveti olan kesirler tam olarak temsil edilebilir. `1/3`, `1/5` veya ondalık sistemde çok basit görünen `0.1` (1/10) gibi sayılar, ikili sistemde sonsuz tekrar eden kesirler olarak ifade edilir ve bu da hassasiyet kayıplarına yol açar.

---

## 2. IEEE 754 Standardı

Farklı bilgisayar sistemleri arasında tutarlılık sağlamak için geliştirilen IEEE 754, kayan noktalı sayıların bellekte nasıl temsil edileceğini tanımlayan evrensel bir standarttır.

Bir sayı, bilimsel gösterime benzer şekilde şu formülle ifade edilir:
**(-1)ˢ × M × 2ᴱ**

Bu formülün üç ana bileşeni, bellekte bit alanlarına bölünerek saklanır:

1.  **`s` (sign - işaret):** 1 bit. `0` pozitif, `1` negatif.
2.  **`exp` (exponent - üs):** `E` değerini saklar. Sayının büyüklük mertebesini belirler.
3.  **`frac` (fraction - kesir):** `M` (mantissa veya significand) değerini saklar. Sayının hassasiyetini (anlamlı rakamlarını) belirler.

![IEEE 754 Formatı](https://via.placeholder.com/700x200.png?text=Sign+(1)+|++Exponent+(k)++|++Fraction+(n))
*Görsel: IEEE 754 standardının genel yapısı.*

### Hassasiyet Seviyeleri

*   **Single Precision (`float`):** 32-bit.
    *   1 bit işaret, 8 bit üs, 23 bit kesir.
*   **Double Precision (`double`):** 64-bit.
    *   1 bit işaret, 11 bit üs, 52 bit kesir.

---

## 3. Değer Türleri: Normalized, Denormalized ve Özel Değerler

`exp` alanının değeri, sayının türünü belirler.

### a) Normalized (Normalleştirilmiş) Değerler
Bu, en yaygın durumdur.
*   **Koşul:** `exp` alanı ne tamamen `0` ne de tamamen `1`'lerden oluşur.
*   **Üs (E):** `E = exp - Bias`. `Bias` (sapma), üssün hem pozitif hem de negatif değerler alabilmesini sağlayan bir sabittir (`float` için 127, `double` için 1023).
*   **Mantissa (M):** `M = 1 + frac`. Burada "gizli bir 1" (`implicit leading 1`) varsayılır. Bu, fazladan bir bit hassasiyet kazanmamızı sağlar.

### b) Denormalized (Normalleştirilmemiş) Değerler
Sıfıra çok yakın sayıları temsil etmek için kullanılırlar.
*   **Koşul:** `exp` alanı tamamen `0`'lardan oluşur.
*   **Üs (E):** `E = 1 - Bias`. Sabit bir üs değeri kullanılır.
*   **Mantissa (M):** `M = frac`. Artık "gizli 1" varsayımı yoktur. Bu, sıfıra doğru kademeli bir geçiş (gradual underflow) sağlar. `+0.0` ve `-0.0` da bu kategoriye girer.

### c) Özel Değerler
*   **Koşul:** `exp` alanı tamamen `1`'lerden oluşur.
    *   **Sonsuz (Infinity):** `frac` alanı tamamen `0` ise. `1/0.0` gibi işlemlerin sonucudur.
    *   **NaN (Not a Number):** `frac` alanı `0` değilse. `sqrt(-1)` veya `∞ - ∞` gibi tanımsız işlemlerin sonucudur.

---

## 4. Yuvarlama (Rounding)

Hesaplamaların sonucu genellikle mevcut bit sayısından daha fazla hassasiyet gerektirdiğinde, sonucun yuvarlanması gerekir. Varsayılan ve en yaygın mod **Round-to-Nearest-Even**'dır:
*   Sayıyı en yakın temsil edilebilir değere yuvarla.
*   Eğer sayı iki temsil edilebilir değerin tam ortasındaysa, en anlamsız biti `0` olan (yani çift olan) komşuya yuvarla. Bu, istatistiksel sapmayı (bias) önler.

---

## 5. C Dilinde Kayan Noktalı Sayılar

C dilindeki `float` ve `double` tipleri, IEEE 754 standardına karşılık gelir. Tipler arası dönüşümlerde dikkatli olunmalıdır:
*   `double`/`float` -> `int`: Ondalık kısım **kırpılır (truncate)**, yuvarlanmaz. `(int) 3.99` işleminin sonucu `3`'tür.
*   `int` -> `double`: Genellikle hassasiyet kaybı olmaz, çünkü `double`'ın kesir alanı (`52 bit`) bir `int`'in tüm bitlerini (`32` veya `64`) saklayabilir.
*   `int` -> `float`: Hassasiyet kaybı yaşanabilir. `float`'ın kesir alanı (`23 bit`) büyük `int` değerlerinin tüm anlamlı basamaklarını saklayamayabilir.

**Önemli Sonuç:** Kayan noktalı sayı aritmetiği, matematikteki reel sayı aritmetiğinin özelliklerini her zaman taşımaz. Özellikle **birleşme (associativity)** özelliği geçerli değildir:
`(x + y) + z` her zaman `x + (y + z)`'ye eşit olmayabilir! Bu nedenle, `float` veya `double` değerlerini `==` ile karşılaştırmak genellikle kötü bir fikirdir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Aşağıdaki ondalık kesirlerden hangisi, ikili (binary) sistemde **tam olarak** temsil edilebilir?</p>
  <div class="quiz-option">A) `0.1` (1/10)</div>
  <div class="quiz-option">B) `0.2` (1/5)</div>
  <div class="quiz-option">C) `0.3` (3/10)</div>
  <div class="quiz-option" data-correct="true">D) `0.75` (3/4)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Bir kesrin ikili sistemde tam olarak temsil edilebilmesi için paydasının 2'nin bir kuvveti olması gerekir. 3/4'ün paydası 4 (yani 2²), bu koşulu sağlar. Diğer seçeneklerin paydaları (10, 5) 2'nin kuvveti olmadığı için ikili sistemde sonsuz tekrar eden kesirler oluştururlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> IEEE 754 `float` (32-bit) standardında, `exp` bit alanı tamamen `1`'lerden, `frac` bit alanı ise tamamen `0`'lardan oluşuyorsa, bu hangi özel değeri temsil eder?</p>
  <div class="quiz-option">A) `+0.0`</div>
  <div class="quiz-option">B) `Denormalized` bir sayı</div>
  <div class="quiz-option" data-correct="true">C) `Sonsuz (Infinity)`</div>
  <div class="quiz-option">D) `NaN (Not a Number)`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `exp` alanının tamamen `1`'lerden oluşması özel bir durumu belirtir. Eğer bu durumda `frac` alanı sıfır ise değer `Sonsuz`, sıfırdan farklı ise `NaN` olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> C dilinde `int x = (int) -2.9;` kodu çalıştırıldığında `x` değişkeninin değeri ne olur?</p>
  <div class="quiz-option">A) `-3`</div>
  <div class="quiz-option" data-correct="true">B) `-2`</div>
  <div class="quiz-option">C) Derleme hatası verir.</div>
  <div class="quiz-option">D) `-2.9`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kayan noktalı bir sayıyı `int` tipine dönüştürürken, sayı yuvarlanmaz, ondalık kısmı doğrudan atılır (truncation). Bu nedenle `-2.9`'un ondalık kısmı atıldığında geriye `-2` kalır.</p>
  </div>
</div>
