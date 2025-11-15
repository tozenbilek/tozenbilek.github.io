---
layout: default
title: RANSAC ile Model Uydurma
parent: 5. Feature Detection ve Matching
nav_order: 4
---

# RANSAC ile Hatalı Eşleşmeleri Ayıklama

SIFT gibi `feature matching` algoritmaları, `Ratio Test` gibi filtreler kullansa bile, elde edilen eşleşme setinde hala önemli miktarda hatalı eşleşme (`outlier`) bulunabilir. Bu `outlier`'lar, iki `image` arasındaki geometrik dönüşümü (örneğin, bir `homography` veya `fundamental matrix`) hesaplamaya çalıştığımızda sonucun tamamen yanlış çıkmasına neden olabilir.

**RANSAC (Random Sample Consensus)**, veri setindeki `outlier`'lara karşı oldukça dayanıklı bir şekilde bir matematiksel modele uyan verileri (`inlier`'ları) bulmak için kullanılan iteratif bir yöntemdir.

## RANSAC'ın Temel Fikri

RANSAC'ın arkasındaki ana fikir şudur: Eğer `outlier`'lardan arındırılmış "iyi" bir veri alt kümesi bulabilirsek, bu alt kümeyi kullanarak doğru modeli kolayca tahmin edebiliriz.

Algoritma, rastgele seçilen küçük veri alt kümeleriyle tekrar tekrar bir model oluşturur ve her seferinde hangi modelin verinin geneliyle en uyumlu olduğunu (yani en fazla `inlier`'a sahip olduğunu) kontrol eder.

## RANSAC Algoritması (Homography Örneği ile)

İki `image` arasındaki `homography` matrisini bulmak istediğimizi varsayalım. Bir `homography`'yi hesaplamak için en az 4 eşleşme noktası gerekir.

1.  **Örneklem (Sample):** Tüm SIFT eşleşmeleri arasından rastgele 4 adet eşleşme seçilir.
2.  **Modeli Hesapla (Fit):** Bu 4 eşleşme kullanılarak `Homography` matrisi `H` tam olarak hesaplanır.
3.  **Doğrulama (Verify):** Hesaplanan `H` matrisi, **tüm** eşleşme çiftleri üzerinde test edilir. Birinci `image`'deki bir noktayı `H` ile projekte ettiğimizde, ikinci `image`'deki eşleşme noktasına ne kadar yakın olduğuna bakılır. Eğer aradaki mesafe (`reprojection error`) belirli bir `threshold`'dan küçükse, bu eşleşme bir **`inlier`** (destekçi) olarak sayılır.
    `SSD(p_i', H * p_i) < threshold`
4.  **Skorlama:** Toplam `inlier` sayısı bu modelin skoru olur.
5.  **Tekrarlama:** 1-4 adımları önceden belirlenmiş sayıda (N defa) tekrarlanır.
6.  **Sonuç:** En yüksek `inlier` sayısına sahip olan model (en iyi `H` matrisi) seçilir. İsteğe bağlı olarak, bu en iyi modelin tüm `inlier`'ları kullanılarak `H` matrisi yeniden (ve daha hassas bir şekilde) hesaplanabilir.

## RANSAC'ın Avantajları

-   **`Outlier`'lara Karşı Dayanıklılık:** Veri setindeki `outlier` oranı çok yüksek olsa bile (%50'den fazla) iyi sonuçlar verebilir.
-   **Genellik:** Sadece `homography` için değil, çizgi bulma, düzlem bulma, `fundamental matrix` tahmini gibi birçok farklı model uydurma problemine uygulanabilir.
-   **Basitlik:** Parametrelerini (iterasyon sayısı, `inlier` `threshold`'u) seçmek genellikle sezgiseldir.

Bu yöntem sayesinde, SIFT ile elde edilen "ham" eşleşmeler güvenilir bir geometrik ilişkiye dönüştürülür ve bu da `image stitching` (panorama oluşturma), 3D rekonstrüksiyon ve nesne tanıma gibi birçok uygulamanın temelini oluşturur.
