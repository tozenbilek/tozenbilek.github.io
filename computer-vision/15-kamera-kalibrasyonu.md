---
layout: default
title: Kamera Kalibrasyonu (Camera Calibration)
nav_order: 15
parent: Computer Vision
---

# Kamera Kalibrasyonu (Camera Calibration)

Şimdiye kadar, bir kameranın 3D dünyayı 2D bir görüntüye nasıl yansıttığını idealize edilmiş bir Pinhole modeliyle anladık. Ancak gerçek dünyada, bir görüntüden hassas ölçümler yapabilmek (örneğin, bir nesnenin gerçek dünya boyutunu veya konumunu bulmak) için, kullandığımız kameranın kendi özelliklerini ve dünyaya göre konumunu tam olarak bilmemiz gerekir. **Kamera kalibrasyonu**, bu bilinmeyen parametreleri bulma işlemidir.

---

## 1. Kamera Parametreleri

Bir kameranın özelliklerini tanımlayan iki ana parametre grubu vardır:

### a) İçsel Parametreler (Intrinsic Parameters)
Bunlar, kameranın kendi iç yapısıyla ilgili, üretildiğinde sabit olan optik ve geometrik özelliklerdir. Genellikle **Kamera Matrisi (`K`)** adı verilen bir 3x3'lük matriste toplanırlar.

*   **Odak Uzaklığı (`fx`, `fy`):** Pinhole modelindeki `f` değerinin piksel cinsinden karşılığıdır. `fx` ve `fy`'nin farklı olabilmesinin nedeni, piksellerin tam olarak kare olmamasından kaynaklanabilir.
*   **Ana Nokta (`cx`, `cy`):** Optik eksenin (kameranın tam olarak "baktığı" yön) görüntü düzlemini kestiği noktanın piksel koordinatlarıdır. Genellikle görüntünün merkezine çok yakındır.
*   **Çarpıklık (Skew):** Görüntü sensörünün x ve y eksenlerinin tam olarak 90 derece olmadığı durumları modeller. Modern kameralarda genellikle sıfırdır.

Ayrıca, matrise dahil edilmeyen ama kalibrasyonla bulunan **Lens Bozulma (Distortion) Katsayıları** da vardır. Gerçek lensler, "balık gözü" (radyal bozulma) veya perspektif (teğetsel bozulma) gibi etkilere neden olabilir. Kalibrasyon, bu bozulmaları modelleyen katsayıları bularak görüntüleri "düzeltmemizi" sağlar.

### b) Dışsal Parametreler (Extrinsic Parameters)
Bunlar, kameranın dünya koordinat sistemine göre konumunu ve yönelimini tanımlar. Kameranın her hareketinde değişirler.
*   **Döndürme Matrisi (`R`):** 3x3'lük bir matris olup, kameranın eksenlerinin dünya eksenlerine göre nasıl döndüğünü belirtir.
*   **Öteleme Vektörü (`t`):** 3x1'lik bir vektör olup, dünya orijininin kamera orijinine göre nerede olduğunu belirtir.

Bu iki parametre `[R|t]` olarak birleştirilir ve kameranın "pozunu" (pose) tanımlar.

---

## 2. Kalibrasyon İşlemi

Bu parametreleri bulmak için standart yaklaşım, 3D yapısı çok iyi bilinen bir kalibrasyon nesnesi (genellikle bir **satranç tahtası**) kullanmaktır.

1.  Satranç tahtasının farklı açılardan ve konumlardan çok sayıda fotoğrafı çekilir.
2.  Her bir fotoğrafta, satranç tahtasının köşelerinin 2D piksel koordinatları otomatik olarak tespit edilir.
3.  Satranç tahtasının gerçek dünyadaki 3D köşe koordinatları bilindiği için (örneğin, her bir karenin 20mm x 20mm olduğu varsayılarak bir orijin noktasına göre hesaplanır), her görüntü için bir dizi **2D-3D nokta eşleşmesi** elde edilir.
4.  Bir optimizasyon algoritması (bilgisayar görüşü kütüphanelerinde mevcuttur), bu eşleşmeleri en iyi açıklayan içsel (`K` ve bozulma katsayıları) ve dışsal (`[R|t]`, her bir görüntü için ayrı) parametreleri bulur.

![Camera Calibration](https://via.placeholder.com/600x300.png?text=Satranç+Tahtası+Görüntüleri+->+2D-3D+Eşleşmeler+->+Kamera+Parametreleri)
*Görsel: Kamera kalibrasyon süreci.*

Kalibrasyon tamamlandığında, bir görüntüdeki herhangi bir pikselin, kameradan çıkan hangi 3D ışına karşılık geldiğini tam olarak bilebiliriz. Bu, 3D rekonstrüksiyon, ölçüm ve artırılmış gerçeklik gibi birçok ileri seviye uygulama için temel bir gerekliliktir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Aşağıdaki kamera parametrelerinden hangisi, kameranın dünyaya göre konumu değiştirildiğinde **değişmez**?</p>
  <div class="quiz-option">A) Döndürme Matrisi (R)</div>
  <div class="quiz-option">B) Öteleme Vektörü (t)</div>
  <div class="quiz-option" data-correct="true">C) Odak Uzaklığı (fx, fy)</div>
  <div class="quiz-option">D) Dışsal Parametreler (Extrinsics)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Odak uzaklığı, kameranın içsel (intrinsic) bir özelliğidir ve lensin yapısıyla ilgilidir. Kamerayı hareket ettirmek, onun dünyaya göre pozunu (dışsal parametreler) değiştirir, ancak lensin kendi özelliklerini değiştirmez.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Kamera kalibrasyonu sırasında neden bir satranç tahtası gibi bilinen bir desen kullanılır?</p>
  <div class="quiz-option">A) Siyah-beyaz olduğu için tespit etmesi kolaydır.</div>
  <div class="quiz-option" data-correct="true">B) Gerçek dünyadaki 3D noktalar ile görüntüdeki 2D pikseller arasında kesin eşleşmeler kurmayı sağlar.</div>
  <div class="quiz-option">C) Lens bozulmalarını en aza indirdiği için.</div>
  <div class="quiz-option">D) Sadece tek bir fotoğraf çekmenin yeterli olması için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kalibrasyon algoritmasının temel girdisi, 3D dünya koordinatları (`X,Y,Z`) ile bu noktaların görüntüdeki 2D piksel karşılıkları (`x,y`) arasındaki eşleşmelerdir. Satranç tahtası, köşeleri hem görüntüde kolayca bulunabilen hem de 3D'deki konumları hassas bir şekilde bilinen bir nesne olduğu için bu eşleşmeleri kurmayı kolaylaştırır.</p>
  </div>
</div>
