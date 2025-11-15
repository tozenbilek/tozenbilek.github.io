---
layout: default
title: RANSAC ile Model Uydurma
parent: 5. Feature Detection ve Matching
nav_order: 4
---

# RANSAC ile Hatalı Eşleşmeleri Ayıklama

SIFT gibi `feature matching` algoritmaları, `Ratio Test` gibi filtreler kullansa bile, elde edilen eşleşme setinde hala önemli miktarda hatalı eşleşme (`outlier`) bulunabilir. Bu `outlier`'lar, iki `image` arasındaki geometrik dönüşümü (örneğin, bir `homography` veya `fundamental matrix`) hesaplamaya çalıştığımızda sonucun tamamen yanlış çıkmasına neden olabilir.

**RANSAC (Random Sample Consensus)**, veri setindeki `outlier`'lara karşı oldukça dayanıklı bir şekilde bir matematiksel modele uyan verileri (`inlier`'ları) bulmak için kullanılan iteratif bir yöntemdir.

RANSAC'ın temel fikri oldukça basittir: Eğer verideki doğru noktaları (`inlier`'ları) tahmin edebilseydik, modeli kolayca bu noktalara uydurabilirdik. Bu yüzden RANSAC, rastgele bir şekilde veri noktalarından küçük alt kümeler seçer ve bu alt kümelerin "iyi" olduğunu varsayar.

