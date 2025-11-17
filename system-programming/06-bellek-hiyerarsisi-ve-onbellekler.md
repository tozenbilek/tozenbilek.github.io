---
layout: default
title: Bellek Hiyerarşisi ve Önbellekler
nav_order: 6
parent: System Programming
---

# Bellek Hiyerarşisi ve Önbellekler (Caches)

Modern bir işlemci çok hızlıyken, ana bellek (RAM) ona kıyasla çok yavaştır. Bu devasa hız farkı, "CPU-Bellek Uçurumu" olarak bilinir. Bu bölümde, bu uçurumu kapatmak için tasarlanmış **bellek hiyerarşisini** ve en önemli bileşeni olan **caches (önbellekleri)** inceleyeceğiz.

---

## 1. Depolama Teknolojileri ve Bellek Hiyerarşisi

Farklı bellek türleri, hız, maliyet ve boyut arasında farklı dengeler sunar. Bu teknolojiler, hızlarına göre bir piramit şeklinde organize edilir.

```mermaid
graph TD
    A["HIZLI, KÜÇÜK, PAHALI"]:::label
    B["Yazmaçlar"]
    C["L1, L2, L3 Cache (SRAM)"]
    D["Ana Bellek (DRAM)"]
    E["Lokal Disk (SSD/HDD)"]
    F["YAVAŞ, BÜYÜK, UCUZ"]:::label

    A --> B
    B --> C
    C --> D
    D --> E
    E --> F

    subgraph " "
        direction LR
        Lat["<br><b>Erişim Süresi</b><br>~1 ns<br>~5-10 ns<br>~50-100 ns<br>~10-20 ms"]
    end
    
    subgraph " "
        direction LR
        Size["<br><b>Tipik Boyut</b><br>~KB<br>~MB<br>~GB<br>~TB"]
    end


classDef label fill:none,stroke:none,font-weight:bold
```

**Temel Fikir:** Her katman, bir altındaki daha yavaş ve daha büyük katman için bir **cache (önbellek)** görevi görür. En sık kullanılan veriler, piramidin en tepesine yakın tutulmaya çalışılır.

<div class="quiz-question">
  <p><b>Soru:</b> Bellek hiyerarşisinin en tepesinde (işlemciye en yakın) ne bulunur ve en temel özelliği nedir?</p>
  <div class="quiz-option">A) DRAM - En yüksek kapasite</div>
  <div class="quiz-option">B) SSD - Kalıcı depolama</div>
  <div class="quiz-option" data-correct="true">C) Registers (Yazmaçlar) - En yüksek hız</div>
  <div class="quiz-option">D) L3 Cache - En iyi maliyet/performans oranı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Hiyerarşinin en tepesinde, işlemcinin kendi içindeki yazmaçlar bulunur. Bunlar en hızlı erişilebilen ancak en küçük kapasiteli bellek türüdür.</p>
  </div>
</div>

---

## 2. Principle of Locality (Yerellik Prensibi)

Bellek hiyerarşisi, programların belleğe genellikle öngörülebilir desenlerle erişmesi sayesinde verimli çalışır. Buna **yerellik prensibi** denir.

### a) Temporal Locality (Zamansal Yerellik)
Eğer bir veriye erişildiyse, yakın gelecekte ona **tekrar** erişilme olasılığı yüksektir.
*   **Örnek:** Bir döngü içindeki sayaç değişkeni.

### b) Spatial Locality (Uzamsal Yerellik)
Eğer bir veriye erişildiyse, onun bellekteki **komşularına** da yakın gelecekte erişilme olasılığı yüksektir.
*   **Örnek:** Bir dizinin elemanlarını sırayla işlemek.

<div class="quiz-question">
  <p><b>Soru:</b> Bir döngü içinde aynı değişkene 1000 defa erişmek, hangi yerellik prensibinin bir örneğidir?</p>
  <div class="quiz-option" data-correct="true">A) Temporal Locality (Zamansal Yerellik)</div>
  <div class="quiz-option">B) Spatial Locality (Uzamsal Yerellik)</div>
  <div class="quiz-option">C) Sequential Locality (Sıralı Yerellik)</div>
  <div class="quiz-option">D) Random Locality (Rastgele Yerellik)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Kısa bir zaman aralığında aynı bellek konumuna (değişkene) tekrar tekrar erişilmesi, zamansal yerelliğin tanımıdır.</p>
  </div>
