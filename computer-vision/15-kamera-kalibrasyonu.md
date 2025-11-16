---
layout: default
title: Camera Calibration (Kamera Kalibrasyonu)
nav_order: 15
parent: Computer Vision
---

# Camera Calibration (Kamera Kalibrasyonu)

Bir kamerayla çekilen görüntülerden hassas ölçümler yapabilmek (örneğin, bir nesnenin gerçek dünya boyutunu veya konumunu bulmak) için, kullandığımız kameranın belirli özelliklerini, yani **parametrelerini** bilmemiz gerekir. `Camera calibration` (Kamera kalibrasyonu), bu bilinmeyen parametreleri bulma işlemidir.

---

## Kalibrasyonun Temel Fikri

Slaytlarda da belirtildiği gibi, kamera kalibrasyonunun temel yöntemi oldukça basittir:

> Kamera parametrelerini tahmin etmek için, 3D uzaydaki konumu bilinen noktalar ve bu noktaların görüntüdeki 2D karşılıkları kullanılır.

Bu süreci gerçekleştirmek için genellikle 3D yapısı çok iyi bilinen bir kalibrasyon nesnesi (örneğin bir **satranç tahtası**) kullanılır.

1.  Satranç tahtasının farklı açılardan ve konumlardan çok sayıda fotoğrafı çekilir.
2.  Her bir fotoğrafta, satranç tahtasının köşelerinin 2D piksel koordinatları otomatik olarak tespit edilir.
3.  Satranç tahtasının her bir karesinin boyutu bilindiği için, köşelerin 3D'deki göreceli konumları da bilinmektedir. Bu sayede, her görüntü için bir dizi **2D-3D nokta eşleşmesi** elde edilir.
4.  Bir optimizasyon algoritması, bu eşleşmeleri kullanarak kameranın bilinmeyen içsel parametrelerini (lensin özellikleri vb.) ve her bir fotoğraf için dışsal pozunu (kameranın o anki konumu ve yönelimi) hesaplar.

![Camera Calibration](https://via.placeholder.com/600x300.png?text=Satranç+Tahtası+Görüntüleri+->+2D-3D+Eşleşmeler+->+Kamera+Parametreleri)
*Görsel: Kamera kalibrasyon süreci.*

Bu işlem tamamlandığında, bir görüntüdeki pikseller ile gerçek dünyadaki yönler arasında hassas bir ilişki kurulmuş olur. Bu da 3D rekonstrüksiyon ve ölçüm gibi birçok ileri seviye uygulama için temel bir gerekliliktir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir kamerayı kalibre etmenin temel amacı nedir?</p>
  <div class="quiz-option">A) Fotoğrafları daha güzel hale getirmek.</div>
  <div class="quiz-option">B) Kameranın pil ömrünü uzatmak.</div>
  <div class="quiz-option" data-correct="true">C) Görüntülerden hassas 3D ölçümler yapabilmek için kameranın bilinmeyen parametrelerini bulmak.</div>
  <div class="quiz-option">D) Kameranın hafıza kartını formatlamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kalibrasyon, 2D görüntü pikselleri ile 3D dünya arasındaki geometrik ilişkiyi tam olarak modellememizi sağlayan parametreleri bulma işlemidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Kamera kalibrasyonu sırasında neden bir satranç tahtası gibi bilinen bir desen kullanılır?</p>
  <div class="quiz-option">A) Siyah-beyaz olduğu için estetik görünür.</div>
  <div class="quiz-option" data-correct="true">B) Gerçek dünyadaki 3D noktalar ile görüntüdeki 2D pikseller arasında kesin eşleşmeler kurmayı sağlar.</div>
  <div class="quiz-option">C) Lensin kirlenmesini önler.</div>
  <div class="quiz-option">D) Sadece tek bir fotoğraf çekmenin yeterli olması için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kalibrasyon algoritmasının temel girdisi, 3D dünya koordinatları (`X,Y,Z`) ile bu noktaların görüntüdeki 2D piksel karşılıkları (`x,y`) arasındaki eşleşmelerdir. Satranç tahtası, bu eşleşmeleri hassas bir şekilde kurmayı kolaylaştırır.</p>
  </div>
</div>