![RANSAC Intuition](https://placehold.co/700x400/EEE/31343C?text=Tüm+veriye+uydurulan+yanlış+model+vs.+Doğru+model)
*<center>Solda: Tüm veri noktalarına (inlier+outlier) uydurulan hatalı çizgi. Sağda: RANSAC, rastgele seçtiği iki noktanın (inlier) oluşturduğu doğru çizgiyi ve bu çizgiyle uyumlu diğer inlier'ları bulur.</center>*

## RANSAC Algoritması

İki `image` arasındaki `homography` matrisini bulmak istediğimizi varsayalım. Bir `homography`'yi hesaplamak için en az 4 eşleşme noktası gerekir.

1.  **Hypothesize (Varsayımda Bulun):** Eşleşme setinden, modeli tahmin etmek için gereken minimum sayıda (`s`) noktayı rastgele seç. (Örneğin, bir `homography` için `s=4` nokta çifti).
2.  **Compute Model (Modeli Hesapla):** Seçilen `s` nokta ile modeli (`H` matrisi) hesapla.
3.  **Verify (Doğrula):** Geri kalan tüm eşleşmeleri al ve bu modele ne kadar uyduklarını bir hata metriği (`error metric`) ile ölç. (Örneğin, `reprojection error`). Hata, belirli bir `threshold`'un (`t`) altındaysa, o nokta bir `inlier` (destekçi) olarak kabul edilir.
4.  **Repeat (Tekrar Et):** Bu işlemi `N` defa tekrar et. En çok `inlier`'a sahip olan modeli "en iyi" model olarak sakla.
5.  **Refit (Yeniden Uydur):** En iyi modelin `inlier` setindeki **tüm** noktaları kullanarak modeli yeniden hesapla. Bu son adım, gürültüyü azaltır ve daha doğru bir sonuç verir.

![RANSAC Algorithm Steps](https://placehold.co/800x300/EEE/31343C?text=1.+Rastgele+Örneklem+Seç+->+2.+Model+Uydur+->+3.+Inlier'ları+Say)
*<center>RANSAC döngüsü: Rastgele bir alt küme seçilir, bir model uydurulur ve bu modelin kaç tane başka noktayı desteklediği (inlier) sayılır. Bu işlem, en çok desteği alan modeli bulana kadar tekrarlanır.</center>*

## RANSAC Parametreleri

-   **`N` (iterasyon sayısı):** En az bir kere "iyi" bir örneklem seçme olasılığımızı belirler.

`N` sayısını belirlemek için, `inlier` oranını (`w`) ve en az bir kere `s` noktanın tamamının `inlier` olma olasılığını (`p`, genellikle 0.99) bilirsek, şu formülü kullanabiliriz: `N = log(1-p) / log(1-wˢ)`

---

## Özet ve Anahtar Kavramlar

-   **Outlier:** Veri setinin genel trendine uymayan, hatalı bir veri noktasıdır. `Feature matching`'de, yanlış eşleşmelere karşılık gelir.
-   **Inlier:** Uydurmaya çalıştığımız modele iyi bir şekilde uyan, doğru bir veri noktasıdır.
-   **RANSAC (Random Sample Consensus):** `Outlier` içeren bir veri setinden, tekrarlamalı olarak rastgele örneklemler alarak bir modelin parametrelerini tahmin eden sağlam (robust) bir yöntemdir.
-   **Reprojection Error:** Bir `homography`'yi test ederken kullanılan yaygın bir hata metriğidir. İlk görüntüdeki bir noktanın, hesaplanan `H` matrisi ile ikinci görüntüye yansıtılmasıyla elde edilen konum ile, o noktanın gerçek eşleşmesinin konumu arasındaki mesafedir.
-   **Robust Estimation:** Bir tahmin yönteminin, veri setindeki `outlier`'lardan büyük ölçüde etkilenmemesi özelliğidir. RANSAC, `robust` bir tahmin yöntemidir.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> RANSAC'ın son adımında, bulunan en iyi `inlier` seti ile modeli neden yeniden uydururuz (`refit`)? Sadece o iterasyonda hesaplanan modeli kullanmak neden yeterli değildir?</summary>
  <p>Herhangi bir iterasyonda hesaplanan model, sadece minimum sayıda örneklem noktasına (örneğin `homography` için 4) dayanır. Bu örneklem noktaları `inlier` olsa bile, `pixel` konumlarındaki küçük gürültüler nedeniyle hesaplanan model en optimal model olmayabilir. En iyi `inlier` setini (belki de yüzlerce nokta) bulduktan sonra, bu çok daha büyük ve güvenilir veri seti üzerinden modeli yeniden hesaplamak, bu küçük gürültülerin etkisini ortalamasını alır ve çok daha doğru, daha kararlı bir nihai model elde edilmesini sağlar.</p>
</details>

<details>
  <summary><b>Soru 2:</b> RANSAC'ın başarısı için en kritik parametre nedir ve bu parametreyi yanlış ayarlamanın sonuçları ne olur?</summary>
  <p>En kritik parametre `inlier`/`outlier` ayrımını yapan `threshold`'dur (`t`). Bu `threshold` çok küçük ayarlanırsa, gürültü nedeniyle gerçek `inlier`'lar bile modelin dışında kalabilir ve RANSAC iyi bir `inlier` seti bulmakta zorlanır. Eğer çok büyük ayarlanırsa, bazı `outlier`'lar yanlışlıkla `inlier` olarak kabul edilebilir. Bu durum, algoritmanın tamamen yanlış bir model üzerinde uzlaşmasına (`consensus`) ve hatalı bir sonuç üretmesine neden olabilir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Bir veri setindeki `outlier` oranının %50'den çok daha fazla (örneğin %80) olduğu bir durumda RANSAC'ın performansı nasıl etkilenir? Neden?</summary>
  <p>RANSAC'ın performansı dramatik bir şekilde düşer. RANSAC'ın temel varsayımı, rastgele seçilen küçük bir örneklemin tamamının `inlier` olma ihtimalinin makul düzeyde olmasıdır. `Outlier` oranı %80 ise, örneğin bir `homography` için rastgele seçilen 4 noktanın tamamının `inlier` olma olasılığı (`0.2⁴ = 0.0016`) çok düşüktür. Bu durumda, sadece `inlier`'lardan oluşan "iyi" bir örneklem bulmak için gereken iterasyon sayısı (`N`) astronomik derecede artar ve algoritma pratik olarak uygulanamaz hale gelir.</p>
</details>
