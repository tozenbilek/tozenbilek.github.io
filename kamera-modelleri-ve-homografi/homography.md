---
layout: default
title: Homography
parent: 4. Camera Models ve Homography
nav_order: 2
---

# Homography

**Homography**, en genel 2D `projective` dönüşümdür. Ancak `homography`'ye gelmeden önce, daha basit geometrik dönüşümleri ve hiyerarşisini anlamak faydalıdır. Bu dönüşümler `homogeneous` koordinatlar ve 3x3 matrisler kullanılarak zarif bir şekilde ifade edilebilir.

## 2D Dönüşüm Hiyerarşisi

Dönüşümler, korudukları özelliklere göre basitten karmaşığa doğru bir hiyerarşi oluşturur.

1.  **Translation (Öteleme):**
    -   Nesnenin sadece konumunu değiştirir.
    -   **Korunanlar:** Uzunluklar, alanlar, açılar, yönelim (`orientation`), paralellik. Kısacası her şey.
2.  **Euclidean (Rigidbody):**
    -   Öteleme ve döndürme (`rotation`) içerir. Cisimlerin bükülmediği veya esnemediği "katı cisim" hareketleridir.
    -   **Korunanlar:** Uzunluklar, alanlar, açılar, paralellik.
3.  **Similarity (Benzerlik):**
    -   Öteleme, döndürme ve tek tip ölçekleme (`uniform scaling`) içerir.
    -   **Korunanlar:** Alanların oranı, açılar, paralellik. Uzunluklar korunmaz ama uzunlukların oranı korunur.
4.  **Affine:**
    -   Öteleme, döndürme, ölçekleme ve `shear` (eğme/kaykılma) içerir. Bir kareyi herhangi bir paralelkenara dönüştürebilir.
    -   **Korunanlar:** Paralel çizgiler, alanların oranı. Açılar ve uzunluklar korunmaz.
5.  **Projective (Homography):**
    -   En genel 2D dönüşümdür. Bir kareyi herhangi bir dışbükey (`convex`) dörtgene dönüştürebilir.
    -   **Korunanlar:** Sadece düz çizgiler. Paralellik, açılar, uzunluklar veya alanların oranı korunmaz.

Bu hiyerarşi, `computer vision`'da `image`'ler arasındaki olası ilişkileri modellemek için temel bir araç setidir.

**Homography**, aynı 3D düzlemin iki farklı `image`'deki (veya `projection`'daki) görünümü arasındaki ilişkiyi tanımlayan bir `projective` dönüşümdür. Bu dönüşüm, 3x3'lük bir matris ile temsil edilir ve `image`'ler arasında `pixel` koordinatlarını dönüştürmek için kullanılır.

## Homography Nedir?

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

## Homography'nin Geçerli Olduğu Durumlar

Bir `homography` dönüşümü, iki `image` arasında yalnızca iki özel durumda geçerlidir:

1.  **Düzlemsel Sahne (Planar Scene):** `Camera` hareket etse bile, sahnedeki tüm noktalar aynı düzlem üzerinde ise (örneğin, bir duvarın, bir masanın veya bir kağıdın fotoğrafını çekmek).
2.  **Dönen Kamera (Rotating Camera):** `Camera`'nın `center of projection`'ı sabit kalacak şekilde sadece döndürüldüğü durumlar. Bu durumda, sahnenin 3D yapısı önemli değildir; `image`'ler sanki sonsuzdaki bir düzlemin farklı görünümleriymiş gibi ilişkilendirilebilir. `Panorama` ve `image stitching` uygulamaları bu prensibe dayanır.

## Homography Matrisini Hesaplama (DLT Algoritması)

`H` matrisini bulmak için iki `image` arasında en az **4 adet karşılıklı nokta (point correspondence)** bilinmesi gerekir. Daha fazla nokta kullanmak, `noise`'a karşı daha sağlam sonuçlar verir. `Direct Linear Transformation (DLT)` algoritması, bu matrisi hesaplamak için yaygın olarak kullanılır.

- Her bir `(p, p')` nokta çifti, `H`'nin elemanları için iki lineer denklem üretir.
- 4 nokta çifti, 8 denklemden oluşan bir sistem oluşturur (`Ah = 0`).
- Bu denklem sistemi, `Singular Value Decomposition (SVD)` gibi yöntemlerle çözülerek `H`'nin 8 bilinmeyen elemanı bulunur.

## Homography'nin Uygulama Alanları

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

## Image Warping Detayları

Bir `image`'i bir `homography` matrisi `H` ile dönüştürme işlemine `image warping` denir. Bu işlem, kaynak `image`'deki `pixel`'leri hedef `image`'deki yeni konumlarına taşır. Bu taşıma işlemi için iki temel yaklaşım vardır:

-   **Forward Warping:** Kaynak `image`'deki her bir `(x, y)` `pixel`'i için, hedef `image`'deki yeni `(x', y')` konumu `H * (x, y)` ile hesaplanır ve `pixel` değeri oraya kopyalanır.
    -   **Sorun:** Kaynak `pixel`'leri tam sayı koordinatlarındadır, ancak hedef `(x', y')` koordinatları ondalıklı olabilir. Bu, hedef `image`'de bazı `pixel`'lerin hiç değer almamasına (delikler) veya bazı `pixel`'lere birden fazla değerin atanmasına (çakışmalar) neden olabilir.

-   **Inverse Warping:** Hedef `image`'deki her bir `(x', y')` `pixel` konumu için, bu `pixel`'e kaynak `image`'de karşılık gelen `(x, y)` konumu, `inverse homography` (`H⁻¹`) kullanılarak hesaplanır: `(x, y) = H⁻¹ * (x', y')`.
    -   **Avantaj:** Bu yaklaşım, hedef `image`'deki tüm `pixel`'lerin doldurulacağını garanti eder ve delik veya çakışma oluşturmaz.
    -   **Bilinear Interpolation:** Hesaplanan `(x, y)` konumu genellikle ondalıklıdır, yani kaynak `image`'de dört `pixel`'in arasına düşer. Bu durumda, hedef `pixel`'in değeri, bu dört komşu `pixel`'in değerlerinden, ondalıklı konuma olan uzaklıklarına göre ağırlıklı bir ortalama alınarak hesaplanır. Bu işleme **bilinear interpolation** denir ve daha pürüzsüz, daha kaliteli bir sonuç üretir. Bu nedenle pratikte her zaman `inverse warping` tercih edilir.