</div>

---

## 3. Önbellek Organizasyonu ve Çalışma Mantığı

Önbellek, ana bellekten okunan verileri geçici olarak saklayan küçük ve hızlı bir SRAM belleğidir. Veri, **blok (block)** adı verilen sabit boyutlu parçalar halinde (genellikle 64 byte) önbelleğe kopyalanır.

Bir önbelleğin temel organizasyonu üç ana bileşenden oluşur: **Setler (Sets)**, **Satırlar (Lines)** ve **Bloklar (Blocks)**.

```mermaid
graph TD
    subgraph "Önbellek (Cache)"
        direction LR
        
        S0["Set 0"]
        S1["Set 1"]
        S...["..."]
        S_S_minus_1["Set S-1"]

        subgraph "Set 1'in İç Yapısı"
            direction TB
            L0["<b>Line 0:</b> [ v | tag | data block ]"]
            L1["<b>Line 1:</b> [ v | tag | data block ]"]
            L...["..."]
            L_E_minus_1["<b>Line E-1:</b> [ v | tag | data block ]"]
        end
    end

    style S1 fill:#D2E9FF,stroke:#99C7FF
```
*   **Set (Küme):** Önbellek, `S` adet kümeden oluşur. Bir bellek adresi, her zaman sadece belirli bir kümenin içinde olabilir.
*   **Line (Satır):** Her küme, `E` adet satırdan oluşur. Her satır, üç temel bilgiyi içerir:
    1.  **Valid Bit (v):** Bu satırdaki verinin geçerli olup olmadığını söyler (`1` = geçerli, `0` = geçersiz).
    2.  **Tag (Etiket):** Bu satırda hangi bellek bloğunun saklandığını doğrulamak için kullanılan benzersiz bir kimlik numarasıdır.
    3.  **Data Block (Veri Bloğu):** Ana bellekten kopyalanan asıl verinin kendisidir.

### Bir Adres Önbellekte Nasıl Aranır?

İşlemci bir `A` bellek adresine erişmek istediğinde, bu adres üç parçaya bölünür:

| t bit (tag) | s bit (set index) | b bit (block offset) |
|:-----------:|:-----------------:|:--------------------:|

1.  **Set Seçimi:** Adresin `s` bitleri, hangi **sete** bakılacağını belirler.
2.  **Satır Arama (Tag Karşılaştırma):** O setin içindeki tüm satırlar kontrol edilir. Satırın `valid` biti `1` ise ve adresteki `t` bitleri ile satırın `tag`'i eşleşiyorsa...
3.  **Cache Hit (Vuruş)!** Aranan veri önbellekte bulunmuştur. Adresin `b` bitleri, blok içindeki doğru bayt'ı bulmak için kullanılır.
4.  **Cache Miss (Iskalama):** Eğer set içinde eşleşen bir `tag` bulunamazsa, bu bir "ıskalamadır". İşlemci yavaşlar ve veri bloğunu ana bellekten getirmek zorunda kalır. Bu yavaşlığa **miss penalty (ıskalama cezası)** denir.

**Ana Fikir:** Yerellik prensibi sayesinde, bir kez "miss" yaşayıp bir bloğu önbelleğe getirdiğimizde, o bloktaki diğer veriler için gelecekte yaşanacak erişimler (farklı `b` bitleriyle) "hit" olacaktır.

