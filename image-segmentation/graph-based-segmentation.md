---
layout: default
title: Graph-Based Segmentation
parent: 6. Image Segmentation
nav_order: 4
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

`pixel`'ler veya `pixel` grupları `node`'ları (`V`), bu `node`'lar arasındaki ilişki (benzerlik) ise `edge`'leri (`E`) oluşturur. Her `edge`'in bir ağırlığı (`weight`) vardır ve bu ağırlık, iki `node`'un birbirine ne kadar benzediğini gösterir.

![Image to Graph Representation](https://placehold.co/700x400/EEE/31343C?text=Pikseller+->+Node'lar,+Benzerlik+->+Edge+Ağırlıkları)
*<center>Görüntünün grafa dönüştürülmesi: Her piksel bir düğüm (node) olur. Birbirine yakın ve benzer renkteki pikseller arasındaki kenarların (edge) ağırlığı yüksek olur.</center>*

Bu `graph` yapısı üzerinde segmentasyon, `graph`'ı iki veya daha fazla alt gruba bölme (`graph cut`) problemine dönüşür. Amaç, alt gruplar arasındaki bağlantıları (yani `cut`'ları) minimuma indirmektir.

Ancak bu yaklaşım, `image`'den küçük ve izole bölgeleri (örneğin tek bir `pixel`) ayırma eğilimindedir.

## Normalized Cuts (N-Cuts)

`N-Cut`'ın amacı, `cut`'ı minimize ederken aynı zamanda ortaya çıkan segmentlerin "boyutunu" da (`assoc(A,V)`) maksimize etmektir. Bu, `Minimum Cut`'ın küçük, izole segmentler üretme sorununu çözer ve daha dengeli, "makul" boyutta segmentler elde edilmesini sağlar.

