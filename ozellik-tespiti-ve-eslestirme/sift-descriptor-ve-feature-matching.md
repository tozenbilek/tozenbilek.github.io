---
layout: default
title: SIFT Descriptor ve Feature Matching
parent: 5. Feature Detection ve Matching
nav_order: 3
---

# SIFT Descriptor ve Feature Matching

`Scale-invariant` `keypoint`'leri bulduktan sonraki adım, bu `keypoint`'leri `image` `rotation`'ı ve aydınlatma değişiklikleri gibi diğer dönüşümlere karşı da dayanıklı olacak şekilde tanımlamaktır. Bu tanıma **descriptor** denir. Ardından, bu `descriptor`'ları kullanarak `image`'ler arasında eşleşmeler (`matches`) buluruz.

## Orientation Assignment (Yönelim Belirleme)

`Rotation invariance` sağlamak için, her `keypoint`'e `canonical` (standart) bir `orientation` (yönelim) atanır. Bu, `descriptor`'ın her zaman bu `orientation`'a göre hesaplanmasını sağlar.

1.  `Keypoint`'in `scale`'ine uygun bir `Gaussian` ile `smooth` edilmiş `image` bölgesi alınır.
2.  Bu bölgedeki her `pixel` için `gradient` `magnitude`'u ve `orientation`'ı hesaplanır.
3.  `Gradient` `orientation`'ları için bir `histogram` oluşturulur (genellikle 36 `bin`, her biri 10 derece). Her `pixel`'in `histogram`'a katkısı, `gradient` `magnitude`'u ile ağırlıklandırılır.
4.  `Histogram`'daki en yüksek tepe (peak), `keypoint`'in ana `orientation`'ı olarak belirlenir. Eğer başka bir tepe, en yüksek tepenin %80'inden daha büyükse, o `orientation` için de ayrı bir `keypoint` oluşturulur. Bu, aynı konum ve `scale`'de birden fazla `orientation`'a sahip stabil `feature`'ların (örneğin, dik bir `corner`'da) temsil edilmesini sağlar.

## SIFT Descriptor'ını Oluşturma

`Descriptor`, `keypoint`'in etrafındaki `local` `image` yapısını özetleyen bir vektördür.

1.  **Bölgeyi Normalize Etme:**
           - `Keypoint`'in `scale`'ine göre 16x16'lık bir `pixel` penceresi alınır.
           - Bu pencere, `keypoint`'in atanmış `orientation`'ına göre döndürülerek `rotation invariance` sağlanır.

2.  **`Gradient` `Histogram`'ları Oluşturma:**
           - 16x16'lık pencere, 4x4'lük `sub-region`'lara (her biri 4x4 `pixel`) bölünür.
           - Her bir `sub-region` için, `gradient` `orientation`'larını içeren 8 `bin`'lik bir `histogram` oluşturulur. Her `pixel`'in `histogram`'a katkısı, `gradient` `magnitude`'u ve `keypoint`'in merkezine olan uzaklığına göre `Gaussian` ağırlıklandırma ile belirlenir.
           - Toplamda 16 `sub-region` olduğu için, `4x4x8 = 128` elemanlı bir vektör elde edilir. Bu vektör, SIFT `descriptor`'ıdır.

3.  **`Descriptor`'ı Normalize Etme:**
           - `Descriptor` vektörü, `unit` (birim) uzunluğa normalize edilir. Bu, `image` parlaklığındaki (`intensity`) değişimlere karşı (örneğin, `image`'in aydınlanması veya kararması) dayanıklılık sağlar.
           - Parlaklığın doygunluğa ulaştığı (clipping) gibi `non-linear` aydınlatma etkilerini azaltmak için, vektördeki değerler belirli bir `threshold` (genellikle 0.2) ile sınırlandırılır ve vektör tekrar normalize edilir.

## Feature Matching (Özellik Eşleştirme)

İki `image`'den SIFT `descriptor`'ları çıkarıldıktan sonra, aralarındaki eşleşmeler bulunur.

- **En Yakın Komşu (Nearest Neighbor) Arama:** Bir `image`'deki her bir `descriptor` için, ikinci `image`'deki **tüm** `descriptor`'lar arasında Öklid (`Euclidean`) mesafesi en küçük olan `descriptor` bulunur.

- **Eşleşme Filtreleme (Ratio Test):** En yakın komşu (`1-NN`) her zaman doğru eşleşme olmayabilir. `Descriptor`'ın ayırt edici olup olmadığını anlamak için, en yakın komşuya olan mesafenin, ikinci en yakın komşuya (`2-NN`) olan mesafeye oranı kontrol edilir.

         `Mesafe(1-NN) / Mesafe(2-NN) < Threshold`

         Eğer bu oran belirli bir `threshold`'un (örneğin, 0.7 - 0.8) altındaysa, eşleşme kabul edilir. Bu, `descriptor`'ın gerçekten ayırt edici olduğunu ve en yakın komşusunun diğer tüm adaylardan önemli ölçüde daha iyi bir eşleşme olduğunu gösterir. Aksi takdirde, eşleşme belirsiz kabul edilir ve reddedilir. Bu basit ama etkili test, hatalı eşleşmelerin büyük bir kısmını eler.
