---
layout: default
title: Bellek Hiyerarşisi ve Önbellekler
nav_order: 6
parent: System Programming
---

# Bellek Hiyerarşisi ve Önbellekler (Caches)

Modern bir işlemci saniyenin milyarda biri gibi sürelerde komutları yürütebilirken, ana bellekten (RAM) veri okumak yüzlerce kat daha yavaş kalır. Bu devasa hız farkı, "CPU-Bellek Uçurumu" olarak bilinir. Bu bölümde, bu uçurumu kapatmak için tasarlanmış dahice bir sistem olan **bellek hiyerarşisini** ve onun en önemli bileşeni olan **caches (önbellekleri)** inceleyeceğiz.

---

## 1. Depolama Teknolojileri

Farklı bellek türleri, hız, maliyet ve kalıcılık arasında farklı dengeler sunar.

*   **SRAM (Static RAM):** Çok hızlı, çok pahalı ve güç tüketimi yüksektir. İşlemcinin içindeki **önbellekler (L1, L2, L3 cache)** için kullanılır.
*   **DRAM (Dynamic RAM):** SRAM'den yavaş, çok daha ucuz ve daha az güç tüketir. Bilgisayarın **ana belleği (RAM)** olarak kullanılır. Sürekli tazelenmesi gerekir.
*   **Kalıcı Depolama:** Güç kesildiğinde bile veriyi saklar.
    *   **SSD (Solid State Drive):** Mekanik parçası olmayan, hızlı erişim sunan flash bellek tabanlı sürücüler.
    *   **HDD (Manyetik Disk):** Dönen plakalar ve okuma/yazma kafaları kullanan, daha yavaş ama daha ucuz ve yüksek kapasiteli geleneksel sürücüler.

---

## 2. Bellek Hiyerarşisi

Bu farklı teknolojiler, hızlarına ve boyutlarına göre bir piramit şeklinde organize edilir. Buna **bellek hiyerarşisi** denir.

