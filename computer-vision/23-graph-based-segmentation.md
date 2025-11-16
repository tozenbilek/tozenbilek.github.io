---
layout: default
title: Graph-Based Segmentation
nav_order: 23
parent: Computer Vision
---

# Graph-Based Segmentation

Şimdiye kadar gördüğümüz kümeleme yöntemleri (k-means, Mean-Shift), pikselleri bir özellik uzayında gruplamaya odaklanıyordu. **Graph-based segmentation (Graf-tabanlı segmentasyon)**, probleme tamamen farklı bir açıdan yaklaşır: Görüntüyü bir **graph (graf)** olarak modeller ve segmentasyonu bir **graph cutting (graf kesme)** problemine dönüştürür.

---

## 1. From Image to Graph

Bu yaklaşımda, bir görüntü aşağıdaki gibi bir grafa dönüştürülür:
*   **Nodes (Düğümler):** Görüntüdeki her bir piksel, graf üzerinde bir düğüme (`vertex`) karşılık gelir.
*   **Edges (Kenarlar):** Düğümler (pikseller), birbirleriyle kenarlar (`links`) aracılığıyla bağlanır. Genellikle her piksel sadece komşularıyla veya görüntüdeki diğer tüm piksellerle bağlanabilir.
*   **Weights (Ağırlıklar):** Her bir kenarın bir **ağırlığı** vardır. Bu ağırlık, `w(i, j)`, birbirine bağladığı `i` ve `j` piksellerinin ne kadar **benzer** olduğunu ölçer. Benzerlik genellikle renk, parlaklık ve/veya konum yakınlığına göre hesaplanır.
    *   İki piksel birbirine çok benziyorsa, aralarındaki kenarın ağırlığı **yüksek** olur.
    *   İki piksel birbirinden çok farklıysa, aralarındaki kenarın ağırlığı **düşük** olur.

![Image as a Graph](https://via.placeholder.com/600x300.png?text=Görüntü+->+Piksel+Düğümleriyle+Graf)
*Görsel: Bir görüntüdeki pikseller, aralarındaki benzerliklere göre ağırlıklandırılmış kenarlarla birbirine bağlanan bir graf olarak modellenebilir.*

---

## 2. Segmentation = Graph Cut

Bu graf temsilinde, görüntüyü segmentlere ayırmak, grafı iki veya daha fazla alt grafa bölmek için bazı kenarları "kesmek" anlamına gelir. "İyi" bir segmentasyon, sezgisel olarak şu iki koşulu sağlamalıdır:
1.  Aynı segment içindeki pikseller birbirine çok benzemelidir (yani, segment içi kenar ağırlıkları **yüksek** olmalıdır).
2.  Farklı segmentlerdeki pikseller birbirinden farklı olmalıdır (yani, segmentler arası kenar ağırlıkları **düşük** olmalıdır).

Bu durumda, segmentasyon problemi, grafı öyle bir şekilde kesme problemine dönüşür ki, **kesilen kenarların toplam ağırlığı minimum olsun.**

---

## 3. The Minimum Cut Problem

En basit yaklaşım, grafı ikiye bölen ve kesilen kenarların toplam ağırlığını minimize eden **Minimum Cut**'ı bulmaktır. Verimli algoritmalar bu kesimi hızlıca bulabilir.

Ancak, bu basit yaklaşımın ciddi bir sorunu vardır: Çok küçük ve izole bölgeler (örneğin, gürültüden kaynaklanan tek bir aykırı piksel) oluşturma eğilimindedir. Çünkü tek bir pikseli grubun geri kalanından ayırmak, genellikle sadece birkaç düşük ağırlıklı kenarı kesmeyi gerektirir ve bu da minimum kesim maliyetini verir. Sonuç, genellikle anlamsız ve çok parçalı bir segmentasyondur.

---

## 4. Normalized Cuts

Shi ve Malik (2000), Minimum Cut'ın bu "küçük segment" yanlılığını düzeltmek için **Normalized Cuts** yöntemini önermişlerdir.

Fikir, kesim maliyetini sadece kesilen kenarların toplam ağırlığına göre değil, aynı zamanda ortaya çıkan segmentlerin "büyüklüğüne" göre de **normalize etmektir.** Bir segmentin büyüklüğü, o segmentteki tüm düğümlerden çıkan kenarların toplam ağırlığı olarak tanımlanır.

`Ncut(A, B) = cut(A, B) / assoc(A, V) + cut(A, B) / assoc(B, V)`

*   `cut(A, B)`: A ve B segmentleri arasındaki kenarların toplam ağırlığı (min-cut ile aynı).
*   `assoc(A, V)`: A segmentindeki düğümlerin, grafın tamamıyla (`V`) olan bağlantılarının toplam ağırlığı.

Bu normalizasyon, hem segmentler arası benzerliği (pay) düşük tutan hem de segment içi benzerliği (payda) yüksek tutan, yani daha "dengeli" kesimleri tercih eder.

Bu optimizasyon probleminin çözümü, doğrudan ve verimli bir şekilde bulunamaz, ancak matrisin **eigenvalues and eigenvectors (özdeğer ve özvektörlerini)** içeren bir probleme dönüştürülerek yaklaşık olarak çözülebilir. Bu, yöntemin matematiksel temelini oluşturur ve genellikle görsel olarak çok daha tatmin edici ve tutarlı segmentasyon sonuçları üretir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> `Graph-based segmentation`'da, birbirine renk ve konum olarak çok benzeyen iki piksel arasındaki `edge`'in (kenarın) ağırlığı nasıl olur?</p>
  <div class="quiz-option" data-correct="true">A) Yüksek</div>
  <div class="quiz-option">B) Düşük</div>
  <div class="quiz-option">C) Sıfır</div>
  <div class="quiz-option">D) Negatif</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Kenar ağırlığı, pikseller arasındaki benzerliği temsil eder. Benzerlik ne kadar fazlaysa, ağırlık o kadar yüksek olur. Amaç, bu yüksek ağırlıklı kenarları kesmekten kaçınmaktır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Basit "Minimum Cut" yönteminin, genellikle istenmeyen küçük ve izole segmentler üretmesinin ana nedeni nedir?</p>
  <div class="quiz-option">A) Algoritmanın çok yavaş çalışması.</div>
  <div class="quiz-option">B) Sadece renk bilgisini kullanabilmesi.</div>
  <div class="quiz-option" data-correct="true">C) Kesim maliyetini, ortaya çıkan segmentlerin boyutuna göre normalize etmeden sadece kesilen kenarların toplam ağırlığını minimize etmesi.</div>
  <div class="quiz-option">D) Grafın tamamen bağlı olmasını gerektirmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Minimum Cut, tek bir aykırı pikseli veya küçük bir bölgeyi ayırmanın toplam kesim maliyetini çok düşük yapabildiğini fark eder ve bu tür "önemsiz" kesimleri tercih etme eğilimindedir. Normalized Cuts, bu durumu segment boyutunu da hesaba katarak düzeltir.</p>
  </div>
</div>

