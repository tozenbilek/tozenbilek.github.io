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
