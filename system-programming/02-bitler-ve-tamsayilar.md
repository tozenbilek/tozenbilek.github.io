---
layout: default
title: Bitler ve Tamsayılar
nav_order: 2
parent: System Programming
---

# Bitler, Baytlar ve Tamsayılar

Dijital dünyadaki her şeyin temelinde **bit**'ler yatar. Bu bölümde, verinin bu en temel formda nasıl temsil edildiğini, manipüle edildiğini ve tamsayılar gibi daha karmaşık yapıları nasıl oluşturduğunu inceleyeceğiz.

---

## 1. Bilginin İkili (Binary) Temsili

Bilgisayarlar, bilgiyi depolamak ve işlemek için sadece iki durumu anlarlar: açık veya kapalı, yüksek voltaj veya düşük voltaj. Bu iki duruma karşılık gelen rakamlar **1** ve **0**'dır. Tek bir 1 veya 0'a **bit** denir.

*   **Bayt (Byte):** 8 bitten oluşan bir grupdur. Bellekteki en küçük adreslenebilir birimdir. Bir bayt, `00000000`'dan `11111111`'e kadar 256 (2⁸) farklı değer alabilir.
*   **Kelime (Word):** Bir işlemcinin tek seferde işlediği doğal veri boyutudur. Modern sistemlerde genellikle 32-bit (4 bayt) veya 64-bit (8 bayt) olur.

