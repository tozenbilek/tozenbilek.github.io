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

![Inverse Warping with Bilinear Interpolation](https://placehold.co/700x400/EEE/31343C?text=Hedefteki+(x',y')+->+H-1+->+Kaynaktaki+(x,y)+->+4+komşudan+değer+al)
*<center>Inverse Warping: Hedef görüntüdeki her bir piksel konumu için, kaynak görüntüdeki karşılığı bulunur ve bu noktanın etrafındaki dört komşudan bilinear interpolation ile bir değer hesaplanır.</center>*
---

## Özet ve Anahtar Kavramlar

-   **Homography:** Bir düzlemin, başka bir düzleme `projective` dönüşümünü temsil eden 3x3'lük bir matristir. 8 serbestlik derecesine sahiptir.
-   **2D Transformation Hierarchy:** `Translation` (öteleme) en basit dönüşüm olup, sırasıyla `Euclidean`, `Similarity`, `Affine` ve `Projective` (homography) dönüşümleriyle genelleştirilir. Her seviye, bir öncekinin özelliklerini korurken bazılarını kaybeder (örn: `Affine`, paralelliği korur ama açıları korumaz).
-   **Direct Linear Transform (DLT):** Bir `homography` matrisini hesaplamak için en az 4 nokta eşleşmesi kullanılarak kurulan lineer denklem sistemini çözen yöntemdir.
-   **Image Warping:** Bir görüntüyü bir `homography` matrisi kullanarak dönüştürme işlemidir.
-   **Inverse Warping & Bilinear Interpolation:** Görüntü `warping` sırasında delikler oluşmasını önlemek için kullanılan standart tekniktir. Hedef `pixel`'den kaynağa doğru bir haritalama yapılır ve kaynak görüntüden `sub-pixel` değerleri okumak için `bilinear interpolation` kullanılır.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> 2D dönüşümler hiyerarşisinde, hangi dönüşüm paralelliği korurken, açıları ve uzunlukları korumak zorunda değildir?</p>
  <div class="quiz-option">A) Euclidean (Rigidbody)</div>
  <div class="quiz-option">B) Similarity</div>
  <div class="quiz-option" data-correct="true">C) Affine</div>
  <div class="quiz-option">D) Projective (Homography)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Affine dönüşümler, paralel çizgileri yine paralel çizgilere dönüştürür. Ancak rotasyon, ölçekleme (farklı eksenlerde farklı oranlarda) ve eğme (shear) içerebildiği için açıları ve uzunlukları korumaz. Euclidean sadece rotasyon ve öteleme, Similarity bunlara ek olarak tek tip ölçekleme içerir. Projective ise paralelliği bile korumaz.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Görüntü `warping` işlemlerinde, "inverse warping" (ters `warping`) yönteminin "forward warping"e göre temel avantajı nedir?</p>
  <div class="quiz-option">A) Daha hızlı çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Hedef görüntüde delikler (holes) veya çakışmalar (splats) gibi artefaktlar oluşturmaması.</div>
  <div class="quiz-option">C) Daha az bellek kullanması.</div>
  <div class="quiz-option">D) Sadece `affine` dönüşümler için geçerli olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> "Inverse warping", hedef görüntüdeki her bir pikselin koordinatını alır, ters dönüşümle kaynak görüntüde nereye düştüğünü bulur ve oradaki rengi (genellikle interpolasyon ile) alır. Bu yaklaşım, hedefteki her pikselin tam olarak bir kez doldurulmasını garanti eder, bu da `forward warping`'de görülebilen delik ve çakışma sorunlarını ortadan kaldırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir `Homography` matrisi, iki görüntü arasındaki ilişkiyi hangi durumda tam olarak modelleyebilir?</p>
  <div class="quiz-option">A) Görüntülerden biri diğerinin herhangi bir 3D dönüşüme uğramış haliyse.</div>
  <div class="quiz-option">B) İki görüntü, farklı aydınlatma koşulları altında çekilmişse.</div>
  <div class="quiz-option">C) İki görüntü, aynı 3D nesnenin çok farklı iki kamerasından çekilmişse.</div>
  <div class="quiz-option" data-correct="true">D) Görüntülenen sahne tamamen düzlemsel (planar) ise veya iki görüntü aynı kamera merkezinden sadece rotasyon ile elde edilmişse.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Bir `homography`, iki projektif düzlem arasındaki ilişkiyi tanımlar. Bu durum, bilgisayarlı görüde iki senaryoda ortaya çıkar: 1) Görüntülenen sahne, bir duvar veya bir kağıt gibi tamamen düz bir yüzeyse. 2) Sahne 3D olsa bile, iki fotoğraf aynı noktada duran bir kameranın sadece kendi etrafında döndürülmesiyle (pan/tilt/roll) çekilmişse. Bu iki durum dışında, `homography` 3D sahneyi tam olarak modelleyemez.</p>
  </div>
</div>
