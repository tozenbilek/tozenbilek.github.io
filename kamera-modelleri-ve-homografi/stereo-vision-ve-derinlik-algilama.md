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

`disparity` ne kadar büyükse, nesne `camera`'lara o kadar yakındır. `disparity` sıfıra yaklaştıkça, nesne sonsuza o kadar yaklaşır.

![Stereo Vision Depth Perception](https://placehold.co/700x350/EEE/31343C?text=İki+Kamera+->+Disparity+->+Derinlik+(Z))
*<center>Stereo vision, iki farklı kamera açısından elde edilen görüntülerdeki piksellerin yatay kayması (disparity) prensibini kullanarak derinliği (Z) hesaplar.</center>*

## Epipolar Geometry

`epipolar constraint`, `correspondence` aramasını tüm `image` yerine sadece tek boyutlu bir çizgi üzerinde yapmamızı sağlayarak problemi büyük ölçüde basitleştirir.

![Epipolar Geometry](https://placehold.co/600x400/EEE/31343C?text=Epipolar+Düzlem,+Epipole'ler+ve+Epipolar+Çizgiler)
*<center>3D nokta P ve iki kamera merkezi (O, O'), epipolar düzlemi oluşturur. Bu düzlemin görüntü düzlemleriyle kesişimi, epipolar çizgileri (l, l') verir. P'nin sağdaki görüntüsü (p'), soldaki epipolar çizgisi (l) üzerinde olmak zorundadır.</center>*

## The Correspondence Problem

Bu sorunu çözmek için `template matching` benzeri, pencere tabanlı yaklaşımlar kullanılır. Sol `image`'deki bir `pixel`'i merkez alan küçük bir pencere (örneğin 5x5), sağ `image`'deki `epipolar line` üzerinde kaydırılır. Her pozisyonda iki pencere arasındaki benzerlik, **Sum of Squared Differences (SSD)** veya **Normalized Cross-Correlation (NCC)** gibi bir metrikle ölçülür. En iyi eşleşmeyi (`minimum SSD` veya `maksimum NCC`) veren pozisyon, `corresponding point` olarak seçilir.

![Correspondence Problem with Window Matching](https://placehold.co/800x300/EEE/31343C?text=Sol+Görüntüdeki+Pencere+->+Sağ+Görüntüdeki+Epipolar+Çizgi+Üzerinde+Arama)
*<center>Correspondence problemi: Soldaki görüntüden alınan bir pencere, sağdaki görüntüde epipolar çizgi boyunca kaydırılarak en çok benzeyen bölge aranır.</center>*

Bu yaklaşımın bazı zorlukları vardır:
- **Pencere Boyutu:** Çok küçük pencereler ayırt edici olmazken, çok büyük pencereler `perspective` bozulmasından etkilenebilir.
- **Occlusions (Örtülme):** Bir `camera`'nın gördüğü bir nokta, diğer `camera` tarafından görülemeyebilir.

---

## Özet ve Anahtar Kavramlar

-   **Stereo Vision:** İki veya daha fazla kameradan alınan görüntüleri kullanarak 3D sahne yapısını, özellikle de derinliği, yeniden oluşturma işlemidir.
-   **Disparity:** Bir 3D noktanın iki farklı kamera görüntüsündeki `pixel` konumları arasındaki yatay farktır. `Disparity`, derinlikle ters orantılıdır.
-   **Epipolar Geometry:** İki kamera arasındaki geometrik ilişkiyi tanımlar ve `correspondence` aramasını 2D'den 1D'ye (epipolar çizgi üzerine) indirgeyerek basitleştirir.
-   **Epipolar Constraint:** Bir 3D noktanın bir görüntüdeki yansıması biliniyorsa, diğer görüntüdeki yansımasının `epipolar line` adı verilen belirli bir çizgi üzerinde olması gerektiğini belirten kısıttır.
-   **Correspondence Problem:** Sol görüntüdeki her bir `pixel`'e, sağ görüntüdeki karşılık gelen `pixel`'i bulma problemidir. Genellikle pencere tabanlı `SSD` veya `NCC` ile çözülür.

---

## Kavrama Soruları

<details>
  <summary><b>Soru 1:</b> Stereo kamera sisteminde, iki kamera arasındaki mesafeyi (baseline, `B`) artırırsak, aynı mesafedeki bir nesne için `disparity` nasıl değişir? Bu durumun derinlik ölçüm hassasiyetine etkisi nedir?</summary>
  <p>`Z = f * B / disparity` formülünü `disparity = f * B / Z` olarak düzenlersek, `disparity`'nin `baseline` (`B`) ile doğru orantılı olduğunu görürüz. `Baseline`'ı artırmak, aynı derinlikteki (`Z`) bir nesne için `disparity`'yi de artırır. Daha büyük `disparity` değerleri, `pixel` cinsinden daha kolay ve hassas bir şekilde ölçülebilir. Bu nedenle, `baseline`'ı artırmak, genellikle derinlik ölçümünün hassasiyetini ve doğruluğunu artırır, özellikle de uzaktaki nesneler için.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Neden `correspondence` aramasını tüm görüntüde yapmak yerine `epipolar line` üzerinde yaparız? Bu kısıtlamanın temelindeki geometrik sebep nedir?</summary>
  <p>Geometrik olarak, 3D'deki bir `P` noktası, birinci kamera merkezi `O` ve ikinci kamera merkezi `O'` her zaman bir düzlem oluşturur (epipolar düzlem). `P` noktasının birinci görüntüdeki yansıması olan `p`, `OP` doğrusu üzerindedir. İkinci görüntüdeki yansıması olan `p'` ise `O'P` doğrusu üzerindedir. Bu iki doğru da aynı epipolar düzlemde yer alır. Dolayısıyla, `p'` noktası, epipolar düzlemin ikinci görüntü düzlemiyle kesişimi olan `epipolar line` üzerinde yer almak zorundadır. Bu, arama uzayını 2D'den 1D'ye indirerek verimliliği muazzam şekilde artırır.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Doku (texture) olmayan, düz beyaz bir duvarın derinliğini stereo vision ile ölçmeye çalışırsak ne gibi bir sorunla karşılaşırız?</summary>
  <p>Bu durumda `correspondence` problemiyle karşılaşırız. Düz beyaz bir duvarda, tüm `pixel`'ler aynı veya çok benzer `intensity` değerlerine sahiptir. Sol görüntüden aldığımız herhangi bir 5x5'lik pencere, sağ görüntüdeki `epipolar line` üzerindeki tüm pencerelerle neredeyse aynı `SSD` veya `NCC` skorunu verir. Ayırt edici bir desen veya doku olmadığı için, pencereleri güvenilir bir şekilde eşleştiremeyiz ve bu nedenle `disparity`'yi (ve dolayısıyla derinliği) hesaplayamayız. Bu, stereo algoritmalarının dokusuz yüzeylerde başarısız olmasının temel nedenidir.</p>
</details>