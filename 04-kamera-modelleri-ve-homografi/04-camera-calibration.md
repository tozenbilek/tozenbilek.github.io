---
layout: default
title: Camera Calibration
parent: 4. Camera Models ve Homography
nav_order: 4
---

# Camera Calibration

Şimdiye kadar kullandığımız `pinhole camera` modeli, `focal length` (`d` veya `f`) gibi tek bir parametre ile basitleştirilmiş bir modeldi. Gerçek dünyadaki `camera`'ların 3D noktaları 2D `pixel`'lere nasıl yansıttığını tam olarak anlamak için, `camera`'nın hem iç geometrisini (`intrinsics`) hem de 3D uzaydaki konumunu ve yönelimini (`extrinsics`) tanımlayan bir dizi parametreyi bilmemiz gerekir. **Camera calibration**, bu parametreleri bulma işlemidir.

## Camera Matrix (P)

`Camera calibration`'ın nihai amacı, 3x4'lük **Camera Matrix (`P`)**'yi bulmaktır. Bu matris, `homogeneous` koordinatlardaki herhangi bir 3D dünya noktası `X`'i, yine `homogeneous` koordinatlardaki 2D `image` noktası `x`'e doğrudan eşler:

`x = P * X`

Bu `P` matrisi, iki ana bileşenden oluşur: `intrinsic matrix` `K` ve `extrinsic parameters` `[R|t]`.

`P = K * [R|t]`

## Intrinsic Parameters (K Matrisi)

**Intrinsics**, `camera`'nın optik ve geometrik özelliklerini, yani iç yapısını tanımlar. Bu parametreler, `camera` üretildiğinde sabitlenir ve `camera`'nın uzaydaki konumundan bağımsızdır. 3x3'lük bir üst üçgen matris olan `K` ile temsil edilirler.

\[
K =
\begin{bmatrix}
f_x & s & c_x \\
0 & f_y & c_y \\
0 & 0 & 1
\end{bmatrix}
\]

- **`f_x`, `f_y` (Focal Length):** `Focal length`'in `pixel` birimi cinsinden x ve y yönlerindeki değerleridir. `Pixel`'ler kare değilse bu iki değer farklı olabilir.
- **`c_x`, `c_y` (Principal Point):** `Optical axis`'in `image plane`'i kestiği noktanın `pixel` koordinatlarıdır. Genellikle `image`'in merkezine çok yakındır.
- **`s` (Skew Coefficient):** `Image` sensörünün x ve y eksenleri arasındaki çarpıklığı tanımlar. Modern `camera`'larda bu değer neredeyse her zaman 0'dır.

Ayrıca, `lens`'in fiziksel yapısından kaynaklanan **Radial Distortion** gibi `non-linear` etkiler de `intrinsic` parametreler olarak kabul edilir ve genellikle ayrı katsayılarla modellenir.

## Extrinsic Parameters ([R|t] Matrisi)

**Extrinsics**, `camera`'nın 3D dünya koordinat sistemine göre nerede durduğunu ve nereye baktığını tanımlar.
- **`R` (Rotation Matrix):** `Camera`'nın yönelimini (dönmesini) tanımlayan 3x3'lük bir `rotation` matrisidir.
- **`t` (Translation Vector):** `Camera`'nın dünya koordinat sisteminin orijinine göre konumunu tanımlayan 3x1'lik bir `translation` (öteleme) vektörüdür.

Bu iki parametre bir araya gelerek 3x4'lük `[R|t]` matrisini oluşturur ve dünya koordinatlarını `camera`'nın kendi koordinat sistemine dönüştürür.

## Calibration Süreci

`Camera calibration` yapmak için, 3D uzaydaki konumlarını tam olarak bildiğimiz birden fazla noktayı (genellikle dama tahtası gibi özel bir desen üzerinde) farklı açılardan fotoğraflarız.
- **Zhang's Method** veya **Tsai's Method** gibi algoritmalar, bu 3D noktalar ile `image`'lerdeki 2D karşılıkları arasındaki ilişkiyi kullanarak `K`, `R`, `t` ve `distortion` katsayılarını en iyi şekilde çözer.

Bu parametreleri bilmek, `image`'deki `pixel`'lerden yola çıkarak dünyadaki nesnelerin boyutu ve konumu hakkında metrik ölçümler yapmak, 3D `reconstruction` ve `augmented reality` gibi birçok uygulama için kritik öneme sahiptir.
