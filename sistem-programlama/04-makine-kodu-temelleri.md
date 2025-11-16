---
layout: default
title: Makine Kodu Temelleri
nav_order: 4
parent: Sistem Programlama
---

# Makine Kodu Temelleri: C'den Assembly'ye

Yazdığımız C kodu, işlemci tarafından doğrudan anlaşılamaz. Bir **derleyici (compiler)**, bu insan tarafından okunabilir kodu, işlemcinin yürütebileceği düşük seviyeli **makine komutlarına (machine instructions)** dönüştürür. Bu komutların insan tarafından okunabilir gösterimine **Assembly dili** denir. Bu bölümde, bu dönüşüm sürecini ve Assembly dilinin temellerini inceleyeceğiz.

---

## 1. Derleme Süreci: Koddan Yürütülebilir Dosyaya

Bir C programını derlediğimizde aslında birkaç adımlık bir süreç işler:

1.  **C Kodu (`program.c`):** Yazdığımız kaynak kod.
2.  **Derleyici (Compiler):** Kaynak kodu Assembly diline çevirir. (`gcc -S program.c` -> `program.s`)
3.  **Assembler:** Assembly kodunu, makine tarafından okunabilen ikili nesne koduna (`object code`) dönüştürür. (`as program.s` -> `program.o`)
4.  **Linker:** Nesne kodunu, `printf` gibi kütüphane fonksiyonlarıyla birleştirerek son yürütülebilir dosyayı (`executable`) oluşturur. (`ld ... program.o ...` -> `a.out`)