![Minimum Cut vs Normalized Cut](https://placehold.co/800x400/EEE/31343C?text=Minimum+Cut+(Dengesiz)+vs.+Normalized+Cut+(Dengeli))
*<center>Solda: Minimum Cut, toplam kesim ağırlığı en düşük olan küçük bir grubu ayırma eğilimindedir. Sağda: Normalized Cut, kesimin boyutunu segmentlerin toplam bağlantılarına oranlayarak daha dengeli ve algısal olarak anlamlı kesimler bulur.</center>*

`N-Cut` problemini çözmek, doğrudan zor bir iştir. Ancak, bu problemin `generalized eigenvalue` problemine dönüştürülebileceği gösterilmiştir. `Graph`'ın `Laplacian` matrisinin özvektörleri (`eigenvectors`), `graph`'ı en iyi şekilde bölen `cut`'ları bulmak için kullanılır. Özellikle, ikinci en küçük özvektör (`second smallest eigenvector`), `graph`'ı ikiye bölmek için en iyi çözümü verir.

## N-Cuts Algoritması

1.  `Graph`'ın `Laplacian` matrisini oluştur.
2.  `Laplacian` matrisinin özdeğerlerini ve özvektörlerini bul.
3.  En küçük özdeğer (0) ve ilgili özvektörü kaldır.
4.  Bu özvektör üzerinde bir `threshold` seçerek (örneğin 0) `node`'ları iki gruba ayır.
5.  Eğer daha fazla segmente ihtiyaç varsa, bu adımları ortaya çıkan alt `graph`'lar için tekrarlı (`recursively`) olarak uygula.

---

## Özet ve Anahtar Kavramlar

-   **Graph-Based Segmentation:** Görüntüyü bir `graph` olarak modelleyerek (`pixel`'ler = `node`'lar, benzerlik = `edge` ağırlıkları) ve bu `graph`'ı alt gruplara bölerek segmentasyon yapma yaklaşımıdır.
-   **Graph Cut:** `Graph`'ı iki veya daha fazla alt `graph`'a ayıran `edge`'ler kümesidir. `Cut`'ın maliyeti, bu `edge`'lerin ağırlıkları toplamıdır.
-   **Minimum Cut:** Toplam maliyeti en düşük olan `graph cut`'ıdır. Ancak, anlamsız derecede küçük ve izole segmentler üretme eğilimindedir.
-   **Normalized Cuts (N-Cuts):** `Cut`'ın maliyetini, ortaya çıkan segmentlerin kendi içindeki toplam bağlantılarına oranlayarak normalleştiren bir `graph cut` yöntemidir. Bu, daha dengeli ve algısal olarak daha anlamlı segmentler üretir.
-   **Eigenvalue Problem:** `N-Cut`'ı çözmek, `graph`'ın `Laplacian` matrisinin özdeğer ve özvektörlerini bulma problemine indirgenir. İkinci en küçük özvektör, `graph`'ı en iyi bölen çizgiyi verir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Graf-tabanlı segmentasyonda, pikseller arasındaki bir `edge`'in (kenarın) ağırlığı (`w(i, j)`) genellikle neyi temsil eder?</p>
  <div class="quiz-option">A) İki piksel arasındaki geometrik mesafeyi.</div>
  <div class="quiz-option" data-correct="true">B) İki pikselin renk veya yoğunluk gibi özellikler açısından ne kadar benzer olduğunu.</div>
  <div class="quiz-option">C) İki pikselin de aynı nesneye ait olma olasılığını.</div>
  <div class="quiz-option">D) İki pikselin de kenar pikseli olup olmadığını.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kenar ağırlığı, iki düğüm (piksel) arasındaki "benzerlik" veya "afinite" ölçüsüdür. Benzer pikseller (örneğin, renkleri birbirine çok yakın olanlar) arasındaki kenarların ağırlığı yüksek olurken, benzemeyen pikseller arasındaki kenarların ağırlığı düşük olur. Segmentasyon algoritmaları genellikle bu ağırlıkları kullanarak grafı bölmeye çalışır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> "Minimum Cut" (Min-Cut) yönteminin, segmentasyon için tek başına kullanıldığında ortaya çıkan temel sorun nedir?</p>
  <div class="quiz-option">A) Çok yavaş çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Grafikten tek tek, izole olmuş pikselleri ayırma eğiliminde olması.</div>
  <div class="quiz-option">C) Sadece iki segment üretebilmesi.</div>
  <div class="quiz-option">D) Sadece dışbükey (convex) segmentler bulabilmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Min-Cut, sadece kesilen kenarların toplam ağırlığını minimize etmeye odaklanır. Bir grafın kenarındaki tek bir pikselin, grafın geri kalanına olan toplam bağlantı ağırlığı genellikle çok düşüktür. Bu nedenle, Min-Cut algoritması, anlamlı ve büyük bir bölgeyi ayırmak yerine, bu tür izole "aykırı" pikselleri ayırarak minimum kesiği bulma eğilimindedir. Bu, istenen bir segmentasyon sonucu değildir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> `Normalized Cuts` (N-Cuts) algoritması, Min-Cut'ın sorununu nasıl çözer?</p>
  <div class="quiz-option">A) Daha verimli bir optimizasyon tekniği kullanarak.</div>
  <div class="quiz-option">B) Kenar ağırlıklarını farklı bir şekilde hesaplayarak.</div>
  <div class="quiz-option" data-correct="true">C) Kesi ağırlığını, kesilen segmentlerin kendi içindeki toplam bağlantılarına (hacimlerine) bölerek, büyük ve dengeli segmentler oluşturmayı teşvik ederek.</div>
  <div class="quiz-option">D) Grafı pikseller yerine süper-piksellerden oluşturarak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `N-Cuts`, kesiğin maliyetini (`cut(A,B)`) normalize eder. Bu normalizasyon, kesilen parçaların ne kadar "büyük" ve "içten bağlantılı" olduğunu da hesaba katar (`assoc(A,V)` ve `assoc(B,V)` terimleri). Bu, algoritmayı sadece küçük bir kesik bulmaktan caydırır ve bunun yerine hem segmentler arası benzerliğin düşük (`cut` küçük) hem de segment içi benzerliğin yüksek (`assoc` büyük) olduğu "dengeli" kesikleri bulmaya yönlendirir. Bu, izole piksellerin ayrılması yerine büyük, anlamlı bölgelerin ayrılmasını sağlar.</p>
  </div>
</div>