<div class="quiz-question">
  <p><b>Soru:</b> Bir bellek adresinin `s` bitleri (set index) neyi belirlemek için kullanılır?</p>
  <div class="quiz-option">A) Verinin blok içinde nerede olduğunu.</div>
  <div class="quiz-option" data-correct="true">B) Önbellekte hangi sete bakılması gerektiğini.</div>
  <div class="quiz-option">C) Verinin geçerli olup olmadığını.</div>
  <div class="quiz-option">D) Verinin önbellekteki kopyasının ana bellekteki orijinaliyle eşleşip eşleşmediğini.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir bellek adresi, önbellek geometrisine göre parçalara ayrılır. `s` bitleri, adresin önbellekteki potansiyel konumunu belirleyen küme indeksini (set index) temsil eder. Bu, aramanın tüm önbellek yerine sadece küçük bir kümede yapılmasını sağlayarak verimliliği artırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir "cache hit" durumunun gerçekleşmesi için hangi iki koşulun aynı anda sağlanması gerekir?</p>
  <div class="quiz-option">A) Set indeksi doğru olmalı ve blok ofseti sıfır olmalı.</div>
  <div class="quiz-option">B) Tag eşleşmeli ve blok ofseti sıfırdan büyük olmalı.</div>
  <div class="quiz-option" data-correct="true">C) Satırın "valid" biti 1 olmalı ve adresteki "tag" ile satırdaki "tag" eşleşmeli.</div>
  <div class="quiz-option">D) "Valid" bit 1 olmalı ve set indeksi sıfır olmalı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir "hit"in gerçekleşmesi için iki şey kesindir: 1) İlgili setteki satırın geçerli veri içerdiğini belirten `valid` bitinin `1` olması. 2) Bu geçerli verinin, aradığımız bellek adresine ait olduğunu doğrulayan `tag` bitlerinin eşleşmesi.</p>
  </div>
</div>

---

## 4. Cache-Friendly (Önbellek Dostu) Kod Yazmak

Programlarımızın performansını artırmak için, kodumuzun bellek erişim desenlerini yerellik prensibini güçlendirecek şekilde yazmalıyız.

### Örnek: Matris Toplamı
C dilinde matrisler bellekte **row-major (satır-öncelikli)** olarak (satır satır) saklanır.

```c
// Uzamsal yerelliği MÜKEMMEL
void sum_row_major(int **matrix, int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            sum += matrix[i][j]; // Bellekte sıralı erişim
        }
    }
}

// Uzamsal yerelliği ÇOK KÖTÜ
void sum_col_major(int **matrix, int n) {
    for (int j = 0; j < n; j++) {
        for (int i = 0; i < n; i++) {
            sum += matrix[i][j]; // Bellekte atlamalı erişim
        }
    }
}
```
`sum_row_major` fonksiyonu belleğe sıralı erişim yapar. Bu, mükemmel bir uzamsal yerellik örneğidir. Bir eleman için yaşanan "miss", tüm bir satırı önbelleğe getireceği için o satırdaki diğer elemanlara erişim "hit" olacaktır.

`sum_col_major` ise bellekte birbirinden uzak adreslere atlayarak erişim yapar. Bu, her erişimde yeni bir "cache miss" yaşanmasına neden olabilir ve fonksiyonu diğerine göre **kat kat yavaşlatır**.

<div class="quiz-question">
  <p><b>Soru:</b> Bir programcının yazdığı kodun yavaş çalıştığı tespit ediliyor. Analiz sonucunda, programın "cache miss rate" (önbellek ıskalama oranı) çok yüksek çıkıyor. Programı hızlandırmak için aşağıdakilerden hangisi en etkili yaklaşım olur?</p>
  <div class="quiz-option">A) Daha hızlı bir işlemci (CPU) kullanmak.</div>
  <div class="quiz-option">B) Daha fazla RAM eklemek.</div>
  <div class="quiz-option" data-correct="true">C) Kodun bellek erişim desenlerini, sıralı erişimi (stride-1) artıracak şekilde yeniden düzenlemek.</div>
  <div class="quiz-option">D) Programı daha düşük seviyeli bir dil olan Assembly ile yeniden yazmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Yüksek bir "cache miss rate", programın yerellik prensibinden iyi faydalanamadığını gösterir. Bellek erişimlerini daha sıralı ve öngörülebilir hale getirmek (uzamsal yerelliği artırmak), "cache hit rate" (önbellek vuruş oranını) artıracak ve performansı önemli ölçüde iyileştirecektir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir `struct`