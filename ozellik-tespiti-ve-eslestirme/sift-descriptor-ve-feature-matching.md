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

Bu histogramdaki en yüksek tepe (peak), `keypoint`'in **ana yönünü (dominant orientation)** belirler. Bu ana yön, `descriptor` hesaplamasından önce `keypoint`'in koordinat sistemini "düzeltmek" için kullanılır. Bu sayede, `descriptor` rotasyona karşı değişmez hale gelir. Eğer ikinci bir tepe, birincinin %80'inden daha yüksekse, o yöne de sahip yeni bir `keypoint` oluşturulur.

![SIFT Orientation Assignment](https://placehold.co/600x400/EEE/31343C?text=Keypoint+Etrafında+Gradient+Yön+Histogramı)
*<center>Yön ataması: Keypoint etrafındaki piksellerin gradient yönleri bir histogramda toplanır ve en yüksek tepe, keypoint'in ana yönünü belirler.</center>*

## SIFT Descriptor'ını Oluşturma

`Descriptor`, `keypoint`'in etrafındaki `local` `image` yapısını özetleyen bir vektördür.

1.  **Bölgeyi Normalize Etme:**
           - `Keypoint`'in `scale`'ine göre 16x16'lık bir `pixel` penceresi alınır.
           - Bu pencere, `keypoint`'in atanmış `orientation`'ına göre döndürülerek `rotation invariance` sağlanır.

2.  **`Gradient` `Histogram`'ları Oluşturma:**
           - 16x16'lık pencere, 4x4'lük `sub-region`'lara (her biri 4x4 `pixel`) bölünür.
           - Her bir `sub-region` için, `gradient` `orientation`'larını içeren 8 `bin`'lik bir `histogram` oluşturulur. Her `pixel`'in `histogram`'a katkısı, `gradient` `magnitude`'u ve `keypoint`'in merkezine olan uzaklığına göre `Gaussian` ağırlıklandırma ile belirlenir.
           - Toplamda 16 `sub-region` olduğu için, `4x4x8 = 128` elemanlı bir vektör elde edilir. Bu vektör, SIFT `descriptor`'ıdır.

Bu 16 histogramın her birindeki 8'er değer art arda eklenerek `4x4x8 = 128` elemanlı bir **SIFT `descriptor` vektörü** oluşturulur. Bu vektör, `keypoint` etrafındaki lokal `gradient` bilgisinin zengin bir temsilidir. Vektör daha sonra aydınlatma değişimlerine karşı hassasiyeti azaltmak için normalize edilir.

![SIFT Descriptor Grid](https://placehold.co/600x450/EEE/31343C?text=16x16'lık+Bölge+->+4x4'lük+Grid+->+128-boyutlu+Vektör)
*<center>SIFT Descriptor: Keypoint etrafındaki 16x16'lık bölge, 4x4'lük bir grid'e ayrılır. Her bir hücre içinde 8 yönlü bir gradient histogramı oluşturulur. Bu 16 histogram birleştirilerek 128 boyutlu descriptor vektörü elde edilir.</center>*

3.  **`Descriptor`'ı Normalize Etme:**
           - `Descriptor` vektörü, `unit` (birim) uzunluğa normalize edilir. Bu, `image` parlaklığındaki (`intensity`) değişimlere karşı (örneğin, `image`'in aydınlanması veya kararması) dayanıklılık sağlar.
           - Parlaklığın doygunluğa ulaştığı (clipping) gibi `non-linear` aydınlatma etkilerini azaltmak için, vektördeki değerler belirli bir `threshold` (genellikle 0.2) ile sınırlandırılır ve vektör tekrar normalize edilir.

## Feature Matching (Özellik Eşleştirme)

İki `image`'den SIFT `descriptor`'ları çıkarıldıktan sonra, aralarındaki eşleşmeler bulunur.

- **En Yakın Komşu (Nearest Neighbor) Arama:** Bir `image`'deki her bir `descriptor` için, ikinci `image`'deki **tüm** `descriptor`'lar arasında Öklid (`Euclidean`) mesafesi en küçük olan `descriptor` bulunur.

- **Eşleşme Filtreleme (Ratio Test):** En yakın komşu (`1-NN`) her zaman doğru eşleşme olmayabilir. `Descriptor`'ın ayırt edici olup olmadığını anlamak için, en yakın komşuya olan mesafenin, ikinci en yakın komşuya (`2-NN`) olan mesafeye oranı kontrol edilir.

         `Mesafe(1-NN) / Mesafe(2-NN) < Threshold`

         Eğer bu oran belirli bir `threshold`'un (örneğin, 0.7 - 0.8) altındaysa, eşleşme kabul edilir. Bu, `descriptor`'ın gerçekten ayırt edici olduğunu ve en yakın komşusunun diğer tüm adaylardan önemli ölçüde daha iyi bir eşleşme olduğunu gösterir. Aksi takdirde, eşleşme belirsiz kabul edilir ve reddedilir. Bu basit ama etkili test, hatalı eşleşmelerin büyük bir kısmını eler.

Ancak en yakın komşu her zaman doğru eşleşme olmayabilir. İkinci en yakın komşu da neredeyse birinci kadar yakınsa, bu eşleşme belirsizdir ve muhtemelen yanlıştır.

**Ratio Test:** Bu belirsizliği çözmek için, birinci en yakın komşunun mesafesinin (`d1`), ikinci en yakın komşunun mesafesine (`d2`) oranı kontrol edilir.
`d1 / d2 < threshold` (Genellikle ~0.7-0.8)

Eğer bu oran belirlenen `threshold`'dan küçükse, eşleşme kabul edilir. Aksi halde, eşleşme belirsiz (`ambiguous`) kabul edilerek reddedilir. Bu basit test, hatalı eşleşmelerin büyük bir kısmını etkili bir şekilde eler.

![Feature Matching Ratio Test](https://placehold.co/800x350/EEE/31343C?text=Soldaki+Feature+->+Sağdaki+En+Yakın+1+(d1)+ve+2+(d2)+->+d1/d2<Threshold?)
*<center>Ratio Test: Görüntü 1'deki bir feature için, Görüntü 2'deki en yakın ve ikinci en yakın komşular bulunur. Eğer en yakın mesafe (d1), ikinci en yakın mesafeye (d2) göre anlamlı ölçüde daha küçükse, eşleşme kabul edilir.</center>*

---

## Özet ve Anahtar Kavramlar

-   **Orientation Assignment:** SIFT `descriptor`'ünü rotasyona karşı değişmez yapmak için, her `keypoint`'e etrafındaki `gradient` yönlerinin histogramına dayalı bir veya daha fazla "ana yön" atanması işlemidir.
-   **SIFT Descriptor:** Bir `keypoint` etrafındaki 16x16'lık `pixel` bölgesinin `gradient` bilgisini özetleyen 128 boyutlu bir vektördür. Bu `descriptor`, `keypoint`'in lokal görünümünü temsil eder ve eşleştirme için kullanılır.
-   **Feature Matching:** İki görüntüdeki `feature`'ların `descriptor` vektörleri arasındaki Öklid mesafesini hesaplayarak birbirine en çok benzeyen `feature` çiftlerini bulma işlemidir.
-   **Ratio Test:** Bir eşleşmenin güvenilirliğini artırmak için kullanılan bir tekniktir. En yakın komşunun mesafesinin, ikinci en yakın komşunun mesafesine oranını kontrol eder. Bu oran düşükse, eşleşme belirgindir ve kabul edilir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> SIFT `descriptor` vektörünün hesaplandıktan sonra birim uzunluğa normalize edilmesinin temel amacı nedir?</p>
  <div class="quiz-option">A) `Descriptor`'ün boyutunu küçülterek bellekte daha az yer kaplamasını sağlamak.</div>
  <div class="quiz-option">B) `Descriptor`'ü rotasyon değişimlerine karşı dayanıklı hale getirmek.</div>
  <div class="quiz-option" data-correct="true">C) Görüntüdeki parlaklık ve kontrast gibi aydınlatma değişimlerinin etkisini azaltmak.</div>
  <div class="quiz-option">D) `Descriptor`'ün sadece tam sayılardan oluşmasını sağlamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir görüntünün parlaklığı arttığında, piksellerin gradyan büyüklükleri de artar. Eğer `descriptor` bu ham gradyan değerlerini kullansaydı, aynı `feature`'ın parlak ve loş ışık altındaki `descriptor`'leri birbirinden çok farklı olurdu. Vektörü birim uzunluğa normalize etmek, gradyanların mutlak büyüklüklerini ortadan kaldırır ve sadece göreceli dağılımlarını korur. Bu, `descriptor`'ü aydınlatma değişimlerine karşı büyük ölçüde dayanıklı hale getirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> `Feature` eşleştirmede kullanılan "Lowe's ratio test" (`d₁ / d₂ < threshold`) neyi amaçlar?</p>
  <div class="quiz-option" data-correct="true">A) En iyi eşleşmenin, ikinci en iyi eşleşmeden belirgin bir şekilde daha iyi olduğu, ayırt edici ve güvenilir eşleşmeleri seçmeyi.</div>
  <div class="quiz-option">B) Sadece en yakın iki `feature`'ı eşleştirmeyi.</div>
  <div class="quiz-option">C) Eşleşme sürecini hızlandırmayı.</div>
  <div class="quiz-option">D) İki görüntü arasındaki `homography` matrisini hesaplamayı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Eğer bir `feature`'ın en yakın komşusuna olan uzaklığı (`d₁`), ikinci en yakın komşusuna olan uzaklığına (`d₂`) çok yakınsa, bu durum `feature`'ın ayırt edici olmadığını ve eşleşmenin belirsiz olduğunu gösterir. `Ratio test`, bu tür belirsiz (ve büyük olasılıkla yanlış) eşleşmeleri, en iyi eşleşmenin ikinci en iyiye göre "çok daha iyi" olmasını zorunlu kılarak eler. Bu, `outlier` sayısını azaltır ve eşleşme kalitesini artırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> İki görüntü arasında bulunan `feature` eşleşmeleri genellikle hem doğru (`inliers`) hem de yanlış (`outliers`) eşleşmeleri içerir. RANSAC gibi bir algoritmanın bu veri setindeki temel rolü nedir?</p>
  <div class="quiz-option">A) Tüm `outlier`'ları `inlier`'a dönüştürmek.</div>
  <div class="quiz-option">B) Eşleşme sayısını artırmak.</div>
  <div class="quiz-option" data-correct="true">C) `Outlier`'ların varlığına rağmen, `inlier`'lara en iyi uyan geometrik modeli (örneğin `homography`) tahmin etmek.</div>
  <div class="quiz-option">D) Sadece `inlier`'ları kullanarak görüntüleri birleştirmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> RANSAC, iteratif bir şekilde rastgele küçük alt kümeler seçerek model tahminleri yapar. Her iterasyonda, tahmin edilen modelin ne kadar `inlier` (modele uyan veri noktası) tarafından desteklendiğini sayar. Sonunda, en fazla `inlier` desteğine sahip olan modeli "doğru" model olarak kabul eder. Bu sayede, `outlier`'ların model tahminini bozmasını engeller ve veriye `robust` (dayanıklı) bir şekilde model uydurur.</p>
  </div>
</div>