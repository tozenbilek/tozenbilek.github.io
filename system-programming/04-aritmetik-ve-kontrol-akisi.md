---
layout: default
title: Aritmetik ve Kontrol Akışı
nav_order: 4
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

Bu komutlar yalnızca register ve bellek içeriklerini değiştirmekle kalmaz, aynı zamanda **condition code**'ları da (ZF, SF, OF, CF) etkiler. Bu sayede, bir sonraki bölümde göreceğimiz `cmp` / `test` ve `j...` dallanma komutları, bu aritmetik işlemlerin sonucuna göre karar verebilir.

### b) `leaq` Komutu: Belleğe Dokunmadan Adres Hesabı Yapma Sanatı
`leaq Source, Destination` (Load Effective Address) komutu, Assembly'nin en ilginç ve güçlü komutlarındandır. Standart `movq` komutunun aksine, bu komut **belleğe gerçekten erişmez.**

`leaq`, `Source` operandının belirttiği *bellek adresini hesaplar* ve bu adresin kendisini `Destination` register'ına yazar.

**`movq` ile `leaq` Arasındaki Temel Fark:**
`%rdi` register'ında `0x100` değeri olduğunu varsayalım.
*   `movq (%rdi), %rax`: Belleğin `0x100` adresine git, oradaki **değeri** oku ve `%rax`'e kopyala.
*   `leaq (%rdi), %rax`: Sadece `(%rdi)` ifadesinin sonucunu, yani `0x100` **adresinin kendisini** `%rax`'e kopyala. Belleğe hiç dokunma.

Bu özelliği sayesinde, toplama ve sınırlı çarpma işlemleri için de dahice bir şekilde kullanılabilir.

*   **Örnek:** `%rax`'ta `x` değeri varken `leaq (%rax, %rax, 2), %rdx` komutu, `%rdx` register'ına `x + x*2`, yani `3*x` değerini yazar. Bu, `imul` komutundan daha hızlı olabilir.

Biraz daha somutlaştıralım:

**Örnek: `x * 3 - 5` Hesabını C ve Assembly ile Yazmak**

**C Kodu:**
```c
long scale3(long x) {
    return x * 3 - 5;
}
```

**Assembly (olası bir çeviri):**
```asm
scale3:
    leaq (%rdi, %rdi, 2), %rax   # %rax = x + 2*x  = 3*x
    subq $5, %rax                # %rax = 3*x - 5
    ret
```

Burada:

*   Parametre `x`, çağrı kuralına göre `%rdi` register'ında gelir.
*   `leaq` komutu, belleğe dokunmadan `3*x` ifadesini hesaplar.
*   `subq $5, %rax` ile sonuçtan `5` çıkarılır ve fonksiyonun dönüş değeri olarak `%rax` içinde bırakılır.

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

`if`, `for`, `while` gibi C dilindeki kontrol yapıları, makine seviyesinde iki temel mekanizmayla çalışır: **durum kodlarını ayarlama** ve bu kodlara göre **koşullu zıplama**.

### a) Durum Kodlarını Ayarlama: `cmpq` ve `testq`

İşlemcinin içinde, en son yapılan aritmetik işlemin sonucu hakkında bilgi tutan özel, tek bitlik register'lar bulunur. Bunlara **Condition Codes (Durum Kodları)** denir. En önemlileri şunlardır:

*   **`ZF` (Zero Flag):** Sonuç **sıfır** ise `1` olur.
*   **`SF` (Sign Flag):** Sonuç **negatif** ise `1` olur.
*   **`CF` (Carry Flag):** İşaretsiz (unsigned) bir işlemde **taşma** olduysa `1` olur.
*   **`OF` (Overflow Flag):** İşaretli (signed) bir işlemde **taşma** olduysa `1` olur.

Durum kodlarını, bir sonraki `jump` komutunun karar verebilmesi için ayarlayan iki temel komut vardır:

