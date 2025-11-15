---
layout: default
title: Stereo Vision ve Depth Perception
parent: 4. Camera Models ve Homography
nav_order: 3
---

# Stereo Vision ve Depth Perception

Tek bir `image`, 3D dünya hakkında doğal bir belirsizlik içerir; farklı derinliklerdeki farklı boyutlu nesneler, `image`'de aynı görünebilir. İnsanların iki göze sahip olması gibi, iki `camera`'dan (`stereo`) alınan `image`'leri kullanarak bu belirsizliği çözebilir ve sahnenin derinlik yapısını yeniden oluşturabiliriz.

## Stereo Vision'ın Temel Prensibi

`Stereo vision`'ın temel fikri, 3D'deki aynı `P` noktasının iki farklı `camera`'dan (sol ve sağ) çekilen `image`'lerindeki konumlarını karşılaştırmaktır.
- `P` noktasının sol `image`'deki `projection`'ı `p_L` ve sağ `image`'deki `projection`'ı `p_R` olsun.
- İki `camera` arasındaki yatay kayma nedeniyle, `p_L` ve `p_R`'nin `image`'lerdeki yatay (`x`) koordinatları farklı olacaktır.
- Bu yatay konum farkına **disparity** denir: `Disparity = x_L - x_R`.

**Disparity ve Derinlik İlişkisi:**
`Disparity`, noktanın `camera`'lara olan `depth`'i (`Z`) ile **ters orantılıdır**.
- Yakındaki noktalar büyük bir `disparity`'ye sahip olur (iki `image` arasında çok fazla yer değiştirirler).
- Uzaktaki noktalar küçük bir `disparity`'ye sahip olur (iki `image` arasında çok az yer değiştirirler).

Eğer `camera`'lar kalibre edilmişse (yani `focal length` `f` ve aralarındaki `baseline` mesafesi `B` biliniyorsa), `disparity`'den `depth` doğrudan hesaplanabilir:

`Depth (Z) = (B * f) / Disparity`

## Epipolar Geometry

İki `image` arasında karşılık gelen noktaları (`correspondence`) bulmak, `stereo vision`'ın en zorlu adımıdır. Sol `image`'deki bir `p_L` noktası için, sağ `image`'in tamamını aramak yerine, arama alanını tek bir çizgiye indirgeyebiliriz. Bu kısıtlamaya **epipolar constraint** denir ve **epipolar geometry** ile açıklanır.

- **Epipoles (`e_L`, `e_R`):** Bir `camera`'nın `center of projection`'ının diğer `camera`'nın `image plane`'indeki `projection`'ıdır.
- **Epipolar Plane:** 3D'deki `P` noktası ve iki `camera`'nın `center of projection`'ları (`C_L`, `C_R`) tarafından oluşturulan düzlemdir.
- **Epipolar Line:** `Epipolar plane`'in `image plane`'lerle kesişiminden oluşan çizgidir.

**Epipolar Constraint:** Sol `image`'deki bir `p_L` noktasına karşılık gelen `p_R` noktası, sağ `image`'deki ilgili **epipolar line** üzerinde bulunmak zorundadır.

Bu kısıtlama, 2D bir arama problemini 1D bir arama problemine indirgeyerek `correspondence` bulma işlemini büyük ölçüde basitleştirir.

**Özel Durum: Paralel Kameralar (`Rectified Images`)**
Eğer iki `camera`'nın `image plane`'leri aynı düzlemdeyse ve `optical axis`'leri birbirine paralelse, tüm `epipolar line`'lar `image`'lerde yatay olur ve aynı satırda yer alır. Bu, `correspondence` aramasını daha da basitleştirir. `Camera`'lar bu ideal durumda değilse, `image`'ler matematiksel olarak bu hale getirelecek şekilde "düzeltilebilir" (`rectification`).

## Correspondence Problemi

`Epipolar constraint` arama alanını daraltsa da, bir `epipolar line` üzerinde `p_L`'e benzeyen birden fazla `pixel` olabilir. Doğru eşleşmeyi bulmak için ek "yumuşak" kısıtlamalar kullanılır:

1.  **Similarity Constraint:** Karşılık gelen `pixel`'lerin etrafındaki küçük pencerelerin (`window`) birbirine benzemesi gerekir. Bu benzerlik, `Sum of Squared Differences (SSD)` veya `Normalized Cross-Correlation (NCC)` gibi metriklerle ölçülür.
2.  **Uniqueness Constraint:** Sol `image`'deki bir noktanın, sağ `image`'de yalnızca bir tane karşılığı olmalıdır (ve tersi).
3.  **Ordering Constraint:** Genellikle, sol `image`'de `p1`'in solunda olan bir `p2` noktası, sağ `image`'de de `p1_eş`'in solunda kalır. Bu kural, `occlusion` (bir nesnenin diğerini gizlemesi) veya çok ince ön plan nesneleri olduğunda bozulabilir.
4.  **Smoothness Constraint:** Komşu `pixel`'lerin genellikle benzer `disparity` değerlerine sahip olması beklenir, çünkü dünyadaki yüzeyler çoğunlukla pürüzsüzdür.

Bu kısıtlamaları kullanarak, bir `disparity map` oluşturulur. `Disparity map`, her `pixel` için hesaplanan `disparity` değerini içeren bir `image`'dir ve sahnenin 3D yapısı hakkında yoğun bir bilgi sağlar.
