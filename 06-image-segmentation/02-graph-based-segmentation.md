---
layout: default
title: Graph-Based Segmentation
parent: 6. Image Segmentation
nav_order: 2
---

# Graph-Based Segmentation

`Clustering`-tabanlı yöntemler `pixel`'lerin `feature`'larını gruplarken, `pixel`'ler arasındaki ilişkileri ve `image`'in genel yapısını göz ardı edebilir. **Graph-based** yöntemler, `image`'i bir bütün olarak ele alarak `pixel`'ler arası ilişkileri bir `graph` üzerinde modeller ve `segmentation`'ı bu `graph`'ı en uygun şekilde bölme (`partitioning`) problemi olarak çözer.

## Image'i Bir Graph Olarak Temsil Etmek

Bir `image`, bir `G = (V, E)` `graph`'ı olarak temsil edilebilir:
- **`V` (Vertices / Düğümler):** `Image`'deki her bir `pixel`, `graph`'ta bir `node`'a (düğüm) karşılık gelir.
- **`E` (Edges / Kenarlar):** Herhangi iki `node` (veya `pixel`) arasında bir `edge` (kenar) bulunur. Bu `edge`'in bir ağırlığı (`weight`) vardır.
- **`Weight` (`w_ij`):** İki `pixel` (`i` ve `j`) arasındaki `edge`'in ağırlığı, bu iki `pixel`'in ne kadar "benzer" olduğunu ölçer. Bu benzerliğe **affinity** denir. `Affinity` genellikle `pixel`'lerin renk, `intensity` veya konum (`distance`) gibi `feature`'larının ne kadar yakın olduğuna göre hesaplanır. Yüksek `affinity` (büyük ağırlık), `pixel`'lerin aynı `segment`'e ait olma olasılığının yüksek olduğunu gösterir.

## Segmentation'ı Graph Cut Olarak Formüle Etmek

`Image`'i `segment`'lere ayırmak, `graph`'ı iki veya daha fazla alt-`graph`'a bölmekle eşdeğerdir. Bu bölme işlemi, bazı `edge`'leri keserek (`cut`) yapılır.
- **Cut:** `Graph`'ı iki ayrı parçaya (`A` ve `B`) ayıran `edge`'lerin kümesidir.
- **Cost of a Cut (Kesim Maliyeti):** `cut(A, B) = Σ w_ij` (bir ucu `A`'da, diğer ucu `B`'de olan tüm `edge`'lerin ağırlıkları toplamı).

İdeal bir `segmentation`, farklı `segment`'ler arasındaki `affinity`'nin düşük, aynı `segment` içindeki `affinity`'nin ise yüksek olduğu bir bölme işlemidir. Bu, `segment`'ler arası `edge`'lerin ağırlıklarının düşük olması gerektiği anlamına gelir. Dolayısıyla, `segmentation` problemi, **minimum cost cut'ı (min-cut)** bulma problemine dönüşür.

## Minimum Cut Problemi ve Normalized Cut

**Minimum cut** algoritması, en düşük maliyetli kesimi bulmaya çalışır. Ancak bu yaklaşımın bir problemi vardır: `graph`'ın kenarlarında, az sayıda `edge`'e sahip olan küçük, izole `pixel` gruplarını ayırmaya eğilimlidir. Bu, anlamlı `segment`'ler yerine, alakasız küçük bölgeler bulmamıza neden olur.

Bu sorunu çözmek için **Normalized Cut (N-Cut)** algoritması geliştirilmiştir. N-Cut, `cut`'ın maliyetini, `cut`'ın ayırdığı `segment`'lerin "büyüklüğüne" göre normalize eder. Bir `segment`'in büyüklüğü, o `segment`'teki tüm `node`'ların `graph`'ın geri kalanına olan toplam `edge` ağırlıkları (`association`) olarak tanımlanır.

`N-cut(A, B) = cut(A, B) / assoc(A, V) + cut(A, B) / assoc(B, V)`

N-Cut, `segment`'ler arası benzerliğin (`cut`) düşük olmasını sağlarken, aynı zamanda `segment`'ler içi benzerliğin (`assoc`) de yüksek olmasını teşvik eder. Bu, daha dengeli ve algısal olarak daha anlamlı `segment`'ler üretir.

N-Cut değerini minimize etmek, doğrudan çözülmesi zor bir problemdir. Ancak bu problem, `affinity` matrisinin `eigenvalue` ve `eigenvector`'larını bulmayı içeren standart bir `linear algebra` problemine dönüştürülebilir. En küçük ikinci `eigenvector`, `graph`'ı ikiye bölmek için en iyi yeri gösterir. `Image`'i ikiden fazla `segment`'e ayırmak için bu işlem tekrarlanabilir.

## Graph-Based Yöntemlerin Avantajları

- **Global Bakış Açısı:** `Pixel`'leri izole olarak değil, `image`'in genel yapısı içinde değerlendirir.
- **Esneklik:** `Affinity` (benzerlik) metriği, renk, doku, konum gibi birçok farklı `feature`'ı içerecek şekilde esnekçe tasarlanabilir.
- **Dengeli Bölgeler:** `Normalized Cut` gibi yöntemler, anlamsız küçük `segment`'ler yerine daha dengeli ve büyük bölgeler bulma eğilimindedir.
