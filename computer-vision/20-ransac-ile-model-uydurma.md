---
layout: default
title: RANSAC ile Gürbüz Model Uydurma
nav_order: 20
parent: Computer Vision
---

# RANSAC: Hatalı Veri İçinden Model Çıkarma

SIFT ve Ratio Test gibi gelişmiş teknikler, iki görüntü arasında oldukça güvenilir bir özellik eşleşmesi seti üretir. Ancak, bu setin içinde bile neredeyse her zaman bir miktar **outlier (hatalı eşleşme)** bulunur. Bu hatalı eşleşmeler, verinin geri kalanına uymayan "aykırı" değerlerdir.

Eğer bu aykırı değerleri temizlemeden, tüm noktalara en iyi uyan geometrik modeli (örneğin bir Homography matrisi) standart yöntemlerle (örneğin, `Least Squares` - En Küçük Kareler) hesaplamaya çalışırsak, tek bir hatalı eşleşme bile sonucu tamamen bozabilir.

![Outlier Problem](https://via.placeholder.com/500x300.png?text=Hatalı+Eşleşme+Modeli+Bozar)
*Görsel: Veriye bir doğru uydurmaya çalışırken, tek bir `outlier` (aykırı nokta) bile en küçük kareler yönteminin sonucunu tamamen yanlış bir yöne çeker.*

Bu sorunu çözmek için, aykırı değerlere karşı son derece **robust (gürbüz)** olan **RANSAC (Random Sample Consensus)** algoritması kullanılır.

---

## 1. RANSAC'in Ana Fikri

RANSAC'in arkasındaki fikir şaşırtıcı derecede basittir ve bir oylama mekanizmasına dayanır:

> Veri setinin içindeki aykırı değerlerin oranı çok yüksek değilse, rastgele seçilen küçük bir alt kümenin, **tamamen `inliers` (doğru verilerden)** oluşma ihtimali vardır.

Eğer şans eseri tamamen "doğru" verilerden oluşan böyle bir alt küme seçebilirsek, bu küçük küme ile hesapladığımız model, tüm veri setindeki diğer "doğru" verilerle de tutarlı olacaktır. Algoritma, bu fikri defalarca deneyerek en tutarlı modeli bulmaya çalışır.

---

## 2. RANSAC Algoritması

RANSAC, iteratif bir şekilde çalışır:

1.  **Sample (Rastgele Örneklem Al):** Veri setinden, bir model hipotezi oluşturmak için gereken minimum sayıda (`s`) noktayı rastgele seç.
    *   Bir doğru bulmak için: `s=2` nokta.
    *   Bir Homography matrisi bulmak için: `s=4` özellik eşleşmesi.

2.  **Instantiate (Modeli Hesapla):** Sadece bu rastgele seçilen `s` adet noktayı kullanarak bir model parametresi hesapla. (Örn: 4 eşleşmeden bir `H` matrisi hesapla).

3.  **Consensus (Oylama / Test Et):** Hesaplanan bu modeli, veri setindeki **diğer tüm noktalarla** test et. Her bir noktanın modelle ne kadar uyumlu olduğunu bir hata metriği (örn: bir noktanın model tarafından tahmin edilen konumu ile gerçek konumu arasındaki mesafe) ile ölç. Hata, belirli bir eşik değerinden (`t`) küçükse, o noktayı **"inlier"** (uyumlu) olarak say. Bu adımdaki toplam inlier sayısını kaydet.

4.  **Tekrarla:** 1-3 arasındaki adımları önceden belirlenmiş sayıda (`N` kez) tekrarla.

5.  **En İyiyi Seç:** `N` denemenin sonunda, en fazla sayıda inlier bulan model hipotezi, en iyi model olarak kabul edilir.

6.  **Refit (Yeniden Hesapla):** Son olarak, en iyi modelin inlier olarak sınıflandırdığı tüm noktalar alınır ve bu "temiz" veri seti kullanılarak model parametreleri son bir kez, bu sefer daha hassas bir yöntemle (örneğin En Küçük Kareler) yeniden hesaplanır.

![RANSAC in Action](https://via.placeholder.com/600x350.png?text=1.+Rastgele+Seç+->+2.+Model+Hesapla+->+3.+Inlier'ları+Say)
*Görsel: RANSAC'in bir iterasyonu. Rastgele seçilen 4 eşleşme ile bir homography hesaplanır ve diğer tüm eşleşmelerin bu modele uyup uymadığı kontrol edilir.*

---

## 3. Parametreler, Avantajlar ve Dezavantajlar

### Ayarlanması Gereken Parametreler
*   **Hata Eşiği (`t`):** Bir noktanın ne zaman inlier sayılacağını belirler. Çok küçük seçilirse doğru noktalar dışlanabilir; çok büyük seçilirse hatalı noktalar modele dahil edilebilir.
*   **İterasyon Sayısı (`N`):** Şans eseri tamamen inlier'lardan oluşan bir örneklem seçme olasılığını artırmak için kaç deneme yapılacağı. Verideki outlier oranı arttıkça, gereken `N` de artar.

### Avantajlar
*   Veri setindeki outlier oranının çok yüksek olduğu durumlara karşı (%50'den fazla bile olsa) son derece dayanıklıdır.
*   Uygulaması nispeten basit ve geneldir; birçok farklı model uydurma problemine (doğru, daire, homography vb.) kolayca uyarlanabilir.

### Dezavantajlar
*   Rastgeleliğe dayalı olduğu için sonucun "kesinlikle doğru" olduğunu garanti etmez, sadece belirli bir olasılıkla iyi bir sonuç bulur.
*   Performansı, `t` ve `N` parametrelerinin doğru seçilmesine oldukça bağlıdır.
*   Veri setindeki inlier oranı çok düşükse, kabul edilebilir bir model bulmak için gereken iterasyon sayısı çok yüksek olabilir.

RANSAC, bu özellikleriyle görüntü birleştirme, 3D rekonstrüksiyon ve robotik gibi alanlarda vazgeçilmez bir araçtır.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> RANSAC algoritmasının, `Least Squares` (En Küçük Kareler) gibi standart model uydurma yöntemlerine göre en büyük avantajı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Veri setindeki çok sayıda `outliers` (hatalı eşleşmelere) karşı dayanıklı olması.</div>
  <div class="quiz-option">B) Her zaman matematiksel olarak en optimal çözümü bulması.</div>
  <div class="quiz-option">C) Daha az veriye ihtiyaç duyması.</div>
  <div class="quiz-option">D) Çok daha hızlı çalışması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> RANSAC'in temel tasarım amacı, büyük oranda aykırı değer içeren veri setlerinden bile anlamlı bir model çıkarabilmektir. En Küçük Kareler ise tek bir aykırı değerden bile ciddi şekilde etkilenebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntü birleştirme (stitching) probleminde, iki görüntü arasındaki Homography matrisini bulmak için RANSAC kullanıldığında, algoritmanın her bir iterasyonunun ilk adımında rastgele kaç adet özellik eşleşmesi seçilir?</p>
  <div class="quiz-option">A) 1</div>
  <div class="quiz-option">B) 2</div>
  <div class="quiz-option" data-correct="true">C) 4</div>
  <div class="quiz-option">D) 8</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir Homography matrisi 8 serbestlik derecesine sahiptir ve bunu çözmek için en az 4 nokta eşleşmesi gerekir. RANSAC, her iterasyonda bir model hipotezi oluşturmak için gereken minimum sayıda örneği seçer.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir RANSAC uygulamasında, bir noktanın `inlier` olarak kabul edilmesi için kullanılan hata eşiği (`threshold`) çok büyük bir değere ayarlanırsa, bunun en olası sonucu ne olur?</p>
  <div class="quiz-option">A) Algoritma hiç inlier bulamaz.</div>
  <div class="quiz-option">B) Algoritma çok daha yavaş çalışır.</div>
  <div class="quiz-option" data-correct="true">C) Hatalı eşleşmelerin (outliers) yanlışlıkla inlier olarak kabul edilmesi ve sonucun hatalı bir model olması.</div>
  <div class="quiz-option">D) Sadece mükemmel eşleşmeler inlier olarak kabul edilir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Hata eşiği, bir noktanın modele "ne kadar yakın" olması gerektiğini belirler. Bu eşik çok geniş tutulursa, modelle ilgisi olmayan hatalı noktalar bile "uyumlu" olarak kabul edilebilir. Bu durum, RANSAC'in en çok inlier'a sahip modeli seçme mantığı nedeniyle, tamamen hatalı bir modelin en iyi model olarak seçilmesine yol açabilir.</p>
  </div>
</div>

