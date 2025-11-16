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

| İşaret (s) | Üs (exp) | Kesir (frac) |
|:----------:|:--------:|:------------:|
| 1 bit      | k bit    | n bit        |


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

```
1 10000010 10011000000000000000000
```

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

## 4. Interpreting the Bits: What the Exponent Tells Us (Bitleri Yorumlamak: Üs Bize Ne Söyler?)

Bir kayan noktalı sayının bitlerine baktığımızda, en önemli ipucunu **üs (`exp`)** alanı verir. Bu alan, sayının hangi "kategoride" olduğunu belirleyen bir anahtar gibidir. Üç ana durum vardır:

### Case 1: Normalized (Normal Sayılar - En Yaygın Durum)

*   **Ne zaman?** `exp` alanı ne tamamen `0`'lardan ne de tamamen `1`'lerden oluşuyorsa.
*   **Bu ne anlama gelir?** Bu, "normal", standart bir ondalıklı sayıdır. `12.75`, `-0.5`, `10000.0` gibi sayıların hepsi bu kategoriye girer.
*   **Önemli Kural:** Bu modda, bilgisayar sayının başında gizli bir `1.` olduğunu varsayar (`1.fraction...`). Bu, fazladan bir bitlik hassasiyet kazanmamızı sağlayan akıllıca bir hiledir.

### Case 2: Denormalized & Zeros (Sıfıra Yakın Sayılar ve Sıfırlar)

*   **Ne zaman?** `exp` alanı tamamen `0`'lardan (`00...0`) oluşuyorsa.
*   **Bu ne anlama gelir?** Sayı ya sıfırın kendisidir ya da sıfıra çok yakındır.
    *   Eğer `frac` alanı da tamamen `0` ise, sayı **Sıfır**'dır (`+0.0` veya `-0.0`).
    *   Eğer `frac` alanında `1` varsa, sayı **Denormalized**'dir. Bunlar, "normal" olamayacak kadar küçük sayılardır. Bu modda gizli `1.` kuralı uygulanmaz.

### Case 3: Special Values (Özel Durumlar - Sonsuz ve NaN)

*   **Ne zaman?** `exp` alanı tamamen `1`'lerden (`11...1`) oluşuyorsa.
*   **Bu ne anlama gelir?** Sonuç, matematiksel bir sayı değildir.
    *   Eğer `frac` alanı tamamen `0` ise, sonuç **Infinity (Sonsuz)**'dur. `1.0 / 0.0` gibi bir işlemin sonucudur.
    *   Eğer `frac` alanında `1` varsa, sonuç **NaN (Not a Number - Sayı Değil)**'dir. `sqrt(-1)` veya `0.0 / 0.0` gibi geçersiz işlemlerin sonucudur.

<div class="quiz-question">
  <p><b>Soru:</b> Bir `float` sayının `exp` alanı tamamen `1`'lerden, `frac` alanı ise `0`'dan farklı bir değerden oluşuyor. Bu sayı nedir?</p>
  <div class="quiz-option">A) Sonsuz (Infinity)</div>
  <div class="quiz-option" data-correct="true">B) Sayı Değil (NaN)</div>
  <div class="quiz-option">C) Sıfır (Zero)</div>
  <div class="quiz-option">D) Denormalized bir sayı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `exp` alanının tamamen `1` olması, sonucun özel bir durum olduğunu gösterir. `frac` alanının `0`'dan farklı olması ise bu özel durumun `NaN` (Not a Number) olduğunu belirtir.</p>
  </div>
</div>

---

## 5. Rounding and Type Casting in C (C'de Yuvarlama ve Tip Dönüşümleri)

Farklı sayı türleri arasında dönüşüm yapmak, C'de beklenmedik sonuçlara yol açabilir. İşte en önemli kurallar:

*   **`float`/`double` → `int`:** Bu en tehlikeli dönüşümdür. Sayı **yuvarlanmaz**, ondalık kısmı ne olursa olsun basitçe **atılır (truncate)**.
    ```c
    int x = 3.99;  // x'in değeri 3 olur.
    int y = -3.99; // y'nin değeri -3 olur.
    ```

*   **`int` → `double`:** Bu genellikle güvenlidir. `double`'ın hassasiyeti çok yüksek olduğu için veri kaybı yaşanmaz.

*   **`int` → `float`:** Bu riskli olabilir. `int` çok büyük bir değerse, `float`'ın sınırlı hassasiyetine sığmayabilir. Bu durumda sayı, en yakın temsil edilebilir `float` değerine **yuvarlanır** ve hassasiyet kaybolur.
    ```c
    // Bu sonucun tam değeri sisteme göre değişebilir ama fikir aynıdır.
    int big_integer = 123456789;
    float f = (float)big_integer; 
    // f'nin değeri 123456792.0 gibi bir şeye dönüşebilir.
    ```

<div class="quiz-question">
  <p><b>Soru:</b> `int x = (int)-9.99;` C kodu çalıştırıldığında `x`'in değeri ne olur?</p>
  <div class="quiz-option">A) `-10`</div>
  <div class="quiz-option" data-correct="true">B) `-9`</div>
  <div class="quiz-option">C) `-9.99`</div>
  <div class="quiz-option">D) Derleme hatası verir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kayan noktalı bir sayıyı `int`'e dönüştürürken, sayı en yakın tam sayıya yuvarlanmaz. Ondalık kısım (`.99`) ne olursa olsun basitçe atılır (truncate). Bu nedenle sonuç `-9`'dur.</p>
  </div>
</div>

---