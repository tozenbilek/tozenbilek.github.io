---
layout: default
title: Edge Detection ve Gradients
parent: 2. Görüntü Oluşturma ve Filtreleme
nav_order: 4
---

# Edge Detection ve Gradients

`Image`'lerdeki en temel ve önemli bilgilerden biri **edge**'lerdir. `Edge`'ler, nesnelerin sınırlarını, doku değişikliklerini ve aydınlanma farklılıklarını belirten `intensity` değişimleridir.

## Adım 1 – Edge'leri Intensity Değişimi Olarak Gör

Bir `image`'i bir yüzey grafiği olarak düşünürsek, `edge`'ler bu yüzeydeki **sarp yamaçlara veya uçurumlara** benzer. Yani, `edge`'ler, `image` `intensity` fonksiyonunda ani ve hızlı değişimlerin olduğu yerlerdir.

Matematiksel olarak bu hızlı değişimi ölçmenin yolu **derivative** almaktır.
- Bir fonksiyonun **birinci türevi**, o fonksiyonun değişim hızını verir. `Edge` bölgelerinde birinci türevin `magnitude`'u yüksek olacaktır (pozitif veya negatif zirveler).
- Bir fonksiyonun **ikinci türevi**, değişim hızının değişimini verir. `Edge`'ler, ikinci türevin **sıfırdan geçtiği noktalara (zero-crossings)** denk gelir.

## Adım 2 – Image Gradient'ini Hesapla

`Image`'ler iki boyutlu (`I(x, y)`) olduğu için, her yöndeki değişimi ölçmemiz gerekir. Bu, **image gradient (`∇I`)** ile yapılır. `Gradient`, bir vektördür ve iki bileşenden oluşur:
- **x yönündeki partial derivative (`∂I/∂x` veya `Gx`):** Yatay yöndeki `intensity` değişimini ölçer.
- **y yönündeki partial derivative (`∂I/∂y` veya `Gy`):** Dikey yöndeki `intensity` değişimini ölçer.

`∇I = [Gx, Gy]`

Bu `gradient` vektörü iki önemli bilgi taşır:
1.  **Gradient Magnitude:** `Edge`'in ne kadar "güçlü" veya "belirgin" olduğunu gösterir. Vektörün uzunluğudur.
    `Magnitude = ||∇I|| = sqrt(Gx² + Gy²)`
    Hesaplama kolaylığı için bazen `|Gx| + |Gy|` yaklaşımı da kullanılır.

2.  **Gradient Direction/Orientation:** `Intensity`'nin en hızlı arttığı yönü gösterir. `Edge` çizgisi, bu yöne **dik** olur.
    `Direction = θ = atan2(Gy, Gx)`

## Adım 3 – Discrete Derivative Filter'ları Kullan

Dijital `image`'lerde sürekli `derivative` alamayız. Bunun yerine, **finite differences** kullanarak `derivative`'i yaklaşık olarak hesaplayan `filter`'lar (`kernel`'ler) kullanırız.

**Sobel Operator:**
En yaygın kullanılan `derivative filter`'larından biridir. Hem `derivative` alır hem de hafif bir `smoothing` yaparak `noise`'a karşı daha dayanıklı olmasını sağlar.

- **x-yönü için Sobel Kernel (`Sx`):**
  \[
  \begin{bmatrix}
  -1 & 0 & 1 \\
  -2 & 0 & 2 \\
  -1 & 0 & 1
  \end{bmatrix}
  \]

- **y-yönü için Sobel Kernel (`Sy`):**
  \[
  \begin{bmatrix}
  -1 & -2 & -1 \\
  0 & 0 & 0 \\
  1 & 2 & 1
  \end{bmatrix}
  \]

Bu `kernel`'ler `image` ile `convolution` (veya `correlation`) işlemine sokularak `Gx` ve `Gy` `gradient` `image`'leri elde edilir.

## Adım 4 – Noise'un Etkisini Anla ve Çözüm Uygula

`Derivative` operasyonları, doğaları gereği `noise`'a karşı çok hassastır. Çünkü `noise`, `image`'e yüksek frekanslı (hızlı) değişimler ekler ve `derivative filter`'ı bu değişimleri güçlendirerek hatalı `edge`'ler tespit edilmesine neden olur.

**Çözüm: Smooth First, then Differentiate**
Bu problemi çözmek için standart yaklaşım şudur:
1.  Önce `image`'i bir **Gaussian filter** ile `smooth` ederek `noise`'u bastır.
2.  Ardından `smooth` edilmiş `image` üzerinde `derivative filter`'ını uygula.

Bu iki adım (`Gaussian smoothing` + `Derivative`), matematiksel olarak tek bir adımda birleştirilebilir. Gaussian fonksiyonunun `derivative`'ini alarak yeni bir `kernel` oluşturabiliriz. Bu yeni `kernel`'e **Derivative of Gaussian (DoG)** filtresi denir. Bu, hem `noise` bastırma hem de `edge detection` işini tek bir `convolution` ile yapan verimli bir yöntemdir.

Bir sonraki bölümde, bu temel adımları bir araya getirerek güçlü ve modern bir `edge detection` algoritması olan Canny Edge Detector'nü inceleyeceğiz.
