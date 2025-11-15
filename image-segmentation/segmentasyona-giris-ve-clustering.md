---
layout: default
title: Segmentasyona Giriş ve Clustering
parent: Image Segmentation
nav_order: 1
---

# Segmentasyona Giriş ve Clustering

## Segmentasyon Nedir?

`Image segmentation`, bir `image`'in, `pixel`'lerin bir araya getirilerek anlamlı bölgelere ayrılması işlemidir. Amacımız, `image`'deki her `pixel`'e bir "etiket" atamaktır, öyle ki aynı etikete sahip `pixel`'ler belirli bir görsel özelliği (örneğin, aynı renk, aynı doku) paylaşsın.

![Image Segmentation Goal](https://via.placeholder.com/600x300.png?text=Orijinal+Görüntü+->+Anlamlı+Bölgeler+(Segmentler))
*<center>Segmentasyonun amacı, orijinal görüntüdeki her pikseli ait olduğu nesne veya bölgeye göre etiketlemektir.</center>*

Segmentasyon, bir `classification` problemi olarak görülebilir: Her `pixel` için, "Hangi segmente aitsin?" sorusunu cevaplamaya çalışırız.

## Clustering ile Segmentasyon

`Pixel`'leri segmentlere ayırmanın en sezgisel yollarından biri, onların özelliklerine (`features`) göre gruplamaktır. Bu bir **clustering** problemidir. Her `pixel`, bir `feature vector` ile temsil edilebilir. Örneğin:
-   **Renk:** `F = [R, G, B]`
-   **Gri Seviye:** `F = [Intensity]`
-   **Konum:** `F = [x, y]`

K-Means, bu `feature vector`'larını `K` adet `cluster`'a ayırmak için en popüler `clustering` algoritmalarından biridir.

![K-Means Clustering Steps](https://via.placeholder.com/800x300.png?text=1.+K+Merkez+Seç+->+2.+Noktaları+Ata+->+3.+Merkezleri+Güncelle+->+Tekrarla)
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

![K-Means with Different Feature Spaces](https://via.placeholder.com/800x400.png?text=Sadece+Renk+->+Renk+ve+Konum+Bilgisi)
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

<details>
  <summary><b>Soru 1:</b> K-Means `clustering`'i sadece `pixel`'lerin `(x, y)` konumlarını kullanarak bir görüntüye uygularsak, sonuçta nasıl segmentler elde ederiz?</summary>
  <p>Bu durumda algoritma, `pixel`'lerin renk veya `intensity` değerlerini tamamen göz ardı eder ve sadece birbirine geometrik olarak yakın olan `pixel`'leri aynı `cluster`'a atar. Sonuç olarak, görüntü, Voronoi diyagramına benzer şekilde, `K` adet kompakt, yuvarlak veya altıgen benzeri bölgeye ayrılır. Bu bölgelerin içindeki renkler tamamen heterojen olabilir.</p>
</details>

<details>
  <summary><b>Soru 2:</b> K-Means algoritmasının başlangıcında `cluster` merkezlerinin rastgele seçilmesinin potansiyel bir dezavantajı nedir? Bu dezavantajın üstesinden gelmek için ne gibi bir strateji izlenebilir?</summary>
  <p>Rastgele başlangıç, algoritmanın her çalıştırmada farklı sonuçlar vermesine ve bazen "kötü" bir lokal minimumda takılıp kalmasına neden olabilir. Örneğin, iki merkez de aynı `cluster`'ın içine düşerse, gerçek `cluster`'lardan birini tamamen kaçırabilir. Bu sorunu hafifletmek için en yaygın strateji, algoritmayı farklı rastgele başlangıç noktalarıyla birden çok kez (örneğin 10 defa) çalıştırmak ve en düşük toplam `intra-cluster` varyansa (`WCSS`) sahip olan sonucu en iyi sonuç olarak seçmektir. (Bu `K-Means++` başlatma yöntemiyle daha da iyileştirilebilir).</p>
</details>

<details>
  <summary><b>Soru 3:</b> `Feature space`'e `(x,y)` konum bilgisini eklediğimizde, `[R, G, B, x, y]` gibi bir vektör oluşur. Renk değerleri (0-255) ile konum değerleri (örn. 0-800) farklı aralıklardadır. Bu durum K-Means'in sonucunu nasıl etkiler ve bunu çözmek için ne yapmalıyız?</summary>
  <p>K-Means, Öklid mesafesine dayalıdır. Eğer `feature`'ların aralıkları çok farklıysa, daha büyük aralığa sahip olan `feature` (bu durumda `x,y` koordinatları), mesafe hesaplamasını domine eder. Yani algoritma, renk farklılıklarından çok `pixel`'lerin yakınlığına daha fazla önem verir. Bunu çözmek için, tüm `feature`'ları `clustering` işleminden önce normalize etmek standart bir adımdır. Örneğin, her bir `feature`'ı kendi standart sapmasına bölerek veya tüm değerleri 0-1 arasına ölçekleyerek her bir `feature`'ın mesafeye eşit derecede katkıda bulunması sağlanır.</p>
</details>
