---
layout: default
title: RANSAC ile Model Uydurma
nav_order: 20
parent: Computer Vision
---

# RANSAC ile Hatalı Eşleşmelerden Kurtulma

SIFT ve Ratio Test gibi gelişmiş teknikler, iki görüntü arasında oldukça güvenilir bir özellik eşleşmesi seti üretir. Ancak, bu setin içinde bile neredeyse her zaman bir miktar **hatalı eşleşme (outlier)** bulunur. Bu hatalı eşleşmeler, verinin geri kalanına uymayan "aykırı" değerlerdir.

Eğer bu aykırı değerleri temizlemeden, tüm noktalara en iyi uyan geometrik modeli (örneğin bir Homography matrisi) standart yöntemlerle (örneğin, En Küçük Kareler - Least Squares) hesaplamaya çalışırsak, tek bir hatalı eşleşme bile sonucu tamamen bozabilir.

![Outlier Problem](https://via.placeholder.com/500x300.png?text=Hatalı+Eşleşme+Modeli+Bozar)
*Görsel: Veriye bir doğru uydurmaya çalışırken, tek bir aykırı nokta (outlier) bile en küçük kareler yönteminin sonucunu tamamen yanlış bir yöne çeker.*

Bu sorunu çözmek için, aykırı değerlere karşı son derece dayanıklı olan **RANSAC (Random Sample Consensus)** algoritması kullanılır.

---

## 1. RANSAC'in Ana Fikri

RANSAC'in arkasındaki fikir şaşırtıcı derecede basittir ve bir oylama mekanizmasına dayanır:

> Veri setinin içindeki aykırı değerlerin oranı çok yüksek değilse, rastgele seçilen küçük bir alt kümenin, **tamamen doğru verilerden (inliers)** oluşma ihtimali vardır.

Eğer şans eseri tamamen "doğru" verilerden oluşan böyle bir alt küme seçebilirsek, bu küçük küme ile hesapladığımız model, tüm veri setindeki diğer "doğru" verilerle de tutarlı olacaktır. Algoritma, bu fikri defalarca deneyerek en tutarlı modeli bulmaya çalışır.

---

## 2. RANSAC Algoritması

RANSAC, iteratif bir şekilde çalışır:

1.  **Rastgele Örneklem Al (Sample):** Veri setinden, bir model hipotezi oluşturmak için gereken minimum sayıda noktayı rastgele seç.
    *   Bir doğru bulmak için: 2 nokta.
    *   Bir Homography matrisi bulmak için: 4 özellik eşleşmesi.

2.  **Modeli Hesapla (Instantiate):** Sadece bu rastgele seçilen küçük örneklemi kullanarak bir model parametresi hesapla. (Örn: 4 eşleşmeden bir `H` matrisi hesapla).

3.  **Oylama / Test Et (Consensus):** Hesaplanan bu modeli, veri setindeki **diğer tüm noktalarla** test et. Her bir noktanın, bu modele belirli bir hata payı (`threshold`) dahilinde uyup uymadığına bak. Modele uyan noktalara **"inliers"** (uyumlular) denir. Bu adımdaki inlier sayısını kaydet.

4.  **Tekrarla:** 1-3 arasındaki adımları önceden belirlenmiş sayıda (N kez) tekrarla.

5.  **En İyiyi Seç:** N denemenin sonunda, en fazla sayıda inlier bulan model hipotezi, en iyi model olarak kabul edilir.

6.  **Yeniden Hesapla (Refit):** Son olarak, en iyi modelin inlier olarak sınıflandırdığı tüm noktalar alınır ve bu "temiz" veri seti kullanılarak model parametreleri son bir kez, bu sefer daha hassas bir yöntemle (örneğin En Küçük Kareler) yeniden hesaplanır.

![RANSAC in Action](https://via.placeholder.com/600x350.png?text=1.+Rastgele+Seç+->+2.+Model+Hesapla+->+3.+Inlier'ları+Say)
*Görsel: RANSAC'in bir iterasyonu. Rastgele seçilen 4 eşleşme ile bir homography hesaplanır ve diğer tüm eşleşmelerin bu modele uyup uymadığı kontrol edilir.*

RANSAC, aykırı değerlerin oranı %50'den fazla olsa bile şaşırtıcı derecede iyi çalışan, basit, genel ve çok güçlü bir algoritmadır. Görüntü birleştirme, 3D rekonstrüksiyon ve robotik gibi alanlarda vazgeçilmez bir araçtır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> RANSAC algoritmasının, En Küçük Kareler (Least Squares) gibi standart model uydurma yöntemlerine göre en büyük avantajı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Veri setindeki çok sayıda hatalı eşleşmeye (outliers) karşı dayanıklı olması.</div>
  <div class="quiz-option">B) Her zaman matematiksel olarak en optimal çözümü bulması.</div>
  <div class="quiz-option">C) Daha az veriye ihtiyaç duyması.</div>
  <div class="quiz-option">D) Çok daha hızlı çalışması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> RANSAC'in temel tasarım amacı, büyük oranda aykırı değer içeren veri setlerinden bile anlamlı bir model çıkarabilmektir. En Küçük Kareler ise tek bir aykırı değerden bile ciddi şekilde etkilenebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir görüntü birleştirme (stitching) probleminde, iki görüntü arasındaki Homography matrisini bulmak için RANSAC kullanıldığında, algoritmanın her bir iterasyonunun ilk adımında rastgele kaç adet özellik eşleşmesi seçilir?</p>
  <div class="quiz-option">A) 1</div>
  <div class="quiz-option">B) 2</div>
  <div class="quiz-option" data-correct="true">C) 4</div>
  <div class="quiz-option">D) 8</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir Homography matrisi 8 serbestlik derecesine sahiptir ve bunu çözmek için en az 4 nokta eşleşmesi gerekir. RANSAC, her iterasyonda bir model hipotezi oluşturmak için gereken minimum sayıda örneği seçer.</p>
  </div>
</div>
