---
layout: default
title: Kayan Noktalı Sayılar (Floating Point)
nav_order: 3
parent: System Programming
---

# Kayan Noktalı Sayılar (Floating Point)

Tamsayılar, hesaplama dünyasının temelini oluştursa da ondalıklı sayıların temsili de bir o kadar kritiktir. Bu bölümde, bu sayıların bilgisayarda evrensel olarak kabul görmüş **IEEE 754** standardına göre nasıl temsil edildiğini ve bu yaklaşımın getirdiği önemli sonuçları ele alacağız.

---

## 1. Fractional Binary Representation (Kesirli İkili Sayıların Temsili)

Ondalık sistemde olduğu gibi, ikili sistemde de "virgülün" (binary point) sağındaki basamaklar, tabanın negatif kuvvetlerini ifade eder.

*   **Örnek:** `101.11`₂ ifadesinin ondalık değeri:
    *   = (1 × 2²) + (0 × 2¹) + (1 × 2⁰) + (1 × 2⁻¹) + (1 × 2⁻²)
    *   = 4 + 0 + 1 + 0.5 + 0.25 = **5.75**₁₀

Bu temsilin önemli bir sonucu, `0.1` (1/10) gibi ondalık sistemde basit görünen sayıların, ikili sistemde sonsuz tekrar eden bir açılıma sahip olmasıdır. Bu durum, sonlu bit ile yapılan temsillerde kaçınılmaz olarak **hassasiyet hatalarına** yol açar.

<div class="quiz-question">
  <p><b>Soru:</b> `110.01`₂ ikili sayısının ondalık sistemdeki karşılığı nedir?</p>
  <div class="quiz-option">A) `5.25`</div>
  <div class="quiz-option" data-correct="true">B) `6.25`</div>
  <div class="quiz-option">C) `6.5`</div>
  <div class="quiz-option">D) `5.5`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> (1 × 2²) + (1 × 2¹) + (0 × 2⁰) + (0 × 2⁻¹) + (1 × 2⁻²) = 4 + 2 + 0 + 0 + 0.25 = 6.25.</p>
  </div>
</div>

---

## 2. IEEE 754 Standard: Fitting Numbers into Bits (Sayıları Bitlere Sığdırmak)

Ondalıklı sayıların farklı sistemlerde tutarlı bir şekilde temsil edilmesi için evrensel **IEEE 754** standardı kullanılır. Bu standart, bir sayıyı bilimsel gösterime benzer şekilde üç parçaya ayırır:

**Sayı = (-1)ˢ × M × 2ᴱ**

*   **`s` - Sign (İşaret):** Sayının pozitif (`0`) mi yoksa negatif (`1`) mi olduğunu belirler.
*   **`E` - Exponent (Üs):** Sayının büyüklük mertebesini (ne kadar büyük veya küçük olduğunu) belirler.
*   **`M` - Mantissa (Kesir):** Sayının hassasiyetini (ondalık kısmını) belirler.

Bu üç parça, bellekte belirli bit alanlarına yerleştirilir:
<pre>
  s |   exp   |                  frac
(1 bit) (k bit)               (n bit)
</pre>

C dilindeki `float` ve `double` türleri, bu standardın iki yaygın uygulamasıdır ve farklı hassasiyet seviyeleri sunarlar:

| Tür      | Toplam Bit | İşaret (s) | Üs (exp) | Kesir (frac) |
|:---------|:----------:|:----------:|:--------:|:------------:|
| `float`  |     32     |    1 bit   |   8 bit  |     23 bit     |
| `double` |     64     |    1 bit   |  11 bit  |     52 bit     |

---

## 3. Örnek: `-12.75` Sayısını `float`'a Dönüştürme

Teoriyi pratiğe dökelim ve `-12.75` sayısını adım adım 32-bit `float`'a çevirelim.

**Adım 1: İşaret Biti (`s`)**
Sayı negatif olduğu için işaret biti **`1`**'dir.

**Adım 2: Sayıyı İkili Sisteme Çevirme**
*   `12`'nin ikili karşılığı: `1100`
*   `0.75`'in ikili karşılığı: `0.5 + 0.25` => `2⁻¹ + 2⁻²` => `.11`
*   Birleştir: `1100.11`₂

**Adım 3: Normalize Etme (1.M Formatına Getirme)**
Sayıyı, başında `1.` olacak şekilde yazarız ve virgülü kaç basamak kaydırdığımızı not ederiz.
*   `1100.11` = `1.10011 × 2³`
*   Buradan gerçek üs değerimiz **`E = 3`** çıkar.
*   Virgülün sağında kalan kısım ise **`M`**'nin kesir kısmıdır: `10011`.

**Adım 4: Üs Bitlerini (`exp`) Hesaplama**
`float` için **Bias** değeri `127`'dir. `exp` alanı, `E + Bias` formülüyle hesaplanır.
*   `exp` = `3 + 127 = 130`
*   `130`'un 8-bit ikili karşılığı: **`10000010`**

**Adım 5: Kesir Bitlerini (`frac`) Doldurma**
`frac` alanı, 3. adımda bulduğumuz `10011` ile başlar ve 23 bite tamamlanacak şekilde sağına `0`'lar eklenir.
*   `frac` = **`10011000000000000000000`**

