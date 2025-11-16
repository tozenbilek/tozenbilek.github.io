---
layout: default
title: Aritmetik, Kontrol Akışı ve Prosedürler
nav_order: 5
parent: Sistem Programlama
---

# Aritmetik, Kontrol Akışı ve Prosedürler

Önceki bölümde makine kodunun temellerini, yazmaçları ve veri taşıma komutlarını öğrendik. Bu bölümde ise bir programı işlevsel kılan üç temel taşı daha inceleyeceğiz: Aritmetik işlemler, `if/else` ve `döngü` gibi kontrol yapıları ve `fonksiyon` çağrıları (prosedürler).

---

## 1. Aritmetik ve Mantıksal Komutlar

`mov` komutunun yanı sıra, işlemci aritmetik ve mantıksal işlemler için de zengin bir komut setine sahiptir.

### a) İki Operandlı Komutlar
Bu komutlar, `Kaynak` ve `Hedef` olmak üzere iki operand alır ve sonucu `Hedef`'e yazar (`Hedef = Hedef işlem Kaynak`).

| Komut      | Açıklama                 | Örnek                   |
| :--------- | :----------------------- | :---------------------- |
| `addq S, D`  | Toplama (`D += S`)         | `addq %rax, %rbx`       |
| `subq S, D`  | Çıkarma (`D -= S`)         | `subq $8, %rsp`         |
| `imulq S, D` | Çarpma (`D *= S`)          | `imulq %rcx, %rax`      |
| `andq S, D`  | Bitwise AND (`D &= S`)   | `andq %rax, %rdx`       |
| `orq S, D`   | Bitwise OR (`D \|= S`)     | `orq $0x1, %rax`        |
| `xorq S, D`  | Bitwise XOR (`D ^= S`)   | `xorq %rax, %rax` (sıfırlama) |

### b) Tek Operandlı Komutlar
Bu komutlar tek bir operand üzerinde çalışır.

| Komut     | Açıklama                  |
| :-------- | :------------------------ |
| `incq D`  | Bir artırma (`D++`)         |
| `decq D`  | Bir eksiltme (`D--`)        |
| `negq D`  | Negatifini alma (`D = -D`) |
| `notq D`  | Bitwise NOT (`D = ~D`)    |

### c) `leaq` Komutu: Adres Hesabı
`leaq Kaynak, Hedef` (Load Effective Address) komutu, `Kaynak` operandının belirttiği *bellek adresini hesaplar* ve sonucu `Hedef` yazmacına yazar. **Belleğe gerçekten erişmez.** Bu özelliği sayesinde, genel amaçlı aritmetik işlemler için de kullanılabilir.

Örneğin, `%rax`'ta `x` değeri varken `leaq (%rax, %rax, 2), %rdx` komutu `%rdx`'e `x + 2*x = 3*x` değerini yazar.

---

## 2. Kontrol Akışı: Karşılaştırma ve Zıplama

Programların akıllıca davranmasını sağlayan `if`, `switch`, `while` gibi yapılar, Assembly'de iki temel mekanizma ile gerçekleştirilir: **durum kodları** ve **koşullu zıplamalar**.

1.  **Karşılaştırma:** `cmpq S2, S1` (compare) komutu, `S1 - S2` işlemini yapar ancak sonucu hiçbir yere yazmaz. Sadece işlemin sonucuna göre **durum kodlarını (condition codes)** ayarlar. `testq S, D` komutu ise `S & D` işlemiyle durum kodlarını ayarlar.
    *   **ZF (Zero Flag):** Sonuç sıfır ise `1` olur.
    *   **SF (Sign Flag):** Sonuç negatif ise `1` olur.
    *   **OF (Overflow Flag):** İşaretli taşma olduysa `1` olur.
    *   **CF (Carry Flag):** İşaretsiz taşma olduysa `1` olur.

2.  **Zıplama (Jump):** `jmp` komutları, program sayacını (`RIP`) değiştirerek programın akışını farklı bir noktaya yönlendirir.
    *   `jmp Etiket`: Koşulsuz zıplama.
    *   `je Etiket` (Jump if Equal): `ZF=1` ise zıpla.
    *   `jne Etiket` (Jump if Not Equal): `ZF=0` ise zıpla.
    *   `js Etiket` (Jump if Sign): `SF=1` ise zıpla.
    *   `jg Etiket` (Jump if Greater): İşaretli "büyükse" zıpla.
    *   `ja Etiket` (Jump if Above): İşaretsiz "büyükse" zıpla.

