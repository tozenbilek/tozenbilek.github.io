---
layout: default
title: Camera Calibration
parent: 4. Camera Models ve Homography
nav_order: 4
---

# Camera Calibration

## Kamera Kalibrasyonu Nedir?

Kamera kalibrasyonu, bir kameranın kendine özgü parametrelerini tahmin etme işlemidir.

Bu işlem için, 3D uzaydaki konumlarını tam olarak bildiğimiz bir dizi nokta (örneğin bir dama tahtası deseni üzerindeki köşeler) ve bu noktaların 2D görüntü üzerindeki karşılık gelen `pixel` koordinatları kullanılır.

Bu bilinen 3D-2D eşleşmeleri, kameranın iç ve dış geometrisini tanımlayan parametreleri çözen bir optimizasyon algoritmasına verilir. Bu parametreleri bilmek, görüntüden metrik ölçümler yapmak ve 3D sahne yapısını anlamak gibi birçok `computer vision` uygulaması için kritik öneme sahiptir.

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Kamera kalibrasyonu sonucunda elde edilen "intrinsic" (içsel) parametreler aşağıdakilerden hangisini içerir?</p>
  <div class="quiz-option">A) Kameranın 3D dünyadaki konumu ve yönelimi.</div>
  <div class="quiz-option" data-correct="true">B) Kameranın odak uzaklığı (focal length) ve principal point'i.</div>
  <div class="quiz-option">C) Görüntünün çözünürlüğü ve dosya formatı.</div>
  <div class="quiz-option">D) Sahnedeki ışık kaynaklarının konumu.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> "Intrinsic" parametreler, kameranın kendi iç optik ve geometrik özelliklerini tanımlar. Bunlar, kameranın nasıl üretildiğine bağlıdır ve kamerayla birlikte hareket ederler. En önemlileri odak uzaklığı, principal point (optik eksenin görüntü düzlemini kestiği nokta) ve lens bozulma katsayılarıdır. Kameranın dünyadaki konumu ve yönelimi "extrinsic" (dışsal) parametrelerdir.</p>
  </div>
</div>
