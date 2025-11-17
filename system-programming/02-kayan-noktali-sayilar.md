---
layout: default
title: Kayan Noktalı Sayılar (Floating Point)
nav_order: 2
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

## 3. Örnek: -12.75 Sayısını `float`'a Dönüştürme (Basit Anlatım)

Teoriyi pratiğe dökelim ve `-12.75` sayısını, sanki bir bulmacanın parçalarını birleştirir gibi, adım adım 32-bit `float`'a çevirelim. Amacımız 32 bitlik kutucuğu `s | exp | frac` kuralına göre doldurmak.

---

### **Adım 1: Sayının İşaretini Belirle (`s`)**

*   **Ne yapıyoruz?** Sayımızın pozitif mi negatif mi olduğuna bakıyoruz.
*   **Analiz:** Sayımız `-12.75`, yani negatif.
*   **Sonuç:** IEEE 754 standardına göre negatif sayılar için işaret biti **`1`**'dir.

> **Bulduk:** `s = 1`

---

### **Adım 2: Sayıyı İkili (Binary) Sisteme Çevir**

*   **Ne yapıyoruz?** Sayının pozitif halini (`12.75`) ikili sisteme çeviriyoruz. Bunu iki parça halinde yaparız: virgülden öncesi ve sonrası.
*   **Analiz:**
    *   **Tam Kısım (12):** 12'yi ikiliye çevirirsek `1100`₂ elde ederiz. (8 + 4)
    *   **Ondalık Kısım (0.75):** 0.75'i ikiliye çevirirsek `.11`₂ elde ederiz. (0.5 + 0.25 yani 2⁻¹ + 2⁻²)
*   **Sonuç:** Bu iki parçayı birleştirdiğimizde `1100.11`₂ sayısını elde ederiz.

> **Bulduk:** Sayımızın ikili hali `1100.11`

---

### **Adım 3: Sayıyı Normalize Et (Bilimsel Gösterim)**

*   **Ne yapıyoruz?** İkili sayımızı, `1.` ile başlayacak şekilde bilimsel gösterim formatına getiriyoruz. Tıpkı onluk sistemde `1234` sayısını `1.234 × 10³` olarak yazmak gibi.
*   **Analiz:** `1100.11` sayısında, virgülü 3 basamak sola kaydırarak `1.` formatına ulaşırız.
*   **Sonuç:** `1.10011 × 2³`.
    *   Bu gösterimdeki üs (`3`), bizim **gerçek üs değerimizdir (`E`)**.
    *   Virgülden sonraki kısım (`10011`), bizim **kesir (mantissa) başlangıcımızdır**.

> **Bulduk:** Gerçek üs `E = 3`, Kesir başlangıcı `10011`

---

### **Adım 4: Üs Alanını Hesapla (`exp`)**

*   **Ne yapıyoruz?** `float`'ın 8 bitlik `exp` alanını dolduracağız. Bu alanda gerçek üs değeri doğrudan saklanmaz. Bunun yerine, "sapmalı" (biased) bir değer saklanır. `float` için bu sapma (bias) değeri **127**'dir.
*   **Analiz:** Formülümüz basit: `exp = E + Bias`
*   **Sonuç:** `exp = 3 + 127 = 130`. Şimdi `130`'u 8-bit ikili sayıya çeviriyoruz: `10000010`.

> **Bulduk:** `exp = 10000010`

---

### **Adım 5: Kesir Alanını Doldur (`frac`)**

*   **Ne yapıyoruz?** `float`'ın 23 bitlik `frac` alanını dolduracağız.
*   **Analiz:** 3. adımda bulduğumuz kesir başlangıcı `10011` idi. Bu kısmı, toplam 23 bit olacak şekilde sonuna sıfırlar ekleyerek tamamlarız.
*   **Sonuç:** `10011`**`000000000000000000`** (5 bit + 18 tane 0)

> **Bulduk:** `frac = 10011000000000000000000`

---

### **Final: Parçaları Birleştir!**

Artık bulmacanın tüm parçalarına sahibiz. Onları `s | exp | frac` sırasına göre birleştirelim:

*   **s:** `1`
*   **exp:** `10000010`
*   **frac:** `10011000000000000000000`