1.  **`cmpq S2, S1` (Compare):** Arka planda `S1 - S2` işlemini yapar ama sonucu hiçbir yere kaydetmez. Sadece bu çıkarma işleminin sonucuna göre durum kodlarını ayarlar.
    *   Kullanım: `if (x == y)`, `if (x > y)` gibi karşılaştırmalar için.
    *   `cmpq %rax, %rsi` -> `ZF=1` ise `%rsi == %rax` demektir.

2.  **`testq S2, S1` (Test):** Arka planda `S1 & S2` (bitwise AND) işlemini yapar ve sonucu kaydetmez. Sadece bu AND işleminin sonucuna göre `ZF` ve `SF`'yi ayarlar.
    *   Kullanım: Bir sayının belirli bitlerini kontrol etmek veya sayının sıfır olup olmadığını anlamak için çok verimlidir.
    *   `testq %rax, %rax` -> `ZF=1` ise `%rax == 0` demektir.

Aşağıdaki tablo, bu iki komutun tipik kullanım farkını özetler:

| Komut        | Yaptığı İş              | Tipik Kullanım                     |
| :----------- | :---------------------- | :--------------------------------- |
| `cmpq S2,S1` | `S1 - S2` sonucu ile CC | `if (a < b)`, `if (x == y)`       |
| `testq S2,S1`| `S1 & S2` sonucu ile CC | `if (x != 0)`, bit mask kontrolü  |

### b) Koşullu Zıplama (Conditional Jumps)

`j...` ile başlayan komutlar, durum kodlarının o anki değerine bakarak programın akışını farklı bir **etikete (label)** yönlendirir.

*   `jmp Etiket`: Koşulsuz zıpla.
*   `je Etiket` (Jump if Equal): Eşitse zıpla (`ZF=1`).
*   `jne Etiket` (Jump if Not Equal): Eşit değilse zıpla (`ZF=0`).
*   `js Etiket` (Jump if Sign): Sonuç negatifse zıpla (`SF=1`).
*   `jg Etiket` (Jump if Greater): İşaretli "büyükse" zıpla (`ZF=0` ve `SF==OF`).
*   `ja Etiket` (Jump if Above): İşaretsiz "büyükse" zıpla (`CF=0` ve `ZF=0`).

Bu mekanizma, `if-else` gibi yapıların temelini oluşturur:

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

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdaki kod parçası, C dilindeki hangi koşula en yakındır?</p>
  <pre><code class="language-asm">
testq %rdi, %rdi
je   .Lnull
  </code></pre>
  <div class="quiz-option" data-correct="true">A) <code>if (p == NULL)</code></div>
  <div class="quiz-option">B) <code>if (p != NULL)</code></div>
  <div class="quiz-option">C) <code>if (*p == 0)</code></div>
  <div class="quiz-option">D) <code>if (*p != 0)</code></div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> <code>testq %rdi, %rdi</code> komutu pratikte <code>cmpq $0, %rdi</code> ile aynı etkiyi yaratır: Eğer <code>%rdi == 0</code> ise <code>ZF=1</code> olur. Ardından gelen <code>je</code> komutu, sadece ZF=1 iken dallandığı için bu yapı, C dilindeki <code>if (p == NULL)</code> koşuluna karşılık gelir.</p>
  </div>
</div>

---

## 3. Prosedürler (Fonksiyonlar) ve Program Yığını (The Stack)

Fonksiyon çağrıları, belleğin "son giren ilk çıkar" (LIFO) prensibiyle çalışan **yığın (stack)** bölgesi tarafından yönetilir. Stack, **yüksek bellek adreslerinden alçak adreslere doğru** büyür.

İki önemli register bu süreci yönetir:
*   `%rsp` (Stack Pointer): Her zaman yığının en "tepesinin" (en son eklenen elemanın) adresini tutar.
*   `%rbp` (Base Pointer): Çağrılan fonksiyonun kendi çalışma alanının (stack frame) taban adresini işaretlemek için kullanılır. Bu, fonksiyonun kendi yerel değişkenlerine ve aldığı argümanlara tutarlı bir şekilde erişmesini sağlar.

