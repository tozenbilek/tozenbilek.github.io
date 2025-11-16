---
layout: default
title: Homography ve 2D Dönüşümler
nav_order: 14
parent: Computer Vision
---

# Homography ve 2D Görüntü Dönüşümleri

Bir görüntüyü döndürmek, yeniden boyutlandırmak, ötelemek veya perspektifini değiştirmek gibi işlemler, **2D geometrik dönüşümler** ile ifade edilir. Bu dönüşümler, homojen koordinatlar kullanılarak 3x3'lük matrislerle zarif bir şekilde temsil edilebilir. Bu matrislerin en geneline **Homography** denir.

---

## 1. 2D Dönüşüm Hiyerarşisi

Daha kısıtlıdan daha genele doğru sıralanan bir 2D dönüşüm hiyerarşisi vardır. Her dönüşüm, bir öncekinin tüm özelliklerini içerir ve üzerine yeni yetenekler ekler.

Tüm dönüşümler, bir `p' = H * p` matris çarpımıyla ifade edilir, burada `p` ve `p'` homojen koordinatlardaki orijinal ve dönüştürülmüş noktalardır, `H` ise dönüşüm matrisidir.

### a) Translation (Öteleme)
Sadece nesnenin konumunu değiştirir.
*   **Korunanlar:** Uzunluk, alan, açılar, paralellik.
*   **Matris:**
    ```
    [ 1  0  tx ]
    [ 0  1  ty ]
    [ 0  0  1  ]
    ```

### b) Euclidean (Rigidbody / Katı Cisim)
Öteleme ve döndürme (rotation) içerir. Nesneyi "bükmeden" veya "esnetmeden" hareket ettirir.
*   **Korunanlar:** Uzunluk, alan, açılar, paralellik.
*   **Matris:**
    ```
    [ cosθ  -sinθ  tx ]
    [ sinθ   cosθ  ty ]
    [ 0      0     1  ]
    ```

### c) Similarity (Benzerlik)
Öteleme, döndürme ve tek tip ölçekleme (uniform scaling) içerir. Nesnenin şeklini korur ama boyutunu değiştirebilir.
*   **Korunanlar:** Açılar, paralellik, uzunlukların ve alanların oranı.
*   **Matris:**
    ```
    [ s*cosθ  -s*sinθ  tx ]
    [ s*sinθ   s*cosθ  ty ]
    [ 0        0       1  ]
    ```

### d) Affine
Döndürme, ölçekleme (tek tip olmak zorunda değil), "shear" (eğme) ve öteleme içerir. Kareyi bir paralelkenara dönüştürebilir.
*   **Korunanlar:** Paralel çizgiler, alanların oranı.
*   **Matris:**
    ```
    [ a  b  tx ]
    [ c  d  ty ]
    [ 0  0  1  ]
    ```

### e) Projective (Homography)
En genel 2D doğrusal dönüşümdür. Kareyi herhangi bir dışbükey dörtgene dönüştürebilir. Gerçek dünyadaki bir düzlemin, farklı bir bakış açısından nasıl görüneceğini modeller.
*   **Korunanlar:** Sadece düz çizgilerin düz kalması.
*   **Matris:**
    ```
    [ a  b  c ]
    [ d  e  f ]
    [ g  h  1 ]
    ```

![2D Transformations](https://via.placeholder.com/800x250.png?text=Euclidean+->+Similarity+->+Affine+->+Projective)
*Görsel: Bir kareye uygulanan farklı dönüşüm türlerinin etkisi.*

---

## 2. Homography Matrisini Bulmak

Bir homography matrisi `H`, 8 serbestlik derecesine sahiptir (matrisin genel ölçeği önemli olmadığı için 9 elemandan biri 1'e sabitlenir). Bu 8 bilinmeyeni çözmek için, iki görüntü arasında en az **4 adet eşleşen noktaya (correspondence)** ihtiyaç duyarız. Her bir nokta eşleşmesi, bize 2 denklem verir. 4 nokta, 8 denklemlik bir sistem oluşturur ve bu sistem çözülerek `H` matrisi bulunur.

---

## 3. Homography Uygulamaları

### a) Görüntü Birleştirme (Panorama Stitching)
Eğer aynı yerden, sadece kamerayı döndürerek birden fazla fotoğraf çekerseniz, bu iki görüntü arasındaki ilişki bir homography ile tanımlanır. Bir görüntüyü diğerinin koordinat sistemine "warp" etmek (eğip bükmek) için bu homography matrisi kullanılır. Ardından iki görüntü birleştirilerek panoramik bir fotoğraf oluşturulur.

### b) Perspektif Düzeltme (Image Rectification)
Bir düzleme (örneğin bir bina cephesi, bir masa yüzeyi) yandan bir açıyla bakıldığında, perspektif bozulması oluşur. Görüntüdeki bu düzlemin 4 köşesini, hedef bir dikdörtgenin 4 köşesine eşleyen bir homography hesaplayarak, görüntüyü sanki tam karşıdan bakılıyormuş gibi "düzeltebiliriz".

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Paralel çizgilerin paralel kalmasını garantileyen, ancak açıları ve uzunlukları korumak zorunda olmayan en genel 2D dönüşüm hangisidir?</p>
  <div class="quiz-option">A) Euclidean</div>
  <div class="quiz-option">B) Similarity</div>
  <div class="quiz-option" data-correct="true">C) Affine</div>
  <div class="quiz-option">D) Projective (Homography)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Affine dönüşüm, paralel çizgileri koruma özelliğine sahiptir. Projective (Homography) dönüşüm ise bu kuralı bozar; paralel çizgiler bir ufuk noktasında birleşebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> İki farklı görüntü arasında bir Homography matrisini (`H`) hesaplamak için en az kaç tane eşleşen noktaya ihtiyaç vardır?</p>
  <div class="quiz-option">A) 2</div>
  <div class="quiz-option">B) 3</div>
  <div class="quiz-option" data-correct="true">C) 4</div>
  <div class="quiz-option">D) 8</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir Homography matrisi 8 serbestlik derecesine sahiptir. Her bir nokta eşleşmesi 2 denklem sağladığı için, bu 8 bilinmeyeni çözmek üzere en az 4 nokta eşleşmesine ihtiyaç duyarız (4 nokta x 2 denklem/nokta = 8 denklem).</p>
  </div>
</div>

