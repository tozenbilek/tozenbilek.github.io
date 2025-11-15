---
layout: default
title: Segmentasyona Giriş ve Clustering
parent: Image Segmentation
nav_order: 1
---

# Segmentasyona Giriş ve Clustering

## Segmentasyon Nedir?

`Image segmentation`, bir `image`'in, `pixel`'lerin bir araya getirilerek anlamlı bölgelere ayrılması işlemidir. Amacımız, `image`'deki her `pixel`'e bir "etiket" atamaktır, öyle ki aynı etikete sahip `pixel`'ler belirli bir görsel özelliği (örneğin, aynı renk, aynı doku) paylaşsın.

![Image Segmentation Goal](https://placehold.co/600x300/EEE/31343C?text=Orijinal+Görüntü+->+Segmentler)
*<center>Segmentasyonun amacı, orijinal görüntüdeki her pikseli ait olduğu nesne veya bölgeye göre etiketlemektir.</center>*

Segmentasyon, bir `classification` problemi olarak görülebilir: Her `pixel` için, "Hangi segmente aitsin?" sorusunu cevaplamaya çalışırız.

## Clustering ile Segmentasyon

`Pixel`'leri segmentlere ayırmanın en sezgisel yollarından biri, onların özelliklerine (`features`) göre gruplamaktır. Bu bir **clustering** problemidir. Her `pixel`, bir `feature vector` ile temsil edilebilir. Örneğin:
-   **Renk:** `F = [R, G, B]`
-   **Gri Seviye:** `F = [Intensity]`
-   **Konum:** `F = [x, y]`

K-Means, bu `feature vector`'larını `K` adet `cluster`'a ayırmak için en popüler `clustering` algoritmalarından biridir.

![K-Means Clustering Steps](https://placehold.co/800x300/EEE/31343C?text=1.+K+Merkez+Seç+->+2.+Ata+->+3.+Güncelle+->+Tekrarla)
*<center>K-Means algoritmasının adımları: Rastgele merkezler seçilir, her nokta en yakın merkeze atanır, merkezler atanan noktaların ortalamasına taşınır ve bu işlem yakınsayana kadar tekrarlanır.</center>*

Algoritma adımları şunlardır:
1.  **Initialize (Başlatma):** `K` adet `cluster` merkezini (`μ₁`, `μ₂`, ..., `μₖ`) rastgele seç.
2.  **Assign (Atama):** Her bir veri noktasını (her `pixel`'i), kendisine en yakın olan `cluster` merkezine ata.
3.  **Update (Güncelleme):** Her bir `cluster`'ın merkezini, o `cluster`'a atanmış olan tüm noktaların ortalaması olarak yeniden hesapla.

Bu adımlar, `cluster` merkezleri artık değişmeyene kadar (veya çok az değişene kadar) tekrarlanır.

## K-Means'i Segmentasyon İçin Kullanma

Segmentasyon için `feature space`'i nasıl tanımladığımız, sonucun kalitesini doğrudan etkiler.
-   **Sadece Renk:** `F = [R, G, B]`. Bu yaklaşım, `image`'in farklı yerlerinde bulunsalar bile, renk olarak birbirine benzeyen tüm `pixel`'leri aynı `cluster`'da toplar.
-   **Renk + Konum:** `F = [R, G, B, x, y]`. Bu, hem renk olarak birbirine benzeyen hem de `image` üzerinde birbirine yakın olan `pixel`'leri bir araya getirmeye yardımcı olur.

![K-Means with Different Feature Spaces](https://placehold.co/800x400/EEE/31343C?text=Sadece+Renk+vs.+Renk+ve+Konum)
*<center>Solda: Sadece renk bilgisiyle yapılan segmentasyon, görüntüdeki farklı yerlerdeki benzer renkleri aynı grupta toplar (örneğin, gökyüzü ve su). Sağda: Renk ve konum bilgisi birlikte kullanıldığında, hem rengi benzeyen hem de birbirine yakın olan pikseller gruplanır ve daha anlamlı segmentler oluşur.</center>*

## K-Means'in Dezavantajları
-   **K'yı Belirleme:** `Cluster` sayısı olan `K`'yı önceden bilmemiz gerekir, bu her zaman kolay değildir.
-   **Başlatmaya Hassasiyet:** Başlangıç merkezlerinin seçimi, nihai sonucu etkileyebilir ve algoritma en iyi (`global optimum`) sonuç yerine `local optimum`'da takılabilir.
-   **Küresel (Spherical) Cluster Varsayımı:** K-Means, `cluster`'ların küresel ve benzer boyutlarda olduğunu varsayar. Uzun, ince veya karmaşık şekilli `cluster`'ları bulmakta zorlanır.
-   **Outlier'lara Hassasiyet:** Aykırı değerler, `cluster` merkezlerinin konumunu ciddi şekilde etkileyebilir.

---

## Özet ve Anahtar Kavramlar

-   **Image Segmentation:** Bir görüntüyü, `pixel`'lerin paylaştığı ortak özelliklere (renk, doku vb.) göre anlamlı ve bütüncül bölgelere ayırma işlemidir.
-   **Clustering:** Veri noktalarını, aralarındaki benzerliğe göre gruplara ayırma işlemidir. Segmentasyon, `pixel`'leri `feature`'larına göre `cluster`'lara ayırmak olarak görülebilir.
-   **Feature Space:** Her bir `pixel`'i temsil etmek için kullanılan özellikler kümesidir. Sadece renk (`R,G,B`) olabileceği gibi, renk ve konumu (`R,G,B,x,y`) birleştiren daha karmaşık bir uzay da olabilir.
-   **K-Means Algoritması:** Verilen `K` sayısı kadar `cluster` merkezi bularak veri noktalarını bu `cluster`'lara atayan, popüler ve basit bir `clustering` algoritmasıdır.
-   **K'nın Belirlenmesi:** K-Means'in en büyük zorluklarından biri, görüntüdeki `cluster` sayısını (`K`) önceden manuel olarak belirleme gerekliliğidir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Görüntü segmentasyonunun temel amacı nedir?</p>
  <div class="quiz-option">A) Görüntüdeki nesneleri tanımak ve etiketlemek.</div>
  <div class="quiz-option" data-correct="true">B) Bir görüntüyü, piksellerin benzer özelliklere sahip olduğu birden fazla anlamlı bölgeye ayırmak.</div>
  <div class="quiz-option">C) Görüntünün çözünürlüğünü artırmak.</div>
  <div class="quiz-option">D) Görüntüdeki gürültüyü temizlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Segmentasyon, her bir pikseli bir bölge etiketine atama işlemidir. Aynı etikete sahip pikseller, renk, doku veya yoğunluk gibi belirli özellikleri paylaşır. Amaç, görüntüyü daha anlamlı ve daha kolay analiz edilebilir bileşenlere ayırmaktır, bu da genellikle nesneleri veya nesne parçalarını temsil eden bölgelerle sonuçlanır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> K-Means clustering algoritmasında, `K` parametresinin rolü nedir?</p>
  <div class="quiz-option">A) Algoritmanın kaç iterasyonda çalışacağını belirler.</div>
  <div class="quiz-option">B) Küme merkezlerinin başlangıç konumlarını belirler.</div>
  <div class="quiz-option">C) Her bir kümenin maksimum boyutunu belirler.</div>
  <div class="quiz-option" data-correct="true">D) Görüntünün kaç farklı segmente (bölgeye) ayrılacağını önceden belirler.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> `K`, K-Means algoritmasının bulmaya çalışacağı küme (segment) sayısıdır. Bu, algoritmanın bir hiperparametresidir, yani kullanıcı tarafından önceden sağlanması gerekir. Algoritma, veriyi tam olarak `K` adet kümeye ayırmaya çalışır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> K-Means'in segmentasyon için kullanılmasının en büyük dezavantajlarından biri nedir?</p>
  <div class="quiz-option" data-correct="true">A) Piksellerin sadece renk/yoğunluk gibi özelliklerine baktığı için, uzamsal olarak (görüntü üzerinde) birbirinden çok uzak olan pikselleri aynı kümede toplayabilir.</div>
  <div class="quiz-option">B) Çok yavaş çalışması ve gerçek zamanlı uygulamalar için uygun olmaması.</div>
  <div class="quiz-option">C) Sadece siyah-beyaz görüntülerde çalışması.</div>
  <div class="quiz-option">D) Her zaman mükemmel segmentasyon sonuçları vermesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Standart K-Means, her pikseli sadece `feature` uzayındaki (örneğin RGB renk uzayı) konumuna göre değerlendirir. Görüntünün farklı köşelerindeki iki pikselin renkleri aynıysa, K-Means bu iki pikseli aynı segmente atayabilir. Bu durum, anlamsal olarak bütüncül olmayan, "benekli" segmentasyon sonuçlarına yol açabilir. Bu sorunu çözmek için genellikle pikselin `(x, y)` konumu da `feature` vektörüne eklenir.</p>
  </div>
</div>