### a) Çağrı ve Geri Dönüş Mekanizması

1.  **`callq my_func`:** Bu komut iki temel iş yapar:
    1.  `callq`'dan bir sonraki komutun adresini (**dönüş adresi**) yığına `push` eder. Bu, fonksiyon bittiğinde nereye geri döneceğini bilmesini sağlar.
    2.  Programın kontrolünü `my_func` etiketindeki komuta zıplatarak aktarır.

2.  **`retq`:** Bu komut da iki temel iş yapar:
    1.  Yığının tepesindeki dönüş adresini bir register'a `pop` eder.
    2.  Programın kontrolünü o adrese zıplatarak geri verir.

### b) Yığın Çerçevesi (Stack Frame)

Bir fonksiyon çağrıldığında, yığın üzerinde kendine ait, **yığın çerçevesi (stack frame)** adı verilen özel bir çalışma alanı oluşturulur. Bu çerçeve, fonksiyonun çalışması için gereken her şeyi barındırır.

```mermaid
graph TD
    subgraph "Yığın (Stack) - Yüksek Adresten Düşüğe Büyür"
        direction TB
        A["..."]
        B["Önceki Fonksiyonun Çerçevesi"]
        
        subgraph "<b>aktif_fonk() Stack Frame'i</b>"
            C["<b>Dönüş Adresi</b><br><i>(callq tarafından eklendi)</i>"]
            D["<b>Eski %rbp Değeri</b><br><i>(Fonksiyonun başında saklandı)</i>"]
            E["Lokal Değişkenler<br>(Örn: int x, char* s)"]
            F["..."]
        end
        
        G["... (Daha Düşük Adresler)"]
    end
    
    A --> B --> C --> D --> E --> F --> G

    subgraph "İşaretçiler (Pointerlar)"
        direction LR
        RBP["<b>%rbp</b><br>(Base Pointer)"] --> D
        RSP["<b>%rsp</b><br>(Stack Pointer)"] --> F
    end
    
    style RBP fill:#D2E9FF,stroke:#99C7FF
    style RSP fill:#FFD2D2,stroke:#FF9999
```
Bu yapı sayesinde, bir fonksiyon diğerini çağırdığında (ve o da bir başkasını), her birinin kendi özel değişken alanı olur ve program karışıklık olmadan çalışır.

### Örnek: Basit Bir Fonksiyonun Stack Frame'i

Aşağıdaki fonksiyonun nasıl bir çerçeve (stack frame) oluşturduğunu inceleyelim:

**C Kodu:**
```c
long sum2(long x, long y) {
    long z = x + y;
    return z;
}
```

**Olası Assembly (özetlenmiş):**
```asm
sum2:
    pushq %rbp           # Eski %rbp'yi sakla
    movq  %rsp, %rbp     # Yeni frame'in tabanı = eski stack tepesi
    subq  $16, %rsp      # (İsteğe bağlı) yerel değişkenler için alan aç

    movq  %rdi, -8(%rbp) # x'i stack'e kaydet
    movq  %rsi, -16(%rbp)# y'yi stack'e kaydet

    movq  -8(%rbp), %rax # %rax = x
    addq  -16(%rbp), %rax# %rax = x + y

    leave                # mov %rbp,%rsp; pop %rbp
    ret                  # Dönüş adresine zıpla
```

Bu örnekte:

*   `%rbp` aktif fonksiyonun çerçevesi için sabit bir referans noktası (anchor) oluşturur.
*   `leave` komutu, fonksiyon sonunda stack frame'i temizleyip eski `%rbp` değerini geri yükler.