**Sonuç:**
`1 10000010 10011000000000000000000`

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

## 4. Üs Alanının Sırrı: Sayının Kategorisini Anlamak

Bir `float` sayısının 32 bitine baktığımızda, bu bitlerin ne anlama geldiğini çözen bir **anahtar** vardır: 8 bitlik **`exp` (üs)** alanı.

Bu alanı, bir sayının hangi "kategoride" olduğunu belirleyen bir **mod seçme anahtarı** gibi düşünebilirsiniz. `exp` alanının değeri, bilgisayara şunu söyler: "Karşındaki bitleri normal bir sayı gibi mi okuyacaksın, yoksa bu özel bir durum mu?"

Bu anahtarın üç temel konumu vardır:

---

### **Konum 1: Normal Sayılar (exp ne `00...0` ne de `11...1` ise)**

Bu, en sık karşılaşacağımız, "standart" konumdur. `exp` alanı `00000000` veya `11111111` **değilse**, bilgisayar bunun normal bir ondalıklı sayı olduğunu anlar.

*   **Ne Anlama Gelir?** `12.75`, `-0.5`, `10000.0` gibi aklınıza gelebilecek sayıların neredeyse tamamı bu kategoridedir.
*   **En Önemli Kural (Gizli Bit Hilesi):** Bu modda bilgisayar, sayının kesir kısmının (`frac`) başında gizli bir `1.` olduğunu varsayar. Yani, `frac` alanı `10011...` ise, bilgisayar bunu `1.10011...` olarak okur. Bu akıllıca hile, bize fazladan 1 bitlik hassasiyet kazandırır ve sayıları daha verimli saklamamızı sağlar.

---

### **Konum 2: Sıfır ve Sıfıra Çok Yakın Sayılar (exp `00...0` ise)**

Eğer `exp` anahtarı `00000000` konumuna getirilirse, bilgisayar "Dikkat, bu sayı ya sıfır ya da sıfıra aşırı yakın!" moduna geçer.

*   **Bu ne anlama gelir?** Bu mod, normal sayıların temsil edemeyeceği kadar küçük değerler için kullanılır.
*   **İki alt durumu vardır:**
    1.  Eğer `frac` alanı da tamamen `0` ise, sayı tam olarak **Sıfır**'dır (`+0.0` veya `-0.0`).
    2.  Eğer `frac` alanında `1`'ler varsa, sayı **Denormalized**'dir. Bunlar, o kadar küçük sayılardır ki, "gizli `1.`" hilesini kullanamayız. Bu mod, sayıların aniden sıfıra düşmesi yerine, yavaşça sıfıra yaklaşmasını sağlar ("gradual underflow").

---

### **Konum 3: Özel Değerler - Sonsuz ve Hata Kodları (exp `11...1` ise)**

Eğer `exp` anahtarı `11111111` konumuna getirilirse, bilgisayar "Normal bir sayıyla uğraşmıyoruz, bu özel bir durum!" moduna geçer. Bu, programın çökmesini önleyen bir güvenlik mekanizmasıdır.

*   **Bu ne anlama gelir?** Sonuç, matematiksel bir sayı değildir.
*   **İki alt durumu vardır:**
    1.  Eğer `frac` alanı tamamen `0` ise, sonuç **Sonsuz (Infinity)**'dur. Bu, `1.0 / 0.0` gibi bir işlemin sonucudur.
    2.  Eğer `frac` alanında `1`'ler varsa, sonuç **NaN (Not a Number - Sayı Değil)**'dir. Bu, `sqrt(-1)` veya `0.0 / 0.0` gibi geçersiz işlemlerin sonucunu temsil eden bir tür "hata kodudur".

Bu yapı, bilgisayarın hem çok geniş bir aralıktaki sayıları temsil etmesini hem de matematiksel olarak imkansız durumlarla başa çıkabilmesini sağlar.

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

## 6. Alıştırma Soruları