![Bellek Hiyerarşisi](https://via.placeholder.com/500x400.png?text=Registers+->+L1+Cache+(SRAM)+->+L2+Cache+(SRAM)+->+L3+Cache+(SRAM)+->+Main+Memory+(DRAM)+->+Local+Disk+(SSD/HDD))
*Görsel: Tipik bir bellek hiyerarşisi. Yukarı çıktıkça hız ve maliyet artar, boyut azalır.*

**Temel Fikir:** Her katman, bir altındaki daha yavaş ve daha büyük katman için bir **cache (önbellek)** görevi görür. En sık kullanılan veriler, piramidin en tepesine yakın, en hızlı katmanlarda tutulmaya çalışılır.

---

## 3. Principle of Locality (Yerellik Prensibi)

Bellek hiyerarşisinin bu kadar etkili olmasının sebebi, programların belleğe rastgele değil, öngörülebilir desenlerle erişme eğilimidir. Buna **yerellik prensibi** denir ve iki türü vardır:

### a) Temporal Locality (Zamansal Yerellik)
Eğer bir veriye erişildiyse, yakın gelecekte ona tekrar erişilme olasılığı yüksektir.
*   **Örnek:** Bir döngü içindeki sayaç değişkeni veya tekrar tekrar çağrılan bir fonksiyonun içindeki komutlar.

### b) Spatial Locality (Uzamsal Yerellik)
Eğer bir veriye erişildiyse, onun bellekteki komşularına da yakın gelecekte erişilme olasılığı yüksektir.
*   **Örnek:** Bir dizinin elemanlarını sırayla işlemek. `A[0]`'a eriştikten sonra muhtemelen `A[1]`, `A[2]`'ye de erişeceksiniz.

---

## 4. Caches (Önbellekler) Nasıl Çalışır?

Önbellek, ana bellekten okunan verileri geçici olarak saklayan küçük ve hızlı bir SRAM belleğidir.
*   Veri, **block (blok)** adı verilen sabit boyutlu parçalar halinde önbelleğe kopyalanır.
*   İşlemci bir veriye ihtiyaç duyduğunda önce önbelleğe bakar.
    *   **Cache Hit (Önbellek Vuruşu):** Eğer veri önbellekte varsa, çok hızlı bir şekilde alınır.
    *   **Cache Miss (Önbellek Iskalama):** Eğer veri önbellekte yoksa, işlemci duraksar. Verinin bulunduğu tüm blok, ana bellekten önbelleğe kopyalanır ve sonra işlemciye sunulur. Bu işlem, bir "hit"e göre çok daha yavaştır (**miss penalty**).

**Ana Fikir:** Yerellik prensibi sayesinde, bir kez "miss" yaşayıp bir bloğu önbelleğe getirdiğimizde, o bloktaki diğer veriler (uzamsal yerellik) veya aynı veri (zamansal yerellik) için gelecekte yaşanacak erişimler "hit" olacaktır.

---

## 5. Cache-Friendly (Önbellek Dostu) Kod Yazmak

Programlarımızın performansını dramatik şekilde artırmak için, kodumuzun bellek erişim desenlerini yerellik prensibini güçlendirecek şekilde yazmalıyız.

### Örnek: Matris Toplamı
Aşağıdaki iki fonksiyondan hangisi daha hızlıdır?
```c
// Uzamsal yerelliği iyi
void sum_row_major(int **matrix, int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            sum += matrix[i][j]; // Sıralı erişim
        }
    }
}

// Uzamsal yerelliği kötü
void sum_col_major(int **matrix, int n) {
    int sum = 0;
    for (int j = 0; j < n; j++) {
        for (int i = 0; i < n; i++) {
            sum += matrix[i][j]; // Atlamalı erişim
        }
    }
}
```
C dilinde matrisler bellekte **row-major (satır-öncelikli)** olarak saklandığı için, `sum_row_major` fonksiyonu belleğe sıralı erişim yapar. Bu, mükemmel bir uzamsal yerellik örneğidir. Bir eleman için yaşanan "miss", tüm bir satırı önbelleğe getireceği için o satırdaki diğer elemanlara erişim "hit" olacaktır.

`sum_col_major` ise bellekte birbirinden uzak adreslere atlayarak erişim yapar. Bu, her erişimde yeni bir "cache miss" yaşanmasına neden olabilir ve bu da fonksiyonu diğerine göre **kat kat yavaşlatır**.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bellek hiyerarşisinin en tepesinde (işlemciye en yakın) ne bulunur ve en temel özelliği nedir?</p>
  <div class="quiz-option">A) DRAM - En yüksek kapasite</div>
  <div class="quiz-option">B) SSD - Kalıcı depolama</div>
  <div class="quiz-option" data-correct="true">C) Registers (Yazmaçlar) - En yüksek hız</div>
  <div class="quiz-option">D) L3 Cache - En iyi maliyet/performans oranı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Hiyerarşinin en tepesinde, işlemcinin kendi içindeki yazmaçlar bulunur. Bunlar en hızlı erişilebilen ancak en küçük kapasiteli bellek türüdür.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir döngü içinde aynı değişkene 1000 defa erişmek, hangi yerellik prensibinin bir örneğidir?</p>
  <div class="quiz-option" data-correct="true">A) Temporal Locality (Zamansal Yerellik)</div>
  <div class="quiz-option">B) Spatial Locality (Uzamsal Yerellik)</div>
  <div class="quiz-option">C) Sequential Locality (Sıralı Yerellik)</div>
  <div class="quiz-option">D) Random Locality (Rastgele Yerellik)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Kısa bir zaman aralığında aynı bellek konumuna (değişkene) tekrar tekrar erişilmesi, zamansal yerelliğin tanımıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir programcının yazdığı kodun yavaş çalıştığı tespit ediliyor. Analiz sonucunda, programın "cache miss rate" (önbellek ıskalama oranı) çok yüksek çıkıyor. Programı hızlandırmak için aşağıdakilerden hangisi en etkili yaklaşım olur?</p>
  <div class="quiz-option">A) Daha hızlı bir işlemci (CPU) kullanmak.</div>
  <div class="quiz-option">B) Daha fazla RAM eklemek.</div>
  <div class="quiz-option" data-correct="true">C) Kodun bellek erişim desenlerini, sıralı erişimi (stride-1) artıracak şekilde yeniden düzenlemek.</div>
  <div class="quiz-option">D) Programı daha düşük seviyeli bir dil olan Assembly ile yeniden yazmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Yüksek bir "cache miss rate", programın yerellik prensibinden iyi faydalanamadığını gösterir. Bellek erişimlerini daha sıralı ve öngörülebilir hale getirmek (uzamsal yerelliği artırmak), "cache hit rate" (önbellek vuruş oranını) artıracak ve performansı önemli ölçüde iyileştirecektir. Diğer seçenekler yardımcı olsa da, temel sorunu çözmezler.</p>
  </div>
</div>