![If-Else Akışı](https://via.placeholder.com/500x350.png?text=test+condition+->+jump+if+false+->+then+code+->+goto+done+->+else+code+->+done)
*Görsel: Tipik bir if-else yapısının Assembly'deki zıplama mantığı.*

---

## 3. Prosedürler (Fonksiyonlar) ve Yığın (Stack)

Fonksiyon çağrıları, program organizasyonunun temelidir. Bu mekanizma, **yığın (stack)** adı verilen, belleğin "son giren ilk çıkar" (LIFO) prensibiyle çalışan bir bölgesi tarafından yönetilir. Yığın, yüksek bellek adreslerinden alçak adreslere doğru büyür.

*   `%rsp`: Yığının en "tepesinin" (en son eklenen elemanın) adresini tutan yığın işaretçisi yazmacı.

### Çağrı Mekanizması

1.  **`callq Etiket`:** Bir fonksiyonu çağırmak için kullanılır. İki şey yapar:
    a. `call` komutundan bir sonraki komutun adresini (**dönüş adresi**) yığına `push` eder.
    b. Program sayacını (`RIP`) çağrılan fonksiyonun başlangıç adresine (`Etiket`) ayarlar.

2.  **`retq`:** Fonksiyondan dönmek için kullanılır. Yığının tepesindeki **dönüş adresini** `pop` eder ve program sayacını bu adrese ayarlar.

### Yığın Çerçevesi (Stack Frame)

Her fonksiyon çağrıldığında, yığın üzerinde kendine ait bir çalışma alanı oluşturur. Bu alana **yığın çerçevesi (stack frame)** denir. Bir stack frame tipik olarak şunları içerir:
*   Çağıran fonksiyona geri dönmek için dönüş adresi.
*   Fonksiyona geçirilen argümanlar (ilk 6'sı yazmaçlarla geçirilmezse).
*   Fonksiyonun yerel değişkenleri.
*   Çağrılan diğer fonksiyonlar için kaydedilen yazmaç değerleri.

![Stack Frame](https://via.placeholder.com/400x500.png?text=High+Addresses+...Args...+Return+Addr...+Saved+Regs...+Local+Vars...Low+Addresses+(%rsp))
*Görsel: Bir fonksiyon çağrısı sırasındaki tipik bir yığın çerçevesi.*

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> `%rax` yazmacında 5, `%rbx` yazmacında 10 değeri varken, `cmpq %rax, %rbx` komutu çalıştırıldıktan sonra durum kodlarından hangisi `1` olur?</p>
  <div class="quiz-option">A) `ZF (Zero Flag)`</div>
  <div class="quiz-option" data-correct="true">B) `SF (Sign Flag)`</div>
  <div class="quiz-option">C) `OF (Overflow Flag)`</div>
  <div class="quiz-option">D) Hiçbiri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `cmpq %rax, %rbx` komutu, `10 - 5` işleminin sonucuna göre durum kodlarını ayarlar. Sonuç `5`'tir (pozitif). Ancak soruya dikkat, `cmpq S2, S1` `S1-S2` yapar. Dolayısıyla `5-10` işlemi yapılır, sonuç `-5` olur. Bu nedenle `SF` (Sign Flag) `1` olur, çünkü sonuç negatiftir. `ZF` (Zero Flag) `0` olur çünkü sonuç sıfır değildir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir `foo` fonksiyonu, başka bir `bar` fonksiyonunu `callq bar` komutuyla çağırdığında, yığına (stack) ne `push` edilir?</p>
  <div class="quiz-option">A) `%rax` yazmacının değeri.</div>
  <div class="quiz-option">B) `bar` fonksiyonunun başlangıç adresi.</div>
  <div class="quiz-option" data-correct="true">C) `callq` komutundan sonraki komutun adresi.</div>
  <div class="quiz-option">D) `%rsp` yazmacının o anki değeri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `call` komutu, `bar` fonksiyonu işini bitirip `ret` komutunu çalıştırdığında programın nereden devam edeceğini bilmesi için "dönüş adresini" yığına kaydeder. Bu adres, `call` komutundan hemen sonra gelen komutun adresidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> `leaq 8(%rdi, %rsi, 4), %rax` komutunun yaptığı işlev C dilinde neye en yakındır? (`%rdi`'de `p`, `%rsi`'de `i` olduğunu varsayın)</p>
  <div class="quiz-option">A) `rax = p[i*4 + 8]`</div>
  <div class="quiz-option">B) `rax = p + i + 8`</div>
  <div class="quiz-option" data-correct="true">C) `rax = p + i*4 + 8`</div>
  <div class="quiz-option">D) `rax = *(p + i*4 + 8)`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `leaq` komutu "Load Effective Address" anlamına gelir ve bellekten veri okumaz. Sadece adres hesaplaması yapar. `8(%rdi, %rsi, 4)` adres ifadesi, `rdi + rsi*4 + 8`'e karşılık gelen adresi hesaplar ve bu adresi (bir pointer değeri olarak) `%rax` yazmacına yükler. Bellek okuması yapan seçenek (`D`) `movq` komutuna karşılık gelirdi.</p>
  </div>
</div>