<div class="quiz-question">
  <p><b>Soru:</b> Bir C kodunda `if (x > 0)` kontrolü yapılacaktır. `%rax` register'ında `x`'in değeri tutuluyorsa, bu kontrolü yapmak için hangi Assembly komutları en mantıklısıdır?</p>
  <div class="quiz-option">A) `movq $0, %rax` ve `je .zero_label`</div>
  <div class="quiz-option" data-correct="true">B) `testq %rax, %rax` ve `jle .not_positive_label`</div>
  <div class="quiz-option">C) `addq $1, %rax` ve `js .negative_label`</div>
  <div class="quiz-option">D) `leaq (%rax), %rax` ve `jmp .loop_label`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir sayının sıfır veya negatif olup olmadığını kontrol etmenin en verimli yollarından biri `testq` komutudur. 
    <pre><code class="language-asm">
testq %rax, %rax  # %rax & %rax işlemini yap. Sonuç 0 ise ZF=1, negatifse SF=1 olur.
jle .not_positive_label # "Jump if Less or Equal". ZF=1 (eşitse) veya SF=1 (küçükse) zıpla.
    </code></pre>
    Bu kod bloğu, `x <= 0` durumunda etikete zıplar, bu da `x > 0` kontrolünün tam tersidir ve `if` bloklarını uygulamak için yaygın bir yöntemdir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> `main` fonksiyonu içinden `sum(a, b)` fonksiyonuna `callq sum` komutuyla bir çağrı yapılıyor. `sum` fonksiyonu işini bitirip `retq` komutunu çalıştırdığında programın akışı nereye döner?</p>
  <div class="quiz-option">A) `main` fonksiyonunun en başına.</div>
  <div class="quiz-option">B) Programın sonuna.</div>
  <div class="quiz-option" data-correct="true">C) `main` içindeki `callq sum` komutundan hemen sonraki komuta.</div>
  <div class="quiz-option">D) `sum` fonksiyonunun en başına.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `callq` komutu çalıştırılmadan hemen önce, bir sonraki komutun adresi ("dönüş adresi") yığına (stack) kaydedilir. `retq` komutunun tek görevi, yığındaki bu adresi alıp programı oradan devam ettirmektir. Bu mekanizma, fonksiyonların çağrıldıkları yere geri dönebilmelerini sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> `%rbp` (Base Pointer) register'ının temel amacı nedir?</p>
  <div class="quiz-option">A) Yığının en tepesini göstermek.</div>
  <div class="quiz-option" data-correct="true">B) Aktif fonksiyonun yığın çerçevesinin (stack frame) tabanını işaretleyerek lokal değişkenlere ve argümanlara sabit bir noktadan erişim sağlamak.</div>
  <div class="quiz-option">C) Bir sonraki çalıştırılacak komutun adresini tutmak.</div>
  <div class="quiz-option">D) Fonksiyonun dönüş değerini saklamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `%rsp` (Stack Pointer) yığına eleman eklenip çıkarıldıkça sürekli hareket eder. Bu nedenle, fonksiyonun kendi değişkenlerine `%rsp`'ye göre erişmek karmaşık olurdu. `%rbp` ise fonksiyon boyunca sabit kalarak, tüm lokal değişkenlere ve argümanlara bilinen, sabit bir ofsetle (`-8(%rbp)` gibi) erişilmesini sağlayan güvenilir bir "çapa" (anchor) görevi görür.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdaki iki komut birlikte çalıştırıldığında hangi işlemi gerçekleştirir?</p>
  <pre><code class="language-asm">
leave
ret
  </code></pre>
  <div class="quiz-option">A) Yalnızca fonksiyonun dönüş değerini ayarlar.</div>
  <div class="quiz-option">B) Sadece eski <code>%rbp</code> değerini geri yükler.</div>
  <div class="quiz-option" data-correct="true">C) Aktif stack frame'i temizler ve çağıran fonksiyona geri döner.</div>
  <div class="quiz-option">D) Yerel değişkenleri sıfırlar.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> <code>leave</code> komutu, özetle <code>mov %rbp, %rsp</code> ve <code>pop %rbp</code> işlemlerini yaparak mevcut stack frame'i temizler. Ardından <code>ret</code> komutu, stack'teki dönüş adresini alıp programın kontrolünü çağıran fonksiyona devreder.</p>
  </div>
</div>

---
