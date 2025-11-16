---
layout: default
title: Gaussian ve Median Filter'lar
parent: 2. Image Formation ve Filtering
nav_order: 3
---

# Gaussian ve Median Filter'lar

Farklı `noise` türleriyle başa çıkmak için özelleşmiş `filter`'lar kullanırız. En yaygın ve güçlü iki `filter`, **Gaussian filter** ve **Median filter**'dır.

## Gaussian Filter

**Box filter**, yani basit ortalama alma, bazı dezavantajlara sahiptir. Penceredeki tüm `pixel`'lere eşit ağırlık verir ve bu da filtrelenmiş `image`'de bloklu yapılar oluşturabilir. Daha doğal bir `smoothing` için **Gaussian filter** kullanılır.

**Temel Fikir:**
Bir `pixel`'in değerini hesaplarken, merkezdeki `pixel`'e daha yakın olan komşulara daha fazla ağırlık ver, uzaklaştıkça ağırlığı azalt. Bu ağırlık dağılımı, çan eğrisi olarak da bilinen **Gaussian function** ile modellenir.

**Kernel:**
`Gaussian filter`'ın `kernel`'i, merkezde en yüksek değere sahip olan ve kenarlara doğru simetrik olarak azalan değerlerden oluşur. Örneğin, 3x3 bir `Gaussian kernel` şuna benzer:

\[
\frac{1}{16}
\begin{bmatrix}
1 & 2 & 1 \\
2 & 4 & 2 \\
1 & 2 & 1
\end{bmatrix}
\]

**Parametre: Standard Deviation (`σ`)**
`Gaussian filter`'ın en önemli parametresi `σ`'dır (sigma).
- **Küçük `σ`:** Ağırlıklar merkeze çok yakın toplanır, bu da daha az `smoothing`'e neden olur. İnce detaylar korunur.
- **Büyük `σ`:** Ağırlıklar daha geniş bir alana yayılır, bu da daha güçlü bir `smoothing` etkisi yaratır. `Image` daha bulanık hale gelir, ancak `noise` daha etkili bir şekilde bastırılır.

> **Ne Zaman Kullanılır?** `Gaussian filter`, **Gaussian noise**'u gidermek için en etkili `linear filter`'dır. `Image smoothing` ve `preprocessing` adımlarında çok yaygın olarak kullanılır.

