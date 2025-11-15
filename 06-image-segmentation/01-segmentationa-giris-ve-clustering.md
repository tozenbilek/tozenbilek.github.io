---
layout: default
title: Segmentation'a Giriş ve Clustering
parent: 6. Image Segmentation
nav_order: 1
---

# Segmentation'a Giriş ve Clustering

`Image segmentation`'ın en sezgisel yollarından biri, benzer özelliklere sahip `pixel`'leri aynı grupta toplamaktır. Bu gruplama işlemi, `Unsupervised Machine Learning`'in temel konularından biri olan **clustering** ile gerçekleştirilebilir.

## Segmentation Problemini Clustering Olarak Düşünmek

Bir `image`'deki her `pixel`'i, bir veya daha fazla `feature`'a sahip bir veri noktası olarak düşünebiliriz. Bu `feature`'lar şunlar olabilir:
- **Intensity:** `Grayscale` bir `image` için `pixel`'in parlaklık değeri (1-boyutlu `feature space`).
- **Color:** Renkli bir `image` için `pixel`'in RGB veya L*a*b* gibi bir renk uzayındaki değerleri (3-boyutlu `feature space`).
- **Position:** `Pixel`'in `(x, y)` koordinatları (2-boyutlu `feature space`).
- **Texture:** `Pixel`'in etrafındaki bölgenin dokusal özellikleri (yüksek boyutlu `feature space`).

Amacımız, bu `feature space`'te birbirine yakın olan `pixel`'leri aynı `segment`'e atamaktır. Bu, tam olarak bir `clustering` problemidir.

## K-Means Clustering Algoritması

**K-means**, `feature space`'teki veri noktalarını önceden belirlenmiş `K` adet `cluster`'a bölmek için en yaygın kullanılan algoritmalardan biridir. Amacı, her noktanın kendi `cluster` merkezine olan uzaklıklarının kareleri toplamını (`Sum of Squared Distances - SSD`) minimize etmektir.

**Algoritma Adımları:**
1.  **Başlatma:** `K` adet `cluster` merkezi (`centroid`) rastgele seçilir. Bu `centroid`'ler, `feature space`'te birer noktadır (örneğin, `K` adet rastgele renk).
2.  **Atama (Assignment):** Her bir `pixel`, `feature space`'te kendisine en yakın olan `centroid`'in `cluster`'ına atanır.
3.  **Güncelleme (Update):** Her `cluster` için yeni `centroid`, o `cluster`'a atanmış olan tüm `pixel`'lerin `feature`'larının ortalaması alınarak yeniden hesaplanır.
4.  **Tekrarlama:** 2. ve 3. adımlar, `centroid`'lerin konumu artık değişmeyene veya çok az değişene kadar tekrarlanır.

**Örnek:** Sadece `intensity`'ye göre 3 `segment`'e ayırmak için, `K=3` seçilir. Algoritma, `image`'deki tüm `pixel` `intensity`'lerini en iyi temsil eden 3 ana `intensity` değerini (örneğin, "koyu gri", "orta gri", "açık gri") bulur ve her `pixel`'i bu üç gruptan birine atar.

## K-Means için Feature Space Seçenekleri

- **Color-based Segmentation:** `Feature space` olarak RGB renk değerleri kullanılır. `K-means`, `image`'deki `K` adet dominant rengi bulur ve `pixel`'leri bu renklere göre gruplar.
- **Color + Position-based Segmentation:** Bazen aynı renkteki `pixel`'lerin `image`'in farklı yerlerinde olmasını ve ayrı `segment`'ler oluşturmasını isteriz. Bu durumda `feature space`'i `(R, G, B, x, y)` gibi 5-boyutlu bir uzay olarak tanımlayabiliriz. Bu, sadece rengi değil, konumu da benzeyen `pixel`'lerin aynı `cluster`'da toplanmasını sağlar.

## K-Means'in Artıları ve Eksileri

**Artıları:**
- **Basitlik:** Anlaşılması ve uygulanması çok kolaydır.
- **Yakınsama:** Algoritmanın her zaman bir lokal minimuma yakınsayacağı garantiert.

**Eksileri:**
- **`K`'yı Belirleme:** `Cluster` sayısı `K`'nın önceden bilinmesi gerekir.
- **Başlatmaya Duyarlılık:** Farklı rastgele başlangıç `centroid`'leri, farklı sonuçlara yol açabilir.
- **`Cluster` Şekli:** Sadece "küresel" veya "dışbükey" (`convex`) şekilli `cluster`'ları iyi bulur. Uzun, ince veya karmaşık şekilli `segment`'leri bulmakta zorlanır.
- **`Outlier`'lara Duyarlılık:** Aykırı değerler, `centroid`'lerin ortalamasını bozarak `cluster`'ların yerini kaydırabilir.