**Hexadecimal (Onaltılık) Gösterim:** İkili sayılar çok uzun olabildiği için, genellikle daha kompakt olan hexadecimal (16'lık taban) gösterimi kullanılır. Her bir hexadecimal rakam, 4 bite karşılık gelir.
*   Rakamlar: `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F`
*   Örnek: `1111 1111` (binary) = `255` (decimal) = `FF` (hexadecimal)

---

## 2. Bellek Organizasyonu ve Bayt Sıralaması (Endianness)

Bellek, devasa bir bayt dizisi olarak düşünülebilir. Her baytın kendine özgü bir adresi vardır. Peki, bir kelime gibi birden fazla bayttan oluşan bir veri belleğe nasıl yerleşir? İşte burada **Endianness** kavramı devreye girer.

Diyelim ki `0x01234567` sayısını belleğe yazmak istiyoruz.

*   **Big-Endian:** En anlamlı bayt (`01`), en düşük bellek adresine yazılır. İnsanların sayıları okuma şekline benzer.
    *   Adres `A`: `01`
    *   Adres `A+1`: `23`
    *   Adres `A+2`: `45`
    *   Adres `A+3`: `67`
*   **Little-Endian:** En anlamsız bayt (`67`), en düşük bellek adresine yazılır. Intel ve AMD işlemcileri bu yöntemi kullanır.
    *   Adres `A`: `67`
    *   Adres `A+1`: `45`
    *   Adres `A+2`: `23`
    *   Adres `A+3`: `01`

![Endianness](https://via.placeholder.com/600x300.png?text=Big+Endian+vs.+Little+Endian)
*Görsel: Aynı sayının Big-Endian ve Little-Endian olarak bellekteki gösterimi.*

---

## 3. Bit Seviyesi Mantıksal Operasyonlar

C dilinde, tamsayılar üzerinde bit seviyesinde mantıksal işlemler yapabiliriz.

*   `&` (AND): İki bit de 1 ise sonuç 1, aksi halde 0. (Maskeleme için kullanılır)
*   `|` (OR): En az bir bit 1 ise sonuç 1, aksi halde 0. (Bitleri ayarlamak için kullanılır)
*   `^` (XOR): Bitler birbirinden farklı ise sonuç 1, aksi halde 0. (Bitleri ters çevirmek için kullanılır)
*   `~` (NOT): Her biti ters çevirir (0 -> 1, 1 -> 0).

### Kaydırma (Shift) Operasyonları

*   `<<` (Left Shift): Bitleri sola kaydırır. Sağa 0'lar eklenir. `x << k` işlemi, `x * 2^k`'ya eşdeğerdir.
*   `>>` (Right Shift): Bitleri sağa kaydırır. İki türü vardır:
    *   **Logical Right Shift:** Sola 0'lar eklenir. (İşaretsiz sayılar için kullanılır)
    *   **Arithmetic Right Shift:** En soldaki (işaret) bitinin kopyaları eklenir. Bu, sayının işaretini korur. (İşaretli sayılar için kullanılır)

---

## 4. Tamsayıların Temsili

### İşaretsiz (Unsigned) Tamsayılar
Tüm bitler sayının büyüklüğünü temsil etmek için kullanılır. `w` bitlik bir işaretsiz tamsayı, 0 ile 2ʷ-1 arasındaki değerleri alabilir.

### İşaretli (Signed) Tamsayılar: Two's Complement (İkinin Tümleyeni)
Modern bilgisayarlarda işaretli tamsayılar için standart olan yöntem budur.
*   En soldaki bit, **işaret biti (sign bit)** olarak adlandırılır. `0` pozitif, `1` ise negatif anlamına gelir.
*   Pozitif bir sayının değeri, işaretsizdekiyle aynıdır.
*   Negatif bir `x` sayısını temsil etmek için `2^w - |x|` formülü kullanılır.
*   **Pratik Yöntem:** Bir `x` sayısının negatifini (`-x`) bulmak için, tüm bitlerini ters çevir (`~x`) ve 1 ekle (`+1`).

`w` bitlik bir işaretli tamsayı, `-2^(w-1)` ile `2^(w-1) - 1` arasındaki değerleri alabilir. Dikkat ederseniz, negatif aralıkta bir sayı daha fazladır.

---

## 5. Tip Dönüşümleri (Casting), Genişletme ve Kırpma

### Genişletme (Expanding)
Küçük bir veri tipini daha büyük bir tipe dönüştürürken (örn: `short` -> `int`):
*   **İşaretsiz Sayılar:** Başına 0'lar eklenir (**Zero Extension**).
*   **İşaretli Sayılar:** Sayının işaretini korumak için işaret biti kopyalanır (**Sign Extension**).

### Kırpma (Truncating)
Büyük bir veri tipini daha küçük bir tipe dönüştürürken (örn: `int` -> `short`):
*   Yüksek anlamlı bitler atılır. Sonuç, orijinal değerden çok farklı olabilir.

---

## 6. Tamsayı Aritmetiği

### Toplama ve Taşma (Overflow)
Hem işaretsiz hem de işaretli toplama işlemi bit seviyesinde aynı şekilde yapılır. Ancak **taşma (overflow)** durumunu farklı yorumlarlar.
*   **Unsigned Overflow:** Sonuç, `2^w` modunda alınır. Yani, `2^w`'yi aşan kısım atılır.
*   **Signed Overflow:** Sonuç, beklenen işaretin tersi olduğunda meydana gelir.
    *   İki pozitif sayının toplamı negatif olursa.
    *   İki negatif sayının toplamı pozitif olursa.

---

### Özet ve Değerlendirme

Bu bölümde, verinin en temel yapı taşı olan bitlerden başlayarak, baytlar, bellek sıralaması, mantıksal operasyonlar ve en önemlisi tamsayıların bilgisayarda nasıl temsil edildiğini öğrendik. `Two's Complement` ve `Endianness` gibi kavramlar, düşük seviyeli programlamada karşılaşılan birçok hatanın ve davranışın temelini oluşturur.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Little-Endian bir sistemde, 32-bit `0x12345678` tamsayısı belleğin `0x100` adresine yazılırsa, `0x101` adresinde hangi bayt değeri bulunur?</p>
  <div class="quiz-option">A) `0x12`</div>
  <div class="quiz-option">B) `0x34`</div>
  <div class="quiz-option" data-correct="true">C) `0x56`</div>
  <div class="quiz-option">D) `0x78`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Little-Endian sistemlerde, en anlamsız (en sağdaki) bayt en düşük adrese yazılır. Bu durumda sıralama şöyle olur: Adres `0x100`: `0x78`, Adres `0x101`: `0x56`, Adres `0x102`: `0x34`, Adres `0x103`: `0x12`.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> 8-bit Two's Complement temsilinde, `5` (binary `00000101`) sayısının negatifi (`-5`) nasıl temsil edilir?</p>
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

<div class="quiz-question">
  <p><b>Soru 3:</b> 8-bit işaretli bir tamsayı (`signed char`) olan `x`'in değeri `100`'dür. Bu değişken, 16-bit işaretli bir tamsayıya (`short`) genişletilirse (sign extension) yeni değeri ne olur?</p>
  <div class="quiz-option" data-correct="true">A) `100`</div>
  <div class="quiz-option">B) `-156`</div>
  <div class="quiz-option">C) `25600`</div>
  <div class="quiz-option">D) `-100`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> `100` pozitif bir sayıdır, bu yüzden işaret biti `0`'dır. İşaretli genişletme (Sign Extension) sırasında, sayının işaretini korumak için yeni eklenen bitlere eski işaret biti (`0`) kopyalanır. Bu nedenle değer değişmez. Eğer sayı negatif olsaydı, başına `1`'ler eklenerek değeri korunurdu.</p>
  </div>
</div>
