---
layout: default
title: Segmentasyona Giriş ve Clustering
nav_order: 21
parent: Computer Vision
---

# Görüntü Segmentasyonu: Giriş ve Clustering

Şimdiye kadar, görüntülerden kenarlar, köşeler ve SIFT gibi yerel özellikleri nasıl çıkaracağımızı öğrendik. **Görüntü Segmentasyonu** ise daha global bir hedefe sahiptir: bir görüntüyü, piksellerin ait olduğu nesnelere veya bölgelere göre anlamlı gruplara ayırmak.

En temel tanımıyla segmentasyon, bir görüntünün her pikseline bir etiket atama işlemidir, öyle ki aynı etikete sahip pikseller belirli bir görsel özelliği (renk, doku vb.) paylaşırlar. Bu, "bu pikseller gökyüzüne ait", "bu pikseller ağaca ait" demek gibidir.

---

## 1. Segmentasyon Bir Kümeleme (Clustering) Problemidir

Segmentasyon problemini, pikselleri bir **özellik uzayında (feature space)** kümeleme problemi olarak düşünebiliriz. Her bir piksel, bu uzayda bir noktaya karşılık gelir.

**Özellik Uzayı Nedir?**
Bu, pikselleri tanımlamak için kullandığımız özelliklerden oluşan bir vektör uzayıdır. Bu uzay şunları içerebilir:
*   **Renk (RGB):** Her piksel, 3 boyutlu bir `(R, G, B)` uzayında bir noktadır.
*   **Parlaklık (Intensity):** Gri tonlamalı bir görüntü için, her piksel 1 boyutlu bir uzayda bir noktadır.
*   **Konum (Position):** Piksellerin sadece renkleri değil, aynı zamanda görüntüdeki `(x, y)` koordinatları da özellik olarak eklenebilir. Bu, birbirine yakın ve benzer renkteki piksellerin aynı grupta olmasını teşvik eder.
*   **Doku (Texture):** Daha ileri seviyede, her pikselin etrafındaki bölgenin dokusunu (pürüzlü, çizgili vb.) temsil eden bir özellik vektörü de kullanılabilir.

Bu özellik uzayında birbirine yakın olan pikseller, görsel olarak da birbirine benziyor demektir. Dolayısıyla, bu uzaydaki noktaları kümelere ayırmak, görüntüdeki anlamlı bölgeleri bulmakla eşdeğerdir.

---

## 2. k-means ile Segmentasyon

**k-means**, en bilinen ve en basit kümeleme algoritmalarından biridir. Amacı, `N` adet veri noktasını, önceden belirlenmiş `k` adet kümeye ayırmaktır.

**Algoritma Adımları:**
1.  **Başlatma:** `k` adet küme merkezini (centroid) özellik uzayında rastgele konumlara ata.
2.  **Atama (Assignment):** Her bir pikseli, kendisine en yakın olan küme merkezine ata. Bu, özellik uzayını `k` adet bölgeye ayırır.
3.  **Güncelleme (Update):** Her bir küme merkezini, o kümeye atanmış olan tüm piksellerin ortalama konumuna (veya rengine) taşı.
4.  **Tekrarlama:** Küme merkezlerinin konumu artık değişmeyene kadar (veya çok az değişene kadar) 2. ve 3. adımları tekrarla.

![k-means for Segmentation](https://via.placeholder.com/600x300.png?text=1.+Merkezleri+Başlat+->+2.+Pikselleri+Ata+->+3.+Merkezleri+Güncelle)
*Görsel: k-means algoritmasının iteratif süreci. Pikseller en yakın merkeze atanır, ardından merkezler kendilerine atanan piksellerin ortalamasına taşınır.*

Sonuç olarak, görüntüdeki `k` ana renk bulunur ve her piksel bu `k` renkten birine atanarak görüntü segmente edilmiş olur.

---

## 3. k-means'in Artıları ve Eksileri

**Artıları:**
*   Uygulaması ve anlaşılması çok basittir.
*   Büyük veri setlerinde bile oldukça verimli çalışır.

**Eksileri:**
*   **`k` Değerinin Belirlenmesi:** Küme sayısını (`k`) algoritmayı çalıştırmadan önce bilmeniz gerekir. Bu, birçok problem için pratik değildir.
*   **Başlangıç Değerlerine Hassasiyet:** Küme merkezlerinin ilk rastgele konumları, sonucun kalitesini önemli ölçüde etkileyebilir. Algoritma, global en iyi çözüm yerine yerel bir minimumda takılıp kalabilir.
*   **Aykırı Değerlere Hassasiyet:** Aykırı değerler (outliers), küme merkezlerinin konumunu orantısız bir şekilde etkileyebilir.
*   **Küme Şekli Varsayımı:** k-means, doğal olarak küresel (yuvarlak) şekilli ve benzer boyutlarda kümeler bulma eğilimindedir. Uzun, ince veya karmaşık şekilli kümeleri iyi bir şekilde modelleyemez.

Bu sınırlılıklardan dolayı, k-means basit renk nicelemesi (color quantization) gibi görevler için kullanışlı olsa da, daha karmaşık segmentasyon görevleri için bir sonraki bölümlerde göreceğimiz Mean-Shift veya Graf-tabanlı yöntemler gibi daha gelişmiş algoritmalara ihtiyaç duyulur.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Görüntü segmentasyonunu bir kümeleme (clustering) problemi olarak ele aldığımızda, en basit durumda kümelenen "şey" nedir?</p>
  <div class="quiz-option" data-correct="true">A) Görüntünün pikselleri.</div>
  <div class="quiz-option">B) Görüntüdeki kenarlar.</div>
  <div class="quiz-option">C) SIFT özellikleri.</div>
  <div class="quiz-option">D) Görüntünün tamamı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Segmentasyon, her pikseli bir gruba atama işlemidir. Bu nedenle, piksellerin kendisi, renk veya konum gibi özelliklerine göre kümelenir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Aşağıdakilerden hangisi k-means algoritmasının en önemli zayıflıklarından biridir?</p>
  <div class="quiz-option">A) Yavaş çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Küme sayısını (`k`) önceden bilmeyi gerektirmesi.</div>
  <div class="quiz-option">C) Sadece gri tonlamalı görüntülerde çalışması.</div>
  <div class="quiz-option">D) Çok fazla bellek kullanması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> k-means'i kullanabilmek için, verinin kaç doğal kümeden oluştuğunu önceden tahmin edip algoritmayı bu `k` değeri ile başlatmanız gerekir. Bu değerin yanlış seçilmesi, kötü segmentasyon sonuçlarına yol açar.</p>
  </div>
</div>