**Sonuç: Bitleri Birleştirme**
Bulduğumuz üç parçayı birleştirelim:
*   `s`: `1`
*   `exp`: `10000010`
*   `frac`: `10011000000000000000000`

<pre>1 10000010 10011000000000000000000</pre>

İşte `-12.75` sayısının 32-bit `float` olarak bellekteki tam karşılığı budur.

<div class="quiz-question">
  <p><b>Soru:</b> Yukarıdaki `-12.75` örneğinde, eğer sayı `+12.75` olsaydı, 32 bitlik desende toplam kaç bit değişirdi?</p>
  <div class="quiz-option" data-correct="true">A) Sadece 1 bit</div>
  <div class="quiz-option">B) 32 bitin hepsi</div>
  <div class="quiz-option">C) 8 bit</div>
  <div class="quiz-option">D) Hiçbiri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Sayının pozitif veya negatif olması sadece en soldaki işaret bitini (`s`) etkiler. Diğer tüm `exp` ve `frac` bitleri sayının mutlak değeri (`12.75`) üzerinden hesaplandığı için aynı kalırdı. İşaret biti `1`'den `0`'a dönerdi, yani sadece 1 bit değişirdi.</p>
  </div>
</div>

---

## 4. Interpreting the Bits: The Different States of Numbers (Bitlerin Anlamını Değiştirmek)

Bilgisayar, `exp` alanındaki bit desenine bakarak sayının "normal" mi, "sıfıra çok yakın" mı, yoksa "özel bir durum" mu olduğunu anlar. Bu durumlar aşağıdaki tabloda özetlenmiştir:

| Kategori | `exp` Değeri | `frac` Değeri | Anlamı ve Formülü |
| :--- | :--- | :--- | :--- |
| **Normalized** (Normal Sayılar) | Ne `0...0` ne de `1...1` | Herhangi bir değer | En yaygın durum. Sayı = (-1)ˢ × **1**.frac × 2^(exp - Bias) |
| **Denormalized** (Sıfıra Yakın Sayılar) | `0...0` | `0`'dan farklı | Sıfıra çok yakın sayıları temsil eder. Sayı = (-1)ˢ × **0**.frac × 2^(1 - Bias) |
| **Zero** (Sıfır) | `0...0` | `0...0` | İşaret bitine göre `+0.0` veya `-0.0` |
| **Special** (Özel Durumlar) | `1...1` | - | İşlemlerin sayısal olmayan sonuçları için. |
| &nbsp;&nbsp;&nbsp; _Infinity_ (Sonsuz) | `1...1` | `0...0` | Sayı taşması (`1/0`) gibi durumlar. |
| &nbsp;&nbsp;&nbsp; _NaN_ (Sayı Değil) | `1...1` | `0`'dan farklı | Geçersiz işlemler (`sqrt(-1)`) için. |

<div class="quiz-question">
  <p><b>Soru:</b> Bir `float` hesaplaması sonucunda `exp` bitlerinin tamamı `1`, `frac` bitlerinin tamamı `0` olarak bulundu. Bu sonuç nedir?</p>
  <div class="quiz-option">A) `NaN` (Sayı Değil)</div>
  <div class="quiz-option">B) `+0.0`</div>
  <div class="quiz-option" data-correct="true">C) `Infinity` (Sonsuz)</div>
  <div class="quiz-option">D) En büyük normal sayı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `exp` alanının tamamen `1` olması özel bir durumu belirtir. `frac` alanının da tamamen `0` olması bu özel durumun `Infinity` (Sonsuz) olduğunu tanımlar.</p>
  </div>
</div>

---

## 5. Rounding and Casting in C (Yuvarlama ve C'deki Tip Dönüşümleri)

Hesaplamaların sonucu hassas olduğunda veya farklı sayı türleri arasında dönüşüm yapıldığında, C dilinin belirli kuralları vardır. Bu dönüşümler aşağıdaki tabloda özetlenmiştir:

| Dönüşüm | Kural / Davranış | Örnek |
| :--- | :--- | :--- |
| `float`/`double` → `int` | Ondalık kısım **atılır (truncate)**. Sayı sıfıra doğru yuvarlanır. | `(int) 3.99` → `3`<br>`(int) -3.99` → `-3` |
| `int` → `double` | Değer genellikle tam olarak korunur. Hassasiyet kaybı yaşanmaz. | `(double) 12345` → `12345.0` |
| `int` → `float` | Büyük sayılarda `float`'ın hassasiyeti yetmeyebilir ve sayı **yuvarlanabilir**. | `(float) 123456789` → `123456792.0` |

<div class="quiz-question">
  <p><b>Soru:</b> `int x = (int) -5.9;` C kodu çalıştırıldığında `x`'in değeri ne olur?</p>
  <div class="quiz-option">A) `-6`</div>
  <div class="quiz-option">B) `6`</div>
  <div class="quiz-option">C) `-5.9`</div>
  <div class="quiz-option" data-correct="true">D) `-5`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Kayan noktalı bir sayıyı `int`'e dönüştürürken, sayı yuvarlanmaz. Ondalık kısım (`.9`) ne olursa olsun basitçe atılır (truncate edilir). Bu nedenle sonuç `-5`'tir.</p>
  </div>
</div>

---