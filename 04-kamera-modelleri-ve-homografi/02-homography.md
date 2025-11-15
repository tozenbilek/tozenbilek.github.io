---
layout: default
title: Homography
parent: 4. Kamera Modelleri ve Homografi
nav_order: 2
---

# Homography

**Homography**, aynı 3D düzlemin iki farklı `image`'deki (veya `projection`'daki) görünümü arasındaki ilişkiyi tanımlayan bir `projective` dönüşümdür. Bu dönüşüm, 3x3'lük bir matris ile temsil edilir ve `image`'ler arasında `pixel` koordinatlarını dönüştürmek için kullanılır.

## Adım 1 – Homography'nin Ne Olduğunu Anla

Bir `homography` (`H`), bir `image`'deki `homogeneous` koordinatlara sahip bir `p = (x, y, 1)` noktasını, başka bir `image`'deki karşılık gelen noktası olan `p' = (x', y', 1)`'e eşler.

`p' = H * p`

\[
\begin{bmatrix}
x'w \\
y'w \\
w
\end{bmatrix}
=
\begin{bmatrix}
h_{11} & h_{12} & h_{13} \\
h_{21} & h_{22} & h_{23} \\
h_{31} & h_{32} & h_{33}
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
\]

`Homography` matrisinin 8 serbestlik derecesi (`degrees of freedom`) vardır, çünkü matris bir skaler faktörle çarpımsal olarak tanımlıdır (genellikle `h₃₃ = 1` olarak ayarlanır).

## Adım 2 – Homography'nin Geçerli Olduğu Durumlar

Bir `homography` dönüşümü, iki `image` arasında yalnızca iki özel durumda geçerlidir:

1.  **Düzlemsel Sahne (Planar Scene):** `Camera` hareket etse bile, sahnedeki tüm noktalar aynı düzlem üzerinde ise (örneğin, bir duvarın, bir masanın veya bir kağıdın fotoğrafını çekmek).
2.  **Dönen Kamera (Rotating Camera):** `Camera`'nın `center of projection`'ı sabit kalacak şekilde sadece döndürüldüğü durumlar. Bu durumda, sahnenin 3D yapısı önemli değildir; `image`'ler sanki sonsuzdaki bir düzlemin farklı görünümleriymiş gibi ilişkilendirilebilir. `Panorama` ve `image stitching` uygulamaları bu prensibe dayanır.

## Adım 3 – Homography Matrisini Hesaplama (DLT Algoritması)

`H` matrisini bulmak için iki `image` arasında en az **4 adet karşılıklı nokta (point correspondence)** bilinmesi gerekir. Daha fazla nokta kullanmak, `noise`'a karşı daha sağlam sonuçlar verir. `Direct Linear Transformation (DLT)` algoritması, bu matrisi hesaplamak için yaygın olarak kullanılır.

- Her bir `(p, p')` nokta çifti, `H`'nin elemanları için iki lineer denklem üretir.
- 4 nokta çifti, 8 denklemden oluşan bir sistem oluşturur (`Ah = 0`).
- Bu denklem sistemi, `Singular Value Decomposition (SVD)` gibi yöntemlerle çözülerek `H`'nin 8 bilinmeyen elemanı bulunur.

## Adım 4 – Homography'nin Uygulama Alanları

1.  **Image Stitching (Panorama Oluşturma):**
    - `Camera`'yı döndürerek birden fazla `image` çekilir.
    - `Image`'ler arasındaki karşılıklı noktalar (genellikle `SIFT`, `SURF` veya `ORB` gibi `feature`'lar kullanılarak) bulunur.
    - Bu noktalardan `homography` matrisi hesaplanır.
    - Bir `image`, `inverse warping` tekniği kullanılarak diğer `image`'in `projection` düzlemine "sarılır" (warp edilir).
    - `Warp` edilmiş `image`'ler üst üste bindirilerek ve kenarları yumuşatılarak (`blending`) tek bir `panorama` `image`'i oluşturulur.

2.  **Image Rectification (Görüntü Düzeltme):**
    - Perspektif nedeniyle yamuk görünen düzlemsel bir nesnenin (örneğin, eğik çekilmiş bir tablo) `image`'i, sanki tam karşıdan çekilmiş gibi düzeltilebilir.
    - `Image`'deki dört köşe noktası, hedeflenen dikdörtgenin köşe noktalarına eşlenerek `homography` hesaplanır ve `image` bu dönüşüme göre `warp` edilir.

3.  **Augmented Reality (Artırılmış Gerçeklik):**
    - Bir video akışındaki düzlemsel bir yüzey (örneğin, bir dergi kapağı) tespit edilir.
    - Bu yüzey ile üzerine yerleştirilecek sanal bir `image` veya `object` arasında `homography` hesaplanır.
    - `Camera` hareket ettikçe, sanal `object`, `homography` kullanılarak gerçek yüzeyin üzerine doğru perspektifte yerleştirilir.
