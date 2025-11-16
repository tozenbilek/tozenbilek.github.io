---
layout: default
title: Mean Shift Segmentasyonu
nav_order: 3
parent: Computer Vision
---

# Mean Shift Segmentasyonu

K-Means'in bazı dezavantajlarına (K'yı belirleme, küresel cluster varsayımı) bir alternatif olarak **Mean Shift** algoritması geliştirilmiştir. Mean Shift, `feature space`'teki veri yoğunluğunun tepe noktalarını (modlarını veya yerel maksimumlarını) bulmaya çalışan bir yöntemdir. Her bir tepe noktası, bir `cluster`'ın merkezini temsil eder.

## Mean Shift Nasıl Çalışır?

Mean Shift, her bir veri noktasını (`pixel`'in `feature vector`'ü) alır ve o noktanın etrafındaki veri yoğunluğunun daha yüksek olduğu bir bölgeye doğru iteratif olarak kaydırır. Bu işlem, bir "tepeye tırmanma" (`hill-climbing`) algoritması olarak düşünülebilir.

1.  **Bir Başlangıç Noktası Seç:** Rastgele bir `pixel`'in `feature vector`'ü `x` seçilir.
2.  **Komşuluk Penceresi Belirle:** `x`'i merkez alan belirli bir `h` yarıçaplı (`bandwidth`) bir pencere (genellikle küresel) tanımlanır.
3.  **Ağırlık Merkezini (Mean) Hesapla:** Pencerenin içindeki tüm noktaların ağırlık merkezi (`mean`'i) `m` hesaplanır.
4.  **Kaydır (Shift):** Başlangıç noktası `x`'i, hesaplanan ağırlık merkezi `m`'ye kaydır.
5.  **Tekrarla:** Yeni `x` noktası için 2-4 adımlarını, pencerenin merkezi artık değişmeyene (yani bir yoğunluk tepesine yakınsayana) kadar tekrarla.

![Mean Shift Hill Climbing](https://placehold.co/600x400/EEE/31343C?text=1.+Pencere+->+2.+Merkez+Hesapla+->+3.+Kaydır+->+Tekrarla)
*<center>Mean Shift'in çalışma prensibi: Her bir nokta, etrafındaki komşuluğun yoğunluk merkezine doğru kaydırılır ve bu işlem, yoğunluğun tepe noktasına ulaşana kadar tekrarlanır.</center>*

Bu işlem, `feature space`'teki tüm başlangıç noktaları için yapılır. Sonunda aynı tepe noktasına ulaşan tüm başlangıç noktaları, aynı `cluster`'a ait olarak kabul edilir.

## Mean Shift ile Clustering ve Segmentasyon

- **Attraction Basin (Çekim Havzası):** Aynı tepe noktasına (`mode`) ulaşan tüm başlangıç noktaları (pencere merkezleri), o tepenin "çekim havzasını" oluşturur.
- **Cluster:** Bir çekim havzasındaki tüm veri noktaları, tek bir `cluster` olarak kabul edilir.
- **Segmentation:** Son adımda, aynı `cluster`'a ait olan tüm `pixel`'ler aynı `segment` olarak etiketlenir.

![Mean Shift Segmentation Result](https://placehold.co/600x300/EEE/31343C?text=Orijinal+Görüntü+->+Mean+Shift+Segmentasyon)
*<center>Mean Shift segmentasyonunun tipik bir sonucu: Görüntü, algısal olarak anlamlı ve pürüzsüz sınırlara sahip bölgelere ayrılır.</center>*

## Mean Shift'in Artıları ve Eksileri

**Artıları:**
- **`K` Gerekmez:** `Cluster` sayısını önceden belirlemeye gerek yoktur; algoritma bunu veri yoğunluğuna göre otomatik olarak bulur.
- **Esnek `Cluster` Şekilleri:** K-Means gibi küresel `cluster`'lar varsaymaz; karmaşık ve keyfi şekilli `segment`'leri bulabilir.
- **Parametre Sayısı Az:** Ayarlanması gereken tek ana parametre pencere boyutudur (`window size`).

**Eksileri:**
- **Pencere Boyutu Seçimi:** Algoritmanın performansı, seçilen pencere boyutuna oldukça duyarlıdır. Bu boyut, bulunacak `segment`'lerin ölçeğini belirler.
- **Hesaplama Maliyeti:** Özellikle yüksek boyutlu `feature space`'lerde veya çok sayıda veri noktası olduğunda yavaş çalışabilir.
-   **Parametre Seçimi:** Algoritmanın performansı, `bandwidth` (`h`) parametresinin seçimine oldukça duyarlıdır. `h`'nin optimal değerini bulmak zor olabilir.
-   **Hesaplama Maliyeti:** Özellikle yüksek boyutlu `feature space`'lerde ve büyük `image`'lerde oldukça yavaş olabilir.

---

## Özet ve Anahtar Kavramlar

-   **Mean Shift:** `Feature space`'teki veri noktalarının yoğunluk fonksiyonunun tepe noktalarını (modlarını) bulmaya çalışan, parametrik olmayan bir `clustering` algoritmasıdır.
-   **Hill-Climbing:** Mean Shift'in temel çalışma prensibi, her bir veri noktasını iteratif olarak etrafındaki yoğunluğun daha yüksek olduğu bir bölgeye doğru kaydırarak tepeye tırmanmaktır.
-   **Bandwidth (h):** Her bir noktanın etrafında komşuluğun ne kadar büyük bir alanda dikkate alınacağını belirleyen kritik bir parametredir.
-   **Non-Parametric:** Mean Shift, K-Means'in aksine, `cluster` sayısını (`K`) önceden bilmeyi gerektirmez. Bulunan tepe sayısı, `cluster` sayısını otomatik olarak belirler.
-   **Feature Space:** K-Means'de olduğu gibi, segmentasyonun kalitesi `[R,G,B,x,y]` gibi `feature`'ların seçimine bağlıdır.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Mean Shift algoritmasının K-Means'e göre en temel avantajı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Segment (küme) sayısını (`K`) önceden bilmeyi gerektirmez.</div>
  <div class="quiz-option">B) Her zaman daha hızlı çalışır.</div>
  <div class="quiz-option">C) Daha az bellek kullanır.</div>
  <div class="quiz-option">D) Sadece gri seviye görüntülerde çalışır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> K-Means, kullanıcıdan `K` değerini bir hiperparametre olarak bekler. Mean Shift ise non-parametrik bir yöntemdir; veri noktalarının yoğun olduğu bölgeleri (modları) kendisi bulur. Sonuçta ortaya çıkan mod (yoğunluk tepesi) sayısı, segment sayısını doğal olarak belirler. Bu, segment sayısının bilinmediği durumlar için onu çok daha güçlü bir araç yapar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Mean Shift'teki `bandwidth` (veya `kernel size`, `h`) parametresinin rolü nedir? Bu parametreyi çok büyük seçersek ne olur?</p>
  <div class="quiz-option">A) Algoritmanın çalışma hızını belirler.</div>
  <div class="quiz-option">B) Görüntünün çözünürlüğünü ayarlar.</div>
  <div class="quiz-option" data-correct="true">C) Özellik uzayında ne kadar "yakındaki" noktaların ortalamaya dahil edileceğini belirler; çok büyük seçilirse birden fazla segmentin tek bir segment olarak birleşmesine neden olabilir.</div>
  <div class="quiz-option">D) Renk sayısını sınırlar.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `Bandwidth`, her bir noktanın "görüş alanını" tanımlar. Çok küçük bir `bandwidth`, her noktanın kendi başına bir mod oluşturmasına neden olarak aşırı segmentasyona (over-segmentation) yol açabilir. Çok büyük bir `bandwidth` ise, birbirinden farklı ve uzak modların bile tek bir büyük pencere içine düşmesine ve tek bir moda doğru kaymasına neden olur. Bu durum, "under-segmentation" olarak bilinir ve detayların kaybolmasına yol açar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Mean Shift algoritması, segmentasyon sonucunda elde edilen bölgelerin şekli hakkında nasıl bir varsayımda bulunur?</p>
  <div class="quiz-option">A) Bölgelerin her zaman dairesel olması gerektiğini varsayar.</div>
  <div class="quiz-option">B) Bölgelerin her zaman dışbükey (convex) olması gerektiğini varsayar.</div>
  <div class="quiz-option" data-correct="true">C) Bölgelerin şekli hakkında hiçbir varsayımda bulunmaz ve keyfi şekilli segmentler üretebilir.</div>
  <div class="quiz-option">D) Bölgelerin her zaman aynı boyutta olması gerektiğini varsayar.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> K-Means (özellik uzayında) küresel kümeler bulma eğilimindeyken, Mean Shift yoğunluk gradyanını takip ettiği için böyle bir kısıtlaması yoktur. Bu, algoritmanın veri dağılımına bağlı olarak oldukça karmaşık ve keyfi şekilli segmentler bulabilmesini sağlar. Bu, Mean Shift'in en güçlü yanlarından biridir.</p>
  </div>
</div>
