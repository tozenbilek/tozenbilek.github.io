---
layout: default
title: Mean Shift Segmentation
parent: 6. Image Segmentation
nav_order: 2
---

# Mean Shift Segmentation

K-Means'in bazı dezavantajlarına (K'yı belirleme, küresel cluster varsayımı) bir alternatif olarak **Mean Shift** algoritması geliştirilmiştir. Mean Shift, `feature space`'teki veri yoğunluğunun tepe noktalarını (modlarını veya yerel maksimumlarını) bulmaya çalışan bir yöntemdir. Her bir tepe noktası, bir `cluster`'ın merkezini temsil eder.

## Algoritmanın Çalışma Prensibi

Mean Shift'in temel fikri oldukça sezgiseldir:
1.  **Başlatma:** `Feature space`'teki her bir veri noktası (pixel) için bir pencere (`window`) başlatılır.
2.  **Kaydırma (Shifting):** Her bir pencere için, pencerenin içindeki noktaların "kütle merkezi" (center of mass) veya ortalaması (`mean`) hesaplanır.
3.  **Güncelleme:** Pencerenin merkezi, bir önceki adımda hesaplanan bu yeni kütle merkezine kaydırılır.
4.  **Yakınsama:** 2. ve 3. adımlar, pencerenin konumu artık değişmeyene kadar (yani bir yoğunluk tepesine ulaşana kadar) tekrarlanır.

Bu süreç, her bir başlangıç noktasını `feature space`'te yokuş yukarı, en yakın yoğunluk tepesine doğru hareket ettirir.

## Clustering ve Segmentation

- **Attraction Basin (Çekim Havzası):** Aynı tepe noktasına (`mode`) ulaşan tüm başlangıç noktaları (pencere merkezleri), o tepenin "çekim havzasını" oluşturur.
- **Cluster:** Bir çekim havzasındaki tüm veri noktaları, tek bir `cluster` olarak kabul edilir.
- **Segmentation:** Son adımda, aynı `cluster`'a ait olan tüm `pixel`'ler aynı `segment` olarak etiketlenir.

## Mean Shift'in Artıları ve Eksileri

**Artıları:**
- **`K` Gerekmez:** `Cluster` sayısını önceden belirlemeye gerek yoktur; algoritma bunu veri yoğunluğuna göre otomatik olarak bulur.
- **Esnek `Cluster` Şekilleri:** K-Means gibi küresel `cluster`'lar varsaymaz; karmaşık ve keyfi şekilli `segment`'leri bulabilir.
- **Parametre Sayısı Az:** Ayarlanması gereken tek ana parametre pencere boyutudur (`window size`).

**Eksileri:**
- **Pencere Boyutu Seçimi:** Algoritmanın performansı, seçilen pencere boyutuna oldukça duyarlıdır. Bu boyut, bulunacak `segment`'lerin ölçeğini belirler.
- **Hesaplama Maliyeti:** Özellikle yüksek boyutlu `feature space`'lerde veya çok sayıda veri noktası olduğunda yavaş çalışabilir.
