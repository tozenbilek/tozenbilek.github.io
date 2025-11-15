---
layout: default
title: Feature'ların Temelleri ve Corner Detection
parent: 5. Feature Detection ve Matching
nav_order: 1
---

# Feature'ların Temelleri ve Corner Detection

`Image`'leri birleştirmek, nesneleri tanımak veya 3D yapı çıkarmak gibi görevler için `image`'ler arasında güvenilir eşleşmeler bulmamız gerekir. Bu eşleşmeleri, `image`'in tamamı yerine **local features** adı verilen küçük, ayırt edici bölgeler üzerinden yapmak çok daha etkilidir.

## İyi Bir Local Feature'ın Özellikleri

İyi bir `local feature`, aşağıdaki özelliklere sahip olmalıdır:
1.  **Repeatability (Tekrarlanabilirlik):** Aynı 3D nokta, farklı bakış açılarından, aydınlatma koşullarından veya `scale`'lerden çekilmiş `image`'lerde tekrar tekrar tespit edilebilmelidir.
2.  **Distinctiveness / Saliency (Ayırt Edicilik):** `Feature`'ın etrafındaki `image` bölgesi, diğer `feature`'lardan kolayca ayırt edilebilecek kadar zengin bir dokuya veya desene sahip olmalıdır. Düz bir duvardaki bir nokta kötü bir `feature` iken, bir nesnenin köşesi iyi bir `feature`'dır.
3.  **Locality (Yerellik):** `Feature`, `image`'in küçük bir bölgesini kapsamalıdır. Bu, `occlusion` (nesnenin bir kısmının gizlenmesi) ve `clutter` (sahnedeki alakasız nesneler) gibi sorunlara karşı dayanıklılık sağlar.

## Feature Detection: Nereye Bakmalı?

`Image`'de en ayırt edici ve kolayca bulunabilen bölgeler, `intensity`'nin her yönde belirgin bir şekilde değiştiği yerlerdir.
- **"Flat" (Düz) Bölgeler:** Her yönde `intensity` değişimi çok azdır. Kötü `feature`'lardır.
- **"Edge" (Kenar) Bölgeleri:** `Edge` yönü boyunca `intensity` değişimi az, `edge`'e dik yönde ise değişim fazladır. Bu belirsizlikten (`aperture problem`) dolayı kısmen iyi `feature`'lardır.
- **"Corner" (Köşe) Bölgeleri:** Her yönde `intensity` değişimi belirgindir. Bu nedenle, `corner`'lar mükemmel `feature` adaylarıdır.

## Harris Corner Detector

`Corner`'ları matematiksel olarak bulmanın bir yolu, küçük bir pencereyi `image` üzerinde kaydırdığımızda pencere içindeki `pixel` `intensity`'lerinin ne kadar değiştiğini ölçmektir. Bu değişim, `Sum of Squared Differences (SSD)` ile formüle edilebilir:

`E(u,v) = Σ [ I(x+u, y+v) - I(x,y) ]²`

Burada `(u,v)` pencerenin kayma miktarıdır. Bu formül, `image`'in `gradient`'lerini kullanan bir matris (`M`) ile basitleştirilebilir:

\[
M =
\begin{bmatrix}
\Sigma I_x^2 & \Sigma I_xI_y \\
\Sigma I_xI_y & \Sigma I_y^2
\end{bmatrix}
\]

Bu `M` matrisinin `eigenvalue`'ları (`λ₁`, `λ₂`), `gradient`'in iki ana yöndeki büyüklüğünü temsil eder.
- **Flat Bölge:** `λ₁` ve `λ₂` ikisi de küçüktür.
- **Edge Bölgesi:** Biri büyük, diğeri küçüktür.
- **Corner Bölgesi:** `λ₁` ve `λ₂` ikisi de büyüktür.

`Eigenvalue`'ları doğrudan hesaplamak yerine, **Harris Corner Detector** aşağıdaki yanıt fonksiyonunu (`R`) kullanır:

`R = det(M) - α * trace(M)²`
`R = (λ₁λ₂) - α * (λ₁ + λ₂)²`

- `R`'nin büyük ve pozitif olduğu yerler `corner`'dır.
- `R`'nin büyük ve negatif olduğu yerler `edge`'dir.
- `|R|`'nin küçük olduğu yerler `flat` bölgelerdir.

## Harris Corner Detector'ın Özellikleri

- **Rotation Invariance:** `Image` döndürüldüğünde, `M` matrisinin `eigenvalue`'ları değişmez. Bu nedenle, Harris `detector`, `rotation`'a karşı **dayanıklıdır**.
- **Intensity Invariance:** `Image`'in parlaklığındaki değişimlere (`I -> I + b` veya `I -> a*I`) karşı büyük ölçüde **dayanıklıdır**, çünkü sadece `gradient`'lere (`derivative`'lere) dayanır.
- **Scale Invariance:** Harris `detector`, `image`'in `scale`'ine karşı **dayanıklı değildir**. Bir `image`'i küçülttüğümüzde bir `corner` `edge`'e dönüşebilir veya büyüttüğümüzde düz bir alana benzeyebilir.

Bu `scale` problemi, bir sonraki bölümde ele alacağımız `scale-invariant feature detector`'ların geliştirilmesinin ana motivasyonudur.
