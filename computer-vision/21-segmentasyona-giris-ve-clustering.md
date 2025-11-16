---
layout: default
title: Segmentasyona Giriş ve Kümeleme (Clustering)
nav_order: 21
parent: Computer Vision
---

# Görüntü Segmentasyonuna Giriş ve Kümeleme (Clustering)

Şimdiye kadar, görüntülerden kenarlar, köşeler ve SIFT gibi yerel özellikleri nasıl çıkaracağımızı öğrendik. **Image Segmentation (Görüntü Segmentasyonu)** ise daha global bir hedefe sahiptir: bir görüntüyü, piksellerin ait olduğu nesnelere veya bölgelere göre anlamlı gruplara ayırmak.

En temel tanımıyla segmentasyon, bir görüntünün her pikseline bir etiket atama işlemidir, öyle ki aynı etikete sahip pikseller belirli bir görsel özelliği (renk, doku vb.) paylaşırlar. Bu, "bu pikseller gökyüzüne ait", "bu pikseller ağaca ait" demek gibidir.

---

## 1. Segmentasyon Bir Kümeleme Problemidir

Segmentasyon problemini, pikselleri bir **feature space (özellik uzayında)** kümeleme problemi olarak düşünebiliriz. Her bir piksel, bu uzayda bir noktaya karşılık gelir.

**Özellik Uzayı Nedir?**
Bu, pikselleri tanımlamak için kullandığımız özelliklerden oluşan bir vektör uzayıdır. Bu uzayın seçimi, segmentasyonun sonucunu doğrudan etkiler:
*   **Renk Uzayı (örn: 3D RGB):** Her piksel `(R, G, B)` uzayında bir noktadır. Bu uzayda kümeleme yapmak, görüntüdeki tüm benzer renkteki pikselleri, konumlarından bağımsız olarak, aynı grupta toplar. *Örneğin, gökyüzü ve mavi bir araba aynı kümede olabilir.*
*   **Konum + Renk Uzayı (örn: 5D RGBXY):** Her piksel `(R, G, B, x, y)` uzayında bir noktadır. Bu uzayda kümeleme yapmak, sadece renkleri benzeyen **ve** görüntüde birbirine yakın olan pikselleri aynı grupta toplar. *Bu, gökyüzü ve mavi arabayı farklı segmentlere ayırır.*
*   **Doku Uzayı:** Daha ileri seviyede, her pikselin etrafındaki bölgenin dokusunu (pürüzlü, çizgili vb.) temsil eden bir özellik vektörü de kullanılabilir.

Bu özellik uzayında birbirine yakın olan pikseller, görsel olarak da birbirine benziyor demektir. Dolayısıyla, bu uzaydaki noktaları kümelere ayırmak, görüntüdeki anlamlı bölgeleri bulmakla eşdeğerdir.

---

## 2. k-means ile Segmentasyon

**k-means**, en bilinen ve en basit kümeleme algoritmalarından biridir. Amacı, `N` adet veri noktasını, önceden belirlenmiş `k` adet kümeye ayırmaktır.

**Algoritma Adımları:**
1.  **Başlatma:** `k` adet küme merkezini (`centroid`) özellik uzayında rastgele konumlara ata.
2.  **Atama (Assignment):** Her bir pikseli, kendisine en yakın olan küme merkezine ata. Bu, özellik uzayını `k` adet bölgeye ayırır.
3.  **Güncelleme (Update):** Her bir küme merkezini, o kümeye atanmış olan tüm piksellerin ortalama konumuna (veya rengine) taşı.
4.  **Tekrarlama:** Küme merkezlerinin konumu artık değişmeyene kadar (veya çok az değişene kadar) 2. ve 3. adımları tekrarla.

