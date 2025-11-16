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
`leaq Source, Destination` (Load Effective Address) komutu, Assembly'nin en ilginç komutlarındandır. `Source` operandının belirttiği *bellek adresini hesaplar* ve sonucu `Destination` register'ına yazar. **Belleğe gerçekten erişmez, sadece adres matematiği yapar.**

Bu özelliği sayesinde, toplama ve sınırlı çarpma işlemleri için dahice bir şekilde kullanılabilir.

*   **Örnek:** `%rax`'ta `x` değeri varken `leaq (%rax, %rax, 2), %rdx` komutu, `%rdx` register'ına `x + x*2`, yani `3*x` değerini yazar. Bu, `imul` komutundan daha hızlı olabilir.

<div class="quiz-question">
  <p><b>Soru:</b> `leaq 8(%rdi, %rsi, 4), %rax` komutunun yaptığı işlev C dilinde neye en yakındır? (`%rdi`'de `p`, `%rsi`'de `i` olduğunu varsayın)</p>
  <div class="quiz-option">A) `rax = p[i*4 + 8]`</div>
  <div class="quiz-option">B) `rax = p + i + 8`</div>
  <div class="quiz-option" data-correct="true">C) `rax = &p[i*4 + 8]` (Adres hesabı)</div>
  <div class="quiz-option">D) `rax = *(p + i*4 + 8)`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `leaq` komutu "Load Effective Address" anlamına gelir ve bellekten veri okumaz. Sadece adres hesaplaması yapar. Bu ifade, `p + i*4 + 8` adresini hesaplar ve bu adresi (bir pointer değeri olarak) `%rax` register'ına yükler. Bellekten okuma yapan (`*` operatörü) `D` seçeneği, `movq` komutuna karşılık gelirdi.</p>
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

Bu mekanizma, `if-else` gibi yapıların temelini oluşturur. Aşağıdaki diyagram, bu mantıksal akışı görselleştirmektedir:

```mermaid
graph TD
    A["Başlangıç"] --> B{cmp a, b};
    B -- "a == b (je)" --> C["'if' bloğu çalışır"];
    B -- "a != b (jne)" --> D["'else' bloğu çalışır"];
    C --> E["Bitiş"];
    D --> E;
```

<div class="quiz-question">
  <p><b>Soru:</b> `%rax` register'ında 5, `%rbx` register'ında 10 değeri varken, `cmpq %rax, %rbx` komutu çalıştırıldıktan sonra durum kodlarından hangisi `1` olur?</p>
  <div class="quiz-option">A) `ZF (Zero Flag)`</div>
  <div class="quiz-option" data-correct="true">B) `SF (Sign Flag)`</div>
  <div class="quiz-option">C) `OF (Overflow Flag)`</div>
  <div class="quiz-option">D) Hiçbiri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `cmpq S2, S1` komutu `S1 - S2` işlemini yapar. Yani, `10 - 5` değil, `%rbx - %rax` (`10-5`) değil `5-10` yapılır. Sonuç `-5` olduğu için `SF` (Sign Flag) `1` olur.</p>
  </div>
</div>

---

## 3. Prosedürler (Fonksiyonlar) ve Stack

Fonksiyon çağrıları, belleğin "son giren ilk çıkar" (LIFO) prensibiyle çalışan **stack** bölgesi tarafından yönetilir. Stack, yüksek bellek adreslerinden alçak adreslere doğru büyür ve `%rsp` register'ı stack'in en "tepesinin" adresini tutar.

### Çağrı Mekanizması

1.  **`callq Etiket`:** Çağıran, `call`'dan bir sonraki komutun adresini (**dönüş adresi**) stack'e `push` eder ve çağrılan fonksiyona zıplar.
2.  **`retq`:** Çağrılan, işi bitince stack'teki dönüş adresini `pop` ederek program akışını çağıran kişiye geri verir.

### Stack Frame

Her fonksiyon, stack üzerinde kendine ait **stack frame** denilen bir çalışma alanı kullanır.

```mermaid
graph TD
    A["...<br>(Yüksek Adresler)"]
    B["Argüman 7+"]
    C["Dönüş Adresi<br><i>(call tarafından push edildi)</i>"]
    D["Kaydedilmiş Register'lar"]
    E["Yerel Değişkenler"]
    F["..."]
    G["%rsp (Stack Tepesi)<br><i>(Düşük Adreslere Doğru)</i>"]

    subgraph Stack Büyüme Yönü
        A --> B --> C --> D --> E --> F
    end
    
    F -.-> G
```

<div class="quiz-question">
  <p><b>Soru:</b> Bir `foo` fonksiyonu, başka bir `bar` fonksiyonunu `callq bar` komutuyla çağırdığında, stack'e ne `push` edilir?</p>
  <div class="quiz-option">A) `%rax` register'ının değeri.</div>
  <div class="quiz-option">B) `bar` fonksiyonunun başlangıç adresi.</div>
  <div class="quiz-option" data-correct="true">C) `callq` komutundan sonraki komutun adresi.</div>
  <div class="quiz-option">D) `%rsp` register'ının o anki değeri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `call` komutu, `bar` fonksiyonu işini bitirip `ret` komutunu çalıştırdığında programın nereden devam edeceğini bilmesi için "return address" (dönüş adresini) stack'e kaydeder. Bu adres, `call` komutundan hemen sonra gelen komutun adresidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir fonksiyonun yerel değişkenleri nerede saklanır?</p>
  <div class="quiz-option">A) `Heap` (Öbek) bölgesinde.</div>
  <div class="quiz-option" data-correct="true">B) O fonksiyona ait `Stack Frame` içinde.</div>
  <div class="quiz-option">C) `Data` segmentinde.</div>
  <div class="quiz-option">D) Register'larda.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir fonksiyonun kendi kapsamındaki yerel değişkenler, o fonksiyon çağrıldığında stack'te oluşturulan geçici çalışma alanında, yani Stack Frame'inde saklanır. Fonksiyon sona erdiğinde bu alan serbest bırakılır.</p>
  </div>
</div>

---
