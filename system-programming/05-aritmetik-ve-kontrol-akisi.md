---
layout: default
title: Aritmetik ve Kontrol Akışı
nav_order: 5
parent: System Programming
---

# Aritmetik, Kontrol Akışı ve Prosedürler

Önceki bölümde makine kodunun temellerini öğrendik. Bu bölümde ise bir programı işlevsel kılan üç temel taşı daha inceleyeceğiz: Aritmetik işlemler, `if/else` ve `döngü` gibi kontrol yapıları ve `fonksiyon` çağrıları.

---

## 1. Aritmetik ve Mantıksal Komutlar

`mov`'un yanı sıra, işlemci aritmetik ve mantıksal işlemler için de zengin bir komut setine sahiptir.

### a) İki ve Tek Operandlı Komutlar
`addq S, D` gibi komutlar `D = D + S` şeklinde çalışırken, `incq D` gibi komutlar `D++` işlemini yapar.

| Komut | Açıklama | Komut | Açıklama |
| :--- | :--- | :--- | :--- |
| `addq S, D` | Toplama (`D += S`) | `incq D` | Bir artırma (`D++`) |
| `subq S, D` | Çıkarma (`D -= S`) | `decq D` | Bir eksiltme (`D--`) |
| `imulq S, D`| Çarpma (`D *= S`) | `negq D` | Negatifini alma (`D = -D`) |
| `andq S, D` | Bitwise AND (`D &= S`) | `notq D` | Bitwise NOT (`D = ~D`) |
| `xorq S, D` | Bitwise XOR (`D ^= S`)| | |

### b) `leaq` Komutu: Adres Hesabı Sanatı
`leaq Source, Destination` (Load Effective Address) komutu, Assembly'nin en ilginç komutlarındandır. `Source` operandının belirttiği *bellek adresini hesaplar* ve sonucu `Destination` yazmacına yazar. **Belleğe gerçekten erişmez, sadece adres matematiği yapar.**

Bu özelliği sayesinde, toplama ve sınırlı çarpma işlemleri için dahice bir şekilde kullanılabilir.

*   **Örnek:** `%rax`'ta `x` değeri varken `leaq (%rax, %rax, 2), %rdx` komutu, `%rdx` yazmacına `x + x*2`, yani `3*x` değerini yazar. Bu, `imul` komutundan daha hızlı olabilir.

<div class="quiz-question">
  <p><b>Soru:</b> `leaq 8(%rdi, %rsi, 4), %rax` komutunun yaptığı işlev C dilinde neye en yakındır? (`%rdi`'de `p`, `%rsi`'de `i` olduğunu varsayın)</p>
  <div class="quiz-option">A) `rax = p[i*4 + 8]`</div>
  <div class="quiz-option">B) `rax = p + i + 8`</div>
  <div class="quiz-option" data-correct="true">C) `rax = &p[i*4 + 8]` (Adres hesabı)</div>
  <div class="quiz-option">D) `rax = *(p + i*4 + 8)`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `leaq` komutu "Load Effective Address" anlamına gelir ve bellekten veri okumaz. Sadece adres hesaplaması yapar. Bu ifade, `p + i*4 + 8` adresini hesaplar ve bu adresi (bir pointer değeri olarak) `%rax` yazmacına yükler. Bellekten okuma yapan (`*` operatörü) `D` seçeneği, `movq` komutuna karşılık gelirdi.</p>
  </div>
</div>

---

## 2. Kontrol Akışı: Karşılaştırma ve Zıplama

`if`, `while` gibi yapılar, **karşılaştırma** ve **koşullu zıplama** mekanizmalarıyla çalışır.

1.  **Karşılaştırma:** `cmpq S2, S1` komutu, `S1 - S2` işlemini yapar ancak sonucu bir yere yazmaz. Sadece işlemin sonucuna göre **condition codes (durum kodlarını)** ayarlar.
    *   **ZF (Zero Flag):** Sonuç sıfır ise `1` olur (`S1 == S2`).
    *   **SF (Sign Flag):** Sonuç negatif ise `1` olur (`S1 < S2`).
    *   **OF (Overflow Flag):** İşaretli taşma olduysa `1` olur.

