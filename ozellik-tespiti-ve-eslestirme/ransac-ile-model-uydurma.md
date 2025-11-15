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

<div class="quiz-question">
  <p><b>Soru 1:</b> RANSAC algoritmasının temel felsefesi nedir?</p>
  <div class="quiz-option">A) Tüm veri noktalarını kullanarak en düşük hatayı veren modeli bulmak.</div>
  <div class="quiz-option" data-correct="true">B) Veri içinde çok sayıda "outlier" (aykırı değer) olsa bile, "inlier" (uyumlu değerler) alt kümesini bularak güvenilir bir model tahmini yapmak.</div>
  <div class="quiz-option">C) Veri noktası sayısını azaltarak model uydurmayı hızlandırmak.</div>
  <div class="quiz-option">D) Veri setindeki gürültüyü temizlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> RANSAC, "outlier"ların model tahminini bozacağı varsayımı üzerine kuruludur. Bu nedenle, tüm veriyi kullanmak yerine, rastgele seçilen küçük alt kümelerle tekrar tekrar model tahminleri yapar ve en çok sayıda "inlier" tarafından desteklenen modeli en iyi model olarak kabul eder. Felsefesi, "outlier"ları göz ardı ederek verinin içindeki "sağlam" yapıyı ortaya çıkarmaktır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> RANSAC'ta, `inlier`/`outlier` ayrımı nasıl yapılır?</p>
  <div class="quiz-option">A) Veri noktalarının rengine bakılarak.</div>
  <div class="quiz-option">B) Veri noktalarının konumuna bakılarak (örneğin, görüntünün solunda mı sağında mı).</div>
  <div class="quiz-option" data-correct="true">C) Tahmin edilen modele olan uzaklıklarının önceden belirlenmiş bir eşik değerinden (`t`) küçük olup olmadığına bakılarak.</div>
  <div class="quiz-option">D) Veri noktalarının rastgele olarak etiketlenmesiyle.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Her iterasyonda, rastgele seçilen `s` adet noktayla bir model `M` tahmin edilir. Ardından, geri kalan tüm veri noktaları bu modele göre test edilir. Bir noktanın modele olan hatası (uzaklığı), belirlenen `t` eşiğinden küçükse o nokta bir `inlier` olarak kabul edilir, aksi takdirde `outlier` olarak işaretlenir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> RANSAC'ın başarılı olma olasılığını artırmak için, deneme sayısı (`N`) hangi faktörlere bağlı olarak ayarlanmalıdır?</p>
  <div class="quiz-option">A) Görüntünün çözünürlüğüne.</div>
  <div class="quiz-option">B) Modelin karmaşıklığına.</div>
  <div class="quiz-option" data-correct="true">C) Veri setindeki `inlier` oranına ve model için gereken minimum nokta sayısına.</div>
  <div class="quiz-option">D) Kullanılan bilgisayarın hızına.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Deneme sayısı `N`, en az bir denemede tamamen `inlier`'lardan oluşan bir alt küme seçme olasılığını istenen bir seviyeye (örneğin %99) çıkarmak için hesaplanır. Bu hesaplama, veri setindeki tahmini `inlier` oranına (`w`), model için gereken minimum nokta sayısına (`s`) ve istenen başarı olasılığına (`p`) doğrudan bağlıdır. `Inlier` oranı ne kadar düşükse, tamamen `inlier`'lardan oluşan bir grup çekme olasılığı o kadar düşük olacağı için `N`'nin o kadar yüksek olması gerekir.</p>
  </div>
</div>