<div class="quiz-question">
  <p><b>Soru:</b> `6.5` ondalık sayısının 32-bit IEEE 754 `float` temsilinin hexadecimal karşılığı nedir?</p>
  <div class="quiz-option" data-correct="true">A) `0x40D00000`</div>
  <div class="quiz-option">B) `0xC0D00000`</div>
  <div class="quiz-option">C) `0x41D00000`</div>
  <div class="quiz-option">D) `0x3F800000`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Adım adım çözelim:
    <ol>
        <li><b>İşaret (s):</b> Sayı pozitif, yani `s = 0`.</li>
        <li><b>İkiliye Çevirme:</b> `6.5` = `4 + 2 + 0.5` = `110.1`₂.</li>
        <li><b>Normalizasyon:</b> `110.1` = `1.101 × 2²`. Buradan gerçek üs `E = 2`'dir.</li>
        <li><b>Üs (exp) Hesaplama:</b> `exp = E + bias` = `2 + 127 = 129`. `129`'un 8-bit ikili karşılığı `10000001`₂'dir.</li>
        <li><b>Kesir (frac) Hesaplama:</b> Normalizasyondaki `1.` den sonra gelen kısım `101`'dir. Bunu 23 bite tamamlarız: `10100000000000000000000`.</li>
        <li><b>Birleştirme:</b> `s | exp | frac` = `0 | 10000001 | 10100000000000000000000`.</li>
        <li><b>Hex'e Çevirme:</b> Bu 32 bitlik sayıyı 4'erli gruplara ayırıp hex'e çevirirsek: `0100 0000 1101 0000 ...` = `40D00000`.</li>
    </ol>
    </p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> 32-bit `float` olarak `0xC1480000` hexadecimal değeriyle temsil edilen ondalık sayı nedir?</p>
  <div class="quiz-option">A) `12.5`</div>
  <div class="quiz-option">B) `25.0`</div>
  <div class="quiz-option" data-correct="true">C) `-12.5`</div>
  <div class="quiz-option">D) `-25.0`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Adım adım tersten gidelim:
    <ol>
        <li><b>Hex'i İkiliye Çevirme:</b> `0xC1480000` = `1100 0001 0100 1000 0000 0000 0000 0000`₂.</li>
        <li><b>Parçalara Ayırma:</b> `s | exp | frac`
            <ul>
                <li><b>s (işaret):</b> `1` (Sayı negatif)</li>
                <li><b>exp (üs):</b> `10000010`₂ = `130`</li>
                <li><b>frac (kesir):</b> `1001000...`</li>
            </ul>
        </li>
        <li><b>Gerçek Üssü Bulma:</b> `E = exp - bias` = `130 - 127 = 3`.</li>
        <li><b>Sayının Değerini Bulma:</b> Formül: `(-1)ˢ × (1.frac)₂ × 2ᴱ`. (Normal sayılarda baştaki `1.` gizlidir).
            <ul>
                <li>`= (-1)¹ × (1.1001)₂ × 2³`</li>
                <li>`= -1 × (1100.1)₂` (Virgülü 3 basamak sağa kaydır)</li>
                <li>`= -1 × (8 + 4 + 0 + 0 + 0.5)`</li>
                <li><b>`= -12.5`</b></li>
            </ul>
        </li>
    </ol>
    </p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> IEEE 754 standardında `float` türü için `bias` (sapma) değeri 127 olarak kullanılır. Bunun temel sebebi nedir?</p>
  <div class="quiz-option">A) 127'nin asal sayı olması.</div>
  <div class="quiz-option">B) Bellekte temsilinin kolay olması.</div>
  <div class="quiz-option" data-correct="true">C) Üs (exponent) alanının hem negatif hem de pozitif üsleri işaretsiz bir tamsayı olarak saklamasına olanak tanıması.</div>
  <div class="quiz-option">D) İşlemci tarafından en hızlı işlenen sayı olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> 8-bitlik `exp` alanı `0` ile `255` arasında değerler alabilir. `Bias` kullanarak, bu aralığın yaklaşık yarısı negatif üslere (çok küçük sayılar için), yarısı da pozitif üslere (çok büyük sayılar için) ayrılmış olur. Örneğin, `exp` alanı `126` ise gerçek üs `126 - 127 = -1` olur. `exp` alanı `128` ise gerçek üs `128 - 127 = 1` olur. Bu sayede, üs için ayrı bir işaret biti kullanmaya gerek kalmaz ve karşılaştırma işlemleri donanım seviyesinde basitleşir.</p>
  </div>
</div>