![k-means for Segmentation](https://via.placeholder.com/600x300.png?text=1.+Merkezleri+Başlat+->+2.+Pikselleri+Ata+->+3.+Merkezleri+Güncelle)
*Görsel: k-means algoritmasının iteratif süreci. Pikseller en yakın merkeze atanır, ardından merkezler kendilerine atanan piksellerin ortalamasına taşınır.*

Eğer özellik uzayı sadece renk ise, bu işlem görüntüdeki `k` ana rengi bulur ve her pikseli bu `k` renkten birine atayarak bir nevi "renk nicelemesi" (color quantization) yapar.

---

## 3. k-means Artıları ve Eksileri

**Artıları:**
*   Uygulaması ve anlaşılması çok basittir.
*   Büyük veri setlerinde bile oldukça verimli çalışır.

**Eksileri:**
*   **`k` Değerinin Belirlenmesi:** Küme sayısını (`k`) algoritmayı çalıştırmadan önce bilmeniz gerekir. Bu, birçok problem için pratik değildir.
*   **Başlangıç Değerlerine Hassasiyet:** Küme merkezlerinin ilk rastgele konumları, sonucun kalitesini önemli ölçüde etkileyebilir. Algoritma, global en iyi çözüm yerine yerel bir minimumda takılıp kalabilir. *(Pratik bir çözüm: algoritmayı farklı başlangıçlarla birkaç kez çalıştırıp en iyi sonucu almaktır.)*
*   **Aykırı Değerlere Hassasiyet:** Aykırı renk veya konumdaki tek bir piksel bile, küme merkezlerinin konumunu orantısız bir şekilde etkileyebilir.
*   **Küme Şekli Varsayımı:** k-means, doğal olarak küresel (yuvarlak) ve dışbükey şekilli kümeler bulma eğilimindedir. Uzun, ince veya iç içe geçmiş karmaşık şekilli kümeleri (örneğin bir halka içindeki bir daire) iyi bir şekilde modelleyemez.

Bu sınırlılıklardan dolayı, k-means basit `color quantization` (renk nicelemesi) gibi görevler için kullanışlı olsa da, daha karmaşık segmentasyon görevleri için bir sonraki bölümlerde göreceğimiz Mean-Shift veya Graf-tabanlı yöntemler gibi daha gelişmiş algoritmalara ihtiyaç duyulur.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> `Image segmentation`'ı bir `clustering` (kümeleme) problemi olarak ele aldığımızda, en basit durumda kümelenen "şey" nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntünün pikselleri.</div>
  <div class="quiz-option">B) Görüntüdeki kenarlar.</div>
  <div class="quiz-option">C) SIFT özellikleri.</div>
  <div class="quiz-option">D) Görüntünün tamamı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Segmentasyon, her pikseli bir gruba atama işlemidir. Bu nedenle, piksellerin kendisi, renk veya konum gibi özelliklerine göre kümelenir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdakilerden hangisi k-means algoritmasının en önemli zayıflıklarından biridir?</p>
  <div class="quiz-option">A) Yavaş çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Küme sayısını (`k`) önceden bilmeyi gerektirmesi.</div>
  <div class="quiz-option">C) Sadece gri tonlamalı görüntülerde çalışması.</div>
  <div class="quiz-option">D) Çok fazla bellek kullanması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> k-means'i kullanabilmek için, verinin kaç doğal kümeden oluştuğunu önceden tahmin edip algoritmayı bu `k` değeri ile başlatmanız gerekir. Bu değerin yanlış seçilmesi, kötü segmentasyon sonuçlarına yol açar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Piksel kümelemesi için kullanılan özellik uzayına, RGB renk değerlerine ek olarak piksellerin (x, y) konum bilgisi de dahil edilirse, segmentasyon sonucunda nasıl bir değişiklik olması beklenir?</p>
  <div class="quiz-option">A) Sonuç değişmez, sadece algoritma yavaşlar.</div>
  <div class="quiz-option">B) Sadece aynı renkteki pikseller aynı segmentte olur.</div>
  <div class="quiz-option" data-correct="true">C) Hem renkleri benzeyen hem de birbirine mekansal olarak yakın olan piksellerin aynı segmentte gruplanma eğilimi artar.</div>
  <div class="quiz-option">D) Görüntüdeki tüm pikseller tek bir segmentte toplanır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Özellik uzayına (x, y) koordinatlarını eklemek, pikseller arasındaki mesafeyi hesaplarken sadece renk farkını değil, aynı zamanda konum farkını da dikkate almasını sağlar. Bu, birbirinden uzakta duran ama aynı renge sahip iki bölgenin (örn: mavi gökyüzü ve mavi araba) farklı segmentlere ayrılmasına yardımcı olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> k-means algoritması, aşağıdaki segmentasyon görevlerinin hangisinde en çok zorlanır ve muhtemelen başarısız olur?</p>
  <div class="quiz-option" data-correct="true">A) Birbirine geçmiş iki adet "C" şeklindeki nesneyi ayırmak.</div>
  <div class="quiz-option">B) Kırmızı ve mavi bilyelerin olduğu bir fotoğrafta bilyeleri iki gruba ayırmak.</div>
  <div class="quiz-option">C) Bir manzarada gökyüzü, çimen ve deniz bölgelerini ayırmak.</div>
  <div class="quiz-option">D) Bir görüntüdeki 3 ana rengi bularak renk paletini basitleştirmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> k-means, küme merkezlerine olan uzaklığa göre çalıştığı için doğal olarak dışbükey (convex) ve küresel (spherical) kümeler bulmaya eğilimlidir. Birbirine geçmiş "C" gibi içbükey (non-convex) şekilleri doğru bir şekilde ayıramaz; muhtemelen her bir "C" şeklinin bir parçasını diğer kümeye dahil edecektir. Diğer seçenekler, k-means'in başarılı olabileceği, birbirinden renk veya özellik olarak net bir şekilde ayrılmış küme yapıları içerir.</p>
  </div>
</div>