![Derleme Süreci](https://via.placeholder.com/700x200.png?text=C+Source+->+Compiler+->+Assembly+->+Assembler+->+Object+Code+->+Linker+->+Executable)
*Görsel: C kodundan yürütülebilir dosyaya giden yol.*

---

## 2. Assembly Programcısının Dünyası

Assembly seviyesinde programı düşündüğümüzde, soyut C değişkenleri yerine işlemcinin donanım kaynaklarını görürüz:

*   **Program Sayacı (Program Counter - PC):** Yürütülecek bir sonraki komutun bellek adresini tutan özel bir yazmaç. x86-64'te adı `RIP`'dir.
*   **Yazmaçlar (Registers):** İşlemcinin içinde bulunan, çok hızlı, küçük depolama birimleri. Aritmetik işlemler, parametre geçişleri ve ara değerlerin saklanması için kullanılırlar.
*   **Durum Kodları (Condition Codes):** En son yapılan aritmetik veya mantıksal işlemin sonucu hakkında bilgi tutan tek bitlik bayraklar (örn: sonuç sıfır mıydı? negatif miydi? taşma oldu mu?).
*   **Bellek (Memory):** Kodun kendisi, global değişkenler, yığın (stack) ve dinamik olarak ayrılan verilerin (heap) tutulduğu büyük bir bayt dizisi.

---

## 3. x86-64 Mimarisi ve Yazmaçlar

Günümüzdeki çoğu masaüstü ve sunucu işlemcisi **x86-64** mimarisini kullanır. Bu mimari, 16 adet genel amaçlı 64-bit'lik yazmaç sunar.

| Yazmaç Adı | Tipik Kullanım Amacı                   |
| :--------- | :------------------------------------- |
| `%rax`     | Fonksiyon dönüş değeri                 |
| `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9` | Fonksiyon argümanları (ilk altı)      |
| `%rbx`, `%rbp`, `%r12`-%r15 | Çağrılan fonksiyon tarafından korunmalı |
| `%rsp`     | Yığın (Stack) işaretçisi               |
| `%r10`, `%r11` | Çağıran fonksiyon tarafından korunmalı   |

**Önemli Not:** `%rax` yazmacına 32-bit'lik bir işlemle (`movl`) yazmak, yazmacın üst 32-bit'ini otomatik olarak sıfırlar. Bu, 32-bit ve 64-bit kod arasında uyumluluk sağlayan önemli bir özelliktir.

---

## 4. Temel Komut: `mov` (Veri Taşıma)

Assembly'deki en temel komutlardan biri `mov`'dur. Bir değeri bir yerden başka bir yere kopyalar. `mov` komutu, veri boyutunu belirten bir sonek alır:
*   `movb` (move byte - 1 byte)
*   `movw` (move word - 2 byte)
*   `movl` (move long - 4 byte)
*   `movq` (move quad - 8 byte)

**`movq Kaynak, Hedef`**

*   **Kaynak (Source):**
    *   **Sabit (Immediate):** `$0x100` gibi dolar işaretiyle başlayan sabit bir değer.
    *   **Yazmaç (Register):** `%rax` gibi bir yazmaç.
    *   **Bellek (Memory):** `(%rax)` gibi parantez içinde bir adres.
*   **Hedef (Destination):**
    *   **Yazmaç (Register):** `%rbx` gibi bir yazmaç.
    *   **Bellek (Memory):** `(%rbx)` gibi bir adres.

**Kısıtlama:** Tek bir `mov` komutuyla bellekten belleğe doğrudan veri kopyalamak mümkün değildir. Veri önce bir yazmaca alınmalı, sonra o yazmaçtan hedefe yazılmalıdır.

---

## 5. Adresleme Modları

Belleğe erişmenin farklı yolları vardır. Bu yollara **adresleme modları** denir.

| Mod                   | Açıklama                                    | Örnek        |
| :-------------------- | :------------------------------------------ | :----------- |
| Immediate             | Sabit değer                                 | `$0x40`      |
| Register              | Bir yazmacın içeriği                        | `%rax`       |
| Normal (Absolute)     | Parantez içindeki yazmaç adres olarak kullanılır | `(%rcx)`     |
| Displacement          | Yazmaca bir sabit eklenerek adres bulunur   | `8(%rbp)`    |
| Indexed               | İki yazmaç toplanır                         | `(%rax, %rcx)`|
| Indexed with Scale    | İkinci yazmaç bir sabitle (1,2,4,8) çarpılır | `(%rax, %rcx, 4)` |

Bu modlar, diziler ve yapılar (structs) gibi veri yapılarına verimli erişim sağlamak için kritik öneme sahiptir.

---

### C'den Assembly'ye Örnek: `swap`

Aşağıdaki basit C fonksiyonunun Assembly karşılığına bakalım:
```c
void swap(long *xp, long *yp) {
    long t0 = *xp;
    long t1 = *yp;
    *xp = t1;
    *yp = t0;
}
```
*   `xp`'nin adresi `%rdi` yazmacında, `yp`'nin adresi `%rsi` yazmacındadır.

```assembly
# void swap(long *xp, long *yp)
# xp in %rdi, yp in %rsi
swap:
    movq  (%rdi), %rax   # t0 = *xp; (xp adresindeki degeri rax'e tasi)
    movq  (%rsi), %rdx   # t1 = *yp; (yp adresindeki degeri rdx'e tasi)
    movq  %rdx, (%rdi)   # *xp = t1; (rdx'deki degeri xp adresine yaz)
    movq  %rax, (%rsi)   # *yp = t0; (rax'deki degeri yp adresine yaz)
    ret                  # Fonksiyondan don
```

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir C programını derlerken, Assembly kodunu (`.s` dosyası) görmek için `gcc`'ye hangi parametre verilir?</p>
  <div class="quiz-option">A) `-c`</div>
  <div class="quiz-option">B) `-o`</div>
  <div class="quiz-option" data-correct="true">C) `-S`</div>
  <div class="quiz-option">D) `-E`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `gcc -S program.c` komutu, derleme işlemini Assembly kodu ürettikten sonra durdurur ve `program.s` adlı bir dosya oluşturur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> x86-64 mimarisinde, bir fonksiyondan dönen tamsayı veya pointer değeri tipik olarak hangi yazmaçta bulunur?</p>
  <div class="quiz-option" data-correct="true">A) `%rax`</div>
  <div class="quiz-option">B) `%rsp`</div>
  <div class="quiz-option">C) `%rdi`</div>
  <div class="quiz-option">D) `%rbp`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Çağrı kurallarına göre, fonksiyonun dönüş değeri `%rax` yazmacına yerleştirilerek çağıran fonksiyona döndürülür.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> `%rax` yazmacında `0x100` değeri, `%rbx` yazmacında ise `0x10` değeri olduğunu varsayalım. `movq 8(%rax, %rbx, 4), %rcx` komutu çalıştırıldığında, `%rcx` yazmacına hangi bellek adresindeki veri kopyalanır?</p>
  <div class="quiz-option">A) `0x118`</div>
  <div class="quiz-option">B) `0x148`</div>
  <div class="quiz-option">C) `0x440`</div>
  <div class="quiz-option" data-correct="true">D) `0x148` adresindeki veri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Adres hesaplaması `Sabit + Yazmac1 + Yazmac2 * Olcek` formülüne göre yapılır: `8 + 0x100 + 0x10 * 4` = `8 + 256 + 16 * 4` = `8 + 256 + 64` = `328`, yani `0x148`. Komut, bu hesaplanan adresteki 8 baytlık veriyi `%rcx` yazmacına kopyalar.</p>
  </div>
</div>