![Gaussian Filtre Uygulaması](https://placehold.co/600x300/EEE/31343C?text=Solda:+Gürültülü+Görüntü+|+Sağda:+Gaussian+Filtre+Sonucu)
*<center>Solda Gaussian gürültülü görüntü, sağda Gaussian filtresi uygulanmış hali.</center>*

## Median Filter

**Salt and Pepper** gibi, `image`'de aykırı ve aşırı değerlere sahip (0 veya 255 gibi) `noise` türleri için ortalama tabanlı `filter`'lar iyi çalışmaz. Çünkü bu aşırı değerler ortalamayı ciddi şekilde saptırır.

**Temel Fikir:**
Bir `pixel`'in değerini, `neighborhood` penceresindeki `pixel`'lerin ortalaması yerine **median (ortanca) değeri** ile değiştir.

**Nasıl Çalışır?**
1.  Filtre penceresindeki tüm `pixel` değerleri küçükten büyüğe doğru sıralanır.
2.  Sıralanmış bu listenin ortasındaki değer seçilir.
3.  Merkez `pixel`'in değeri bu `median` değer ile güncellenir.

**Örnek:**
Pencere değerleri: `[10, 15, 20, 12, 255, 18, 22, 14, 17]`
Sıralanmış hali: `[10, 12, 14, 15, **17**, 18, 20, 22, 255]`
`Median` değer `17`'dir. `255` gibi aykırı bir değer hesaplamayı etkilemez.

**Özellikleri:**
- **Non-linear:** `Median` operasyonu toplama ve çarpma kurallarına uymadığı için `linear filter` değildir.
- **Edge Preserving:** Ortalama `filter`'larına göre `edge`'leri daha iyi koruma eğilimindedir, çünkü `edge`'ler boyunca `median` değeri çok fazla değişmez.
- **Spike Gürültüsünü Giderme:** *Salt and Pepper* ve *Impulse* gibi ani ve aşırı `noise`'ları gidermede son derece etkilidir.

> **Ne Zaman Kullanılır?** **Salt and Pepper** veya **Impulse** türü `noise`'ları temizlemek için en iyi seçenektir. Aykırı değerleri (`outliers`) ortadan kaldırmada çok başarılıdır.

![Median Filtre Uygulaması](https://placehold.co/600x300/EEE/31343C?text=Solda:+Gürültülü+Görüntü+|+Sağda:+Median+Filtre+Sonucu)
*<center>Solda Salt and Pepper gürültülü görüntü, sağda Median filtresi uygulanmış hali.</center>*

---

## Özet ve Anahtar Kavramlar

-   **Gaussian Filter:** Merkezdeki `pixel`'lere daha fazla ağırlık veren, çan eğrisi şeklinde bir `kernel` kullanır. `Linear` bir filtredir ve özellikle **Gaussian gürültüsünü** gidermek için etkilidir. `σ` (sigma) parametresi `smoothing` miktarını kontrol eder.
-   **Median Filter:** Bir penceredeki `pixel`'lerin ortalaması yerine **ortanca (median)** değerini kullanır. `Non-linear` bir filtredir. `Edge`'leri korumada daha başarılıdır ve özellikle **Salt and Pepper** gibi aykırı değerlere sahip gürültüleri gidermede çok etkilidir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> "Salt and Pepper" gürültüsünü temizlemek için aşağıdaki filtrelerden hangisi en etkilidir ve neden?</p>
  <div class="quiz-option">A) Gaussian Filtresi, çünkü tüm piksellerin ortalamasını alarak gürültüyü yumuşatır.</div>
  <div class="quiz-option">B) Sharpening Filtresi, çünkü gürültülü pikselleri belirginleştirir.</div>
  <div class="quiz-option" data-correct="true">C) Median Filtresi, çünkü aşırı (siyah/beyaz) gürültü değerlerini sıralamada eleyerek ortadaki değeri seçer.</div>
  <div class="quiz-option">D) Box Filtresi, çünkü en basit ortalama alma filtresidir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Median filtresi, bir penceredeki pikselleri sıralayıp ortadaki değeri seçtiği için, penceredeki aşırı aykırı değerlerden (tam siyah veya tam beyaz pikseller) etkilenmez. Ortalama alan Gaussian veya Box filtreleri ise bu aşırı değerleri hesaba katarak gürültüyü etrafa "bulaştırır".</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir filtrenin "linear" (doğrusal) olmasının tanımı `H(a*F1 + b*F2) = a*H(F1) + b*H(F2)` şeklindedir. Median filtresi neden bu tanıma uymaz ve "non-linear" olarak kabul edilir?</p>
  <div class="quiz-option">A) Çünkü sadece tek sayılı kernel boyutlarıyla çalışır.</div>
  <div class="quiz-option">B) Çünkü `median` işlemi, toplama ve skaler çarpma ile dağılma özelliği göstermez.</div>
  <div class="quiz-option">C) Çünkü `median` işlemi `convolution` olarak ifade edilemez.</div>
  <div class="quiz-option" data-correct="true">D) Hem B hem de C.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> `Median` işlemi, `convolution` gibi bir ağırlıklı toplam değildir ve `linear` sistemlerin temelini oluşturan `superposition` (toplamsallık ve ölçeklenme) ilkesine uymaz. İki görüntünün toplamının medyanı, o görüntülerin medyanlarının toplamına eşit değildir. Bu yüzden `non-linear` bir filtredir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir Gaussian filtresindeki `σ` (sigma) değerini artırmak görüntü üzerinde nasıl bir etki yaratır?</p>
  <div class="quiz-option">A) Görüntüyü keskinleştirir ama gürültüyü artırır.</div>
  <div class="quiz-option" data-correct="true">B) Görüntüyü daha fazla bulanıklaştırır ve gürültüyü daha iyi bastırır.</div>
  <div class="quiz-option">C) Görüntünün kontrastını artırır.</div>
  <div class="quiz-option">D) Görüntünün sadece kenarlarını bulanıklaştırır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Sigma, Gaussian fonksiyonunun standart sapmasıdır ve filtrenin ne kadar geniş bir alana yayılacağını belirler. Sigma'yı artırmak, daha geniş bir alandaki piksellerin ortalamaya daha fazla katkıda bulunmasına neden olur, bu da daha güçlü bir bulanıklaştırma (smoothing) etkisi ve dolayısıyla daha iyi gürültü bastırma anlamına gelir. Ancak bu, detay kaybını da artırır.</p>
  </div>
</div>
