---
layout: default
title: Bitler ve Tamsayılar
nav_order: 2
parent: System Programming
---

# Bitler, Baytlar ve Tamsayılar

Dijital dünyadaki her şeyin temelinde **bit**'ler yatar. Bu bölümde, verinin bu en temel formda nasıl temsil edildiğini, manipüle edildiğini ve tamsayılar gibi daha karmaşık yapıları nasıl oluşturduğunu inceleyeceğiz.

---

## 1. Binary (İkili) Temsili

Bilgisayarlar, bilgiyi depolamak ve işlemek için sadece iki durumu anlarlar: açık veya kapalı, yüksek voltaj veya düşük voltaj. Bu iki duruma karşılık gelen rakamlar **1** ve **0**'dır. Tek bir 1 veya 0'a **bit** denir.

*   **Byte (Bayt):** 8 bitten oluşan bir grupdur. Bellekteki en küçük adreslenebilir birimdir. Bir bayt, `00000000`'dan `11111111`'e kadar 256 (2⁸) farklı değer alabilir.
*   **Word (Kelime):** Bir işlemcinin tek seferde işlediği doğal veri boyutudur. Modern sistemlerde genellikle 32-bit (4 bayt) veya 64-bit (8 bayt) olur.

**Hexadecimal (Onaltılık) Gösterim:** İkili sayılar çok uzun olabildiği için, genellikle daha kompakt olan hexadecimal (16'lık taban) gösterimi kullanılır. Her bir hexadecimal rakam, 4 bite karşılık gelir.
*   Rakamlar: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F`
*   Örnek: `1111 1111` (binary) = `255` (decimal) = `FF` (hexadecimal)

---

## 2. Bellek Organizasyonu ve Endianness (Bayt Sıralaması) ([Test Sorusu](#quiz-endianness))

### Byte Ordering (Endianness)

Bellek, her biri ardışık bir adrese sahip olan bir bayt dizisidir. `int` gibi birden fazla bayt kaplayan bir veri türünü belleğe kaydederken, bu baytların hangi sırayla (düşük adresten yüksek adrese doğru) yerleştirileceğini belirleyen kurala **Endianness** denir.

Bunu anlamak için 4 baytlık `0x01234567` sayısını ele alalım. Bu sayının baytları şunlardır:
*   `01` (En Anlamlı Bayt - Most Significant Byte, MSB)
*   `23`
*   `45`
*   `67` (En Anlamsız Bayt - Least Significant Byte, LSB)

Bu sayıyı `A` adresinden başlayan belleğe yerleştirmenin iki yolu vardır:

*   **Big-Endian:** Baytlar, sayıyı yazdığımız ve okuduğumuz gibi, **en anlamlıdan en anlamsıza** doğru sıralanır. En anlamlı bayt (`01`), en düşük adrese gelir. Ağ protokolleri genellikle bu düzeni kullanır.

*   **Little-Endian:** Baytlar, **en anlamsızdan en anlamlıya** doğru, yani tersten sıralanır. En anlamsız bayt (`67`), en düşük adrese gelir. Modern işlemcilerin (Intel, AMD) çoğu bu yöntemi kullanır.

Aşağıdaki şema, iki düzen arasındaki farkı net bir şekilde göstermektedir:

<pre>
Sayı: 0x01234567

Big-Endian Düzeni:              Little-Endian Düzeni:
 Adres | Değer                   Adres | Değer
-------|-------                 -------|-------
   A   |  01                       A   |  67
  A+1  |  23                      A+1  |  45
  A+2  |  45                      A+2  |  23
  A+3  |  67                      A+3  |  01
</pre>

<div class="quiz-question" id="quiz-endianness">
  <p><b>Soru:</b> Little-Endian bir sistemde, 32-bit `0x12345678` tamsayısı belleğin `0x100` adresine yazılırsa, `0x101` adresinde hangi bayt değeri bulunur?</p>
  <div class="quiz-option">A) `0x12`</div>
  <div class="quiz-option">B) `0x34`</div>
  <div class="quiz-option" data-correct="true">C) `0x56`</div>
  <div class="quiz-option">D) `0x78`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Little-Endian sistemlerde, en anlamsız (en sağdaki) bayt en düşük adrese yazılır. Bu durumda sıralama şöyle olur: Adres `0x100`: `0x78`, Adres `0x101`: `0x56`, Adres `0x102`: `0x34`, Adres `0x103`: `0x12`.</p>
  </div>
</div>

---

## 3. Bit Seviyesi Mantıksal Operasyonlar

C dilinde, tamsayıların bitlerini doğrudan manipüle etmemizi sağlayan güçlü operatörler bulunur. Bu operatörler, donanıma yakın seviyede kontrol ve optimizasyon imkanı tanır.

Örnekler için `a = 93` (yani `01011101`) ve `b = 148` (yani `10010100`) sayılarını kullanalım.

*   `&` **(AND):** İki bitte de karşılıklı olarak `1` varsa sonuç `1` olur. Genellikle belirli bitleri "maskelemek" (izole etmek) veya "sıfırlamak" için kullanılır.
    <pre>
      01011101  (a)
    & 10010100  (b)
      --------
      00010100  (Sonuç: 20)
    </pre>

*   `|` **(OR):** İki bitten en az biri `1` ise sonuç `1` olur. Belirli bitleri "açmak" (1 yapmak) için kullanılır.
    <pre>
      01011101  (a)
    | 10010100  (b)
      --------
      11011101  (Sonuç: 221)
    </pre>

*   `^` **(XOR - Exclusive OR):** İki bit birbirinden farklıysa (`0` ve `1`) sonuç `1` olur. Belirli bitleri "ters çevirmek" (toggle) için kullanılır.
    <pre>
      01011101  (a)
    ^ 10010100  (b)
      --------
      11001001  (Sonuç: 201)
    </pre>

*   `~` **(NOT):** Tek bir sayının tüm bitlerini ters çevirir (`0` olanlar `1`, `1` olanlar `0` olur).
    <pre>
    ~ 01011101  (a)
      --------
      10100010  (Sonuç: -94, 2'ye tümleyen gösteriminde)
    </pre>

### Shift (Kaydırma) Operasyonları

Bu operatörler, bir sayının bitlerini belirli bir sayıda sola veya sağa kaydırır.

*   `<<` **(Left Shift):** Tüm bitleri sola kaydırır. Sağdan boşalan yerlere `0` eklenir. `x << k` işlemi, `x` sayısını `2^k` ile çarpmakla eşdeğerdir.
    <pre>
    a << 3;  // 93 sayısını 3 bit sola kaydır

    Başlangıç: 01011101 (93)
    Sonuç:     11101000 (232)
    </pre>

*   `>>` **(Right Shift):** Tüm bitleri sağa kaydırır. Bu işlemin iki türü vardır:
    *   **Logical Right Shift (Mantıksal Sağa Kaydırma):** Soldan boşalan yerlere her zaman `0` eklenir. Bu, C'de `unsigned` (işaretsiz) tamsayılara uygulanır.
        <pre>
        unsigned int u = 240; // 11110000
        u >> 2;

        Başlangıç: 11110000 (240)
        Sonuç:     00111100 (60)
        </pre>
    *   **Arithmetic Right Shift (Aritmetik Sağa Kaydırma):** Soldan boşalan yerlere, sayının işaretini korumak için en soldaki **işaret biti** kopyalanır. `signed` (işaretli) tamsayılara uygulanır. Negatif sayılar için bölme işleminin doğru çalışmasını sağlar.
        <pre>
        signed char s = -16; // 11110000 (8-bit 2'ye tümleyen)
        s >> 2;

        Başlangıç: 11110000 (-16)
        Sonuç:     11111100 (-4)
        </pre>
---

## 4. Tamsayıların Temsili ([Test Sorusu](#quiz-twos-complement))

Bilgisayarların tamsayıları nasıl sakladığını anlamak, programlamada karşılaşılan birçok hatanın (örneğin, `overflow`) önüne geçmemizi sağlar. Sayıları temsil etmenin iki ana yolu vardır.

### Unsigned (İşaretsiz) Tamsayılar
Bu yöntemde, bir sayının sahip olduğu tüm bitler doğrudan sayının büyüklüğünü temsil eder. Negatif sayılar veya işaret bilgisi yoktur.

*   `w` bitlik bir işaretsiz tamsayı, **0** ile **2ʷ-1** arasındaki değerleri alabilir.
*   **Örnek (4-bit):** `0000` (0) ile `1111` (15) arasındaki 16 farklı sayıyı temsil edebilir.

### Signed (İşaretli) Tamsayılar: Two's Complement (İkinin Tümleyeni)
Modern bilgisayarlarda işaretli tamsayılar için standart olan ve aritmetik işlemleri çok basitleştiren yöntem budur.

*   **Sign Bit (İşaret Biti):** En soldaki bit işaret için ayrılmıştır. `0` sayının pozitif, `1` ise negatif olduğunu gösterir.
*   **Değer Aralığı:** `w` bitlik bir işaretli tamsayı, **-2ʷ⁻¹** ile **2ʷ⁻¹-1** arasındaki değerleri alabilir.
*   **Örnek (4-bit):** `-2³` (-8) ile `2³-1` (+7) arasındaki 16 farklı sayıyı temsil edebilir.

Aşağıdaki tablo, 4-bitlik bir sayının işaretsiz ve işaretli (ikinin tümleyeni) olarak nasıl yorumlandığını gösterir:

<pre>
| Bit Deseni | Unsigned Değeri | Signed (Two's Complement) Değeri |
|------------|-----------------|----------------------------------|
|   0000     |        0        |                0                 |
|   0001     |        1        |                1                 |
|   0010     |        2        |                2                 |
|   0011     |        3        |                3                 |
|   0100     |        4        |                4                 |
|   0101     |        5        |                5                 |
|   0110     |        6        |                6                 |
|   0111     |        7        |                7                 |
|   1000     |        8        |               -8                 |
|   1001     |        9        |               -7                 |
|   1010     |       10        |               -6                 |
|   1011     |       11        |               -5                 |
|   1100     |       12        |               -4                 |
|   1101     |       13        |               -3                 |
|   1110     |       14        |               -2                 |
|   1111     |       15        |               -1                 |
</pre>

**Bir Sayının Negatifini Bulma (Pratik Yöntem): `(~x + 1)`**

Bir `x` sayısının negatifini (`-x`) bulmak için:
1.  Sayının tüm bitlerini ters çevir (`~` operatörü).
2.  Sonuca 1 ekle.

**Örnek: 5 sayısını -5 yapalım (4-bit üzerinde)**
1.  `5`'in bit deseni: `0101`
2.  Tüm bitleri ters çevir (`~`): `1010`
3.  Sonuca 1 ekle: `1010 + 1 = 1011`
4.  Tabloya baktığımızda `1011`'in gerçekten de `-5`'e karşılık geldiğini görürüz.

Bu sistemin en büyük avantajı, toplama ve çıkarma işlemlerinin işaretli ve işaretsiz sayılar için aynı donanım devresiyle yapılabilmesidir.

<div class="quiz-question" id="quiz-twos-complement">
  <p><b>Soru:</b> 8-bit Two's Complement temsilinde, `5` (binary `00000101`) sayısının negatifi (`-5`) nasıl temsil edilir?</p>
  <div class="quiz-option">A) `10000101`</div>
  <div class="quiz-option" data-correct="true">B) `11111011`</div>
  <div class="quiz-option">C) `11111010`</div>
  <div class="quiz-option">D) `00001010`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `x`'in negatifini bulmak için `~x + 1` formülünü kullanırız.
    1. `x` = `00000101`
    2. `~x` = `11111010` (tüm bitleri ters çevir)
    3. `~x + 1` = `11111011`</p>
  </div>
</div>

---

## 5. Casting (Tip Dönüşümleri), Genişletme ve Kırpma ([Test Sorusu](#quiz-casting))

C gibi dillerde, farklı tamsayı tipleri arasında dönüşüm yapmak yaygındır (`short`'u `int`'e atamak gibi). Bu dönüşümler derleyici tarafından otomatik olarak yapılır, ancak arka planda bitlerin nasıl değiştiğini bilmek, beklenmedik hataları anlamak için kritiktir.

### Expanding (Genişletme): Küçük Tipten Büyük Tipe
Bir değeri daha fazla bit ile temsil etmektir (örn: 4-bit'ten 8-bit'e). Değerin korunması esastır.

*   **Zero Extension (Sıfırla Genişletme):** `unsigned` (işaretsiz) sayılar için kullanılır. Sayının soluna (yüksek anlamlı bitlere) `0`'lar eklenir.
    <pre>
    // 4-bit unsigned 9 sayısını 8-bit'e genişletme
    Başlangıç (4-bit): 1001      (Değer: 9)
    Sonuç (8-bit):     00001001  (Değer: 9)
    </pre>

*   **Sign Extension (İşaretle Genişletme):** `signed` (işaretli) sayılar için kullanılır. Sayının orijinal işaretini korumak için, en soldaki **işaret biti** kopyalanarak yeni bitler doldurulur.
    *   **Pozitif Sayı Örneği:**
        <pre>
        // 4-bit signed 7 sayısını 8-bit'e genişletme
        Başlangıç (4-bit): 0111      (Değer: 7)
        Sonuç (8-bit):     00000111  (Değer: 7) - İşaret biti 0 olduğu için 0'lar eklendi.
        </pre>
    *   **Negatif Sayı Örneği:**
        <pre>
        // 4-bit signed -7 sayısını 8-bit'e genişletme
        Başlangıç (4-bit): 1001      (Değer: -7)
        Sonuç (8-bit):     11111001  (Değer: -7) - İşaret biti 1 olduğu için 1'ler eklendi.
        </pre>

### Truncating (Kırpma): Büyük Tipten Küçük Tipe
Bir değeri daha az bit ile temsil etmektir (örn: 8-bit'ten 4-bit'e). Bu işlem sırasında bilgi kaybı yaşanabilir ve sayının değeri tamamen değişebilir.

*   Kural basittir: Yüksek anlamlı bitler (soldaki bitler) basitçe **atılır**.
    <pre>
    // 8-bit 134 sayısını 4-bit'e kırpma
    Başlangıç (8-bit): 10000110  (Değer: 134)
    Atılan Kısım:   1000
    Kalan Kısım:         0110

    Sonuç (4-bit):     0110      (Değer: 6) - Sayı tamamen değişti!
    </pre>

<div class="quiz-question" id="quiz-casting">
  <p><b>Soru:</b> 4-bit `signed` (işaretli) tamsayı olan `-3` (`1101`), 8-bit bir tamsayıya `Sign Extension` ile genişletilirse sonuç ne olur?</p>
  <div class="quiz-option">A) `00001101`</div>
  <div class="quiz-option">B) `00000011`</div>
  <div class="quiz-option" data-correct="true">C) `11111101`</div>
  <div class="quiz-option">D) `10000011`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `Sign Extension` (İşaretli genişletme) sırasında, sayının işaretini korumak için orijinal işaret biti (`-3` için en soldaki `1`) yeni eklenen bitlere kopyalanır. Bu nedenle sonuç `11111101` olur.</p>
  </div>
</div>

---

## 6. Tamsayı Toplaması ve Overflow (Taşma) ([Test Sorusu](#quiz-overflow))

Bilgisayar aritmetiği, gerçek dünyadaki matematikten farklıdır çünkü sınırlı sayıda bit ile çalışır. Bu sınırlılık, **overflow (taşma)** adı verilen duruma yol açabilir.

Toplama işlemi, `unsigned` ve `signed` tamsayılar için bit seviyesinde tamamen aynı şekilde yapılır. Fark, taşma durumunun nasıl yorumlandığında ortaya çıkar.

### Unsigned Overflow (İşaretsiz Taşma)
İşaretsiz toplama işleminde, sonuç `w` bitin temsil edebileceği maksimum değeri aştığında, sonuç `2ʷ` modunda alınır. Bu, sonucun "başa dönmesi" anlamına gelir.

*   **Örnek (4-bit unsigned):** `10 + 7 = ?`
    *   `10`'un deseni: `1010`
    *   `7`'nin deseni: `0111`
    <pre>
      1010  (10)
    + 0111  (7)
      ----
     10001  (17)
    </pre>
    *   Sonuç 5 bit (`10001`) olduğu için 4-bit'e sığmaz. En soldaki bit atılır ve sonuç `0001` olur.
    *   Yani, 4-bit'lik işaretsiz dünyada `10 + 7 = 1`.

### Signed Overflow (İşaretli Taşma)
İşaretli toplama işleminde taşma, sonuç beklenen işaretin tersi olduğunda meydana gelir. Toplama işlemi mantıksal olarak yanlıştır.

*   **Pozitif Taşma:** İki pozitif sayının toplamı negatif olursa.
    *   **Örnek (4-bit signed):** `5 + 4 = ?`
        *   `5`'in deseni: `0101`
        *   `4`'ün deseni: `0100`
        <pre>
          0101  (+5)
        + 0100  (+4)
          ----
          1001  (-7)
        </pre>
        *   Sonuç `+9` olmalıydı, ancak 4-bit `signed` aralığı `-8` ile `+7` arasıdır. Sonuç bu aralığın dışına taştı ve işaret biti `1` oldu, yani negatif bir sayı (`-7`) elde edildi. Bu bir `overflow`'dur.

*   **Negatif Taşma:** İki negatif sayının toplamı pozitif olursa.
    *   **Örnek (4-bit signed):** `(-5) + (-4) = ?`
        *   `-5`'in deseni: `1011`
        *   `-4`'ün deseni: `1100`
        <pre>
          1011  (-5)
        + 1100  (-4)
          ----
         10111  (-9)
        </pre>
        *   Sonuç `-9` olmalıydı. 5 bitlik sonuçtan en soldaki biti atarsak elimizde `0111` kalır. Bu da `+7`'dir. İki negatif sayının toplamı pozitif çıktı. Bu da bir `overflow`'dur.

<div class="quiz-question" id="quiz-overflow">
  <p><b>Soru:</b> 4-bit `signed` (işaretli) tamsayılar kullanılarak `5 + 5` işlemi yapılırsa sonuç ne olur ve neden?</p>
  <div class="quiz-option">A) `10` (Sonuç doğru)</div>
  <div class="quiz-option" data-correct="true">B) `-6` (Pozitif overflow oluştu)</div>
  <div class="quiz-option">C) `10` (Unsigned olarak doğru)</div>
  <div class="quiz-option">D) `2` (Negatif overflow oluştu)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `5`'in 4-bit deseni `0101`'dir. `0101 + 0101 = 1010`. `1010` deseni, 4-bit Two's Complement'te `-6`'ya karşılık gelir. İki pozitif sayının toplamı negatif çıktığı için bu bir pozitif `overflow` durumudur.</p>
  </div>
</div>

---