2.  **Zıplama (Jump):** `j...` komutları, durum kodlarına bakarak programın akışını farklı bir etikete yönlendirir.
    *   `jmp Etiket`: Koşulsuz zıpla.
    *   `je Etiket` (Jump if Equal): Eşitse zıpla (`ZF=1`).
    *   `jne Etiket` (Jump if Not Equal): Eşit değilse zıpla (`ZF=0`).
    *   `jg Etiket` (Jump if Greater): İşaretli "büyükse" zıpla.
    *   `ja Etiket` (Jump if Above): İşaretsiz "büyükse" zıpla.

<div class="quiz-question">
  <p><b>Soru:</b> `%rax` yazmacında 5, `%rbx` yazmacında 10 değeri varken, `cmpq %rax, %rbx` komutu çalıştırıldıktan sonra durum kodlarından hangisi `1` olur?</p>
  <div class="quiz-option">A) `ZF (Zero Flag)`</div>
  <div class="quiz-option" data-correct="true">B) `SF (Sign Flag)`</div>
  <div class="quiz-option">C) `OF (Overflow Flag)`</div>
  <div class="quiz-option">D) Hiçbiri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `cmpq S2, S1` komutu `S1 - S2` işlemini yapar. Yani, `10 - 5` değil, `%rbx - %rax` (`10-5`) değil `5-10` yapılır. Sonuç `-5` olduğu için `SF` (Sign Flag) `1` olur.</p>
  </div>
</div>

---

## 3. Prosedürler (Fonksiyonlar) ve Stack (Yığın)

Fonksiyon çağrıları, belleğin "son giren ilk çıkar" (LIFO) prensibiyle çalışan **stack (yığın)** bölgesi tarafından yönetilir. Yığın, yüksek bellek adreslerinden alçak adreslere doğru büyür ve `%rsp` yazmacı yığının en "tepesinin" adresini tutar.

### Çağrı Mekanizması

1.  **`callq Etiket`:** Çağıran, `call`'dan bir sonraki komutun adresini (**dönüş adresi**) yığına `push` eder ve çağrılan fonksiyona zıplar.
2.  **`retq`:** Çağrılan, işi bitince yığındaki dönüş adresini `pop` ederek program akışını çağıran kişiye geri verir.

### Stack Frame (Yığın Çerçevesi)
Her fonksiyon, yığın üzerinde kendine ait **stack frame (yığın çerçevesi)** denilen bir çalışma alanı kullanır.

<pre>
| ...                   |
| Argüman 7+            | <-- Yüksek Adresler
|-----------------------|
| Dönüş Adresi          | <-- `call` tarafından push edildi
|-----------------------|
| Kaydedilmiş Yazmaçlar |
|-----------------------|
| Yerel Değişkenler     |
|-----------------------|
| ...                   | <-- %rsp (Yığın Tepesi)
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Bir `foo` fonksiyonu, başka bir `bar` fonksiyonunu `callq bar` komutuyla çağırdığında, stack'e (yığına) ne `push` edilir?</p>
  <div class="quiz-option">A) `%rax` yazmacının değeri.</div>
  <div class="quiz-option">B) `bar` fonksiyonunun başlangıç adresi.</div>
  <div class="quiz-option" data-correct="true">C) `callq` komutundan sonraki komutun adresi.</div>
  <div class="quiz-option">D) `%rsp` yazmacının o anki değeri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `call` komutu, `bar` fonksiyonu işini bitirip `ret` komutunu çalıştırdığında programın nereden devam edeceğini bilmesi için "return address" (dönüş adresini) yığına kaydeder. Bu adres, `call` komutundan hemen sonra gelen komutun adresidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir fonksiyonun yerel değişkenleri nerede saklanır?</p>
  <div class="quiz-option">A) `Heap` (Öbek) bölgesinde.</div>
  <div class="quiz-option" data-correct="true">B) O fonksiyona ait `Stack Frame` (Yığın Çerçevesi) içinde.</div>
  <div class="quiz-option">C) `Data` segmentinde.</div>
  <div class="quiz-option">D) Yazmaçlarda (Registers).</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir fonksiyonun kendi kapsamındaki yerel değişkenler, o fonksiyon çağrıldığında yığında oluşturulan geçici çalışma alanında, yani Stack Frame'inde saklanır. Fonksiyon sona erdiğinde bu alan serbest bırakılır.</p>
  </div>
</div>

---
