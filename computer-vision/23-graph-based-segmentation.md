---
layout: default
title: Graf Tabanlı Segmentasyon (Graph-Based Segmentation)
nav_order: 23
parent: Computer Vision
---

# Graf Tabanlı Segmentasyon (Graph-Based Segmentation)

Şimdiye kadar gördüğümüz kümeleme yöntemleri (k-means, Mean-Shift), pikselleri bir özellik uzayında gruplamaya odaklanıyordu. **Graph-based segmentation (Graf-tabanlı segmentasyon)**, probleme tamamen farklı bir açıdan yaklaşır: Görüntüyü bir **graph (çizge)** olarak modeller ve segmentasyonu bir **graph cutting (çizge kesme)** problemine dönüştürür.

---

## 1. Görüntüden Grafa

Bu yaklaşımda, bir görüntü aşağıdaki gibi bir grafa dönüştürülür:
*   **Nodes (Düğümler):** Görüntüdeki her bir piksel, graf üzerinde bir düğüme (`vertex`) karşılık gelir.
*   **Edges (Kenarlar):** Düğümler (pikseller), komşu piksellerle kenarlar (`links`) aracılığıyla bağlanır.
*   **Weights (Ağırlıklar):** Her bir kenarın bir **ağırlığı** vardır. Bu ağırlık, `w(i, j)`, birbirine bağladığı `i` ve `j` piksellerinin ne kadar **benzer** olduğunu ölçer. Benzerlik genellikle renk ve/veya parlaklık farkına göre hesaplanır.
    *   İki piksel birbirine çok benziyorsa (renk farkı azsa), aralarındaki kenarın ağırlığı **yüksek** olur.
    *   İki piksel birbirinden çok farklıysa (renk farkı çoksa), aralarındaki kenarın ağırlığı **düşük** olur.

![Image as a Graph](https://via.placeholder.com/600x300.png?text=Görüntü+->+Piksel+Düğümleriyle+Graf)
*Görsel: Bir görüntüdeki pikseller, aralarındaki benzerliklere göre ağırlıklandırılmış kenarlarla birbirine bağlanan bir graf olarak modellenebilir.*

---

## 2. Segmentasyon = Graf Kesimi

Bu graf temsilinde, görüntüyü segmentlere ayırmak, grafı alt graflara bölmek için bazı kenarları "kesmek" anlamına gelir. İyi bir segmentasyon, sezgisel olarak şu iki koşulu sağlamalıdır:
1.  **Segment içi Benzerlik (Intra-cluster similarity):** Aynı segment içindeki pikseller birbirine çok benzemelidir (yani, segment içi kenar ağırlıkları **yüksek** olmalıdır).
2.  **Segmentler arası Farklılık (Inter-cluster similarity):** Farklı segmentlerdeki pikseller birbirinden farklı olmalıdır (yani, segmentler arası kenar ağırlıkları **düşük** olmalıdır).

Bu durumda, segmentasyon problemi, grafı öyle bir şekilde kesme problemine dönüşür ki, **kesilen kenarların toplam ağırlığı minimum olsun.** Bu, segmentler arasındaki "zayıf" bağlantıları bulup kesmek anlamına gelir.

---

## 3. Minimum Cut Problemi

En basit yaklaşım, grafı ikiye bölen ve kesilen kenarların toplam ağırlığını minimize eden **Minimum Cut**'ı bulmaktır. Verimli algoritmalar bu kesimi hızlıca bulabilir.

**Analoji:** Bir grup insanı iki takıma ayırdığınızı düşünün. Kenar ağırlığı, iki insanın ne kadar iyi arkadaş olduğunu temsil etsin. `Minimum Cut`'ın amacı, en az sayıda arkadaşlığı bozarak grubu ikiye ayırmaktır.

Ancak, bu basit yaklaşımın ciddi bir sorunu vardır: **Küçük ve izole segmentler oluşturma eğilimindedir.** Çünkü algoritma, en iyi arkadaşı olmayan tek bir kişiyi tek başına bir takıma koymanın "en ucuz" çözüm olduğunu fark eder. Görüntüde bu, gürültüden kaynaklanan tek bir aykırı pikseli ayrı bir segment olarak ayırmak anlamına gelir. Bu genellikle anlamsız bir sonuçtur.

---

## 4. Normalized Cuts (Normalleştirilmiş Kesimler)

Shi ve Malik (2000), Minimum Cut'ın bu "küçük segment" yanlılığını düzeltmek için **Normalized Cuts** yöntemini önermişlerdir.

**Analojiye Devam:** `Normalized Cuts`, sadece bozulan arkadaşlıkların sayısını (`cut`) değil, aynı zamanda ortaya çıkan takımların ne kadar "sağlıklı" ve "bağlı" olduğunu da dikkate alır. Bir takımın sağlığı, takım içindeki toplam arkadaşlık miktarıdır (`assoc`). Amaç, hem takımlar arası geçişte az arkadaşlık bozmak hem de ortaya çıkan takımların kendi içlerinde güçlü bağlara sahip olmasını sağlamaktır.

Bu fikir, kesim maliyetini, ortaya çıkan segmentlerin "büyüklüğüne" göre **normalize ederek** matematikselleştirilir:

`Ncut(A, B) = cut(A, B) / assoc(A, V) + cut(A, B) / assoc(B, V)`

*   `cut(A, B)`: A ve B segmentleri arasındaki kenarların toplam ağırlığı (min-cut ile aynı).
*   `assoc(A, V)`: A segmentindeki düğümlerin, grafın tamamıyla (`V`) olan toplam bağlantı ağırlığı (segmentin "büyüklüğü").

Bu normalizasyon, hem segmentler arası benzerliği (pay) düşük tutan hem de segment içi benzerliği (payda) yüksek tutan, yani daha **"dengeli" kesimleri** tercih eder. Bu, tek bir piksel gibi küçük bir segment oluşturmanın maliyetini (paydası çok küçük olacağı için) orantısız bir şekilde artırır ve bu tür kesimleri engeller.

Bu optimizasyon probleminin çözümü, doğrudan ve verimli bir şekilde bulunamaz, ancak matrisin **eigenvalues and eigenvectors (özdeğer ve özvektörlerini)** içeren bir probleme dönüştürülerek yaklaşık olarak çözülebilir. Bu, yöntemin matematiksel temelini oluşturur ve genellikle görsel olarak çok daha tatmin edici ve tutarlı segmentasyon sonuçları üretir.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> `Graph-based segmentation`'da, birbirine renk ve konum olarak çok benzeyen iki piksel arasındaki `edge`'in (kenarın) ağırlığı nasıl olur?</p>
  <div class="quiz-option" data-correct="true">A) Yüksek</div>
  <div class="quiz-option">B) Düşük</div>
  <div class="quiz-option">C) Sıfır</div>
  <div class="quiz-option">D) Negatif</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Kenar ağırlığı, pikseller arasındaki benzerliği temsil eder. Benzerlik ne kadar fazlaysa, ağırlık o kadar yüksek olur. Amaç, bu yüksek ağırlıklı kenarları kesmekten kaçınmaktır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Basit "Minimum Cut" yönteminin, genellikle istenmeyen küçük ve izole segmentler üretmesinin ana nedeni nedir?</p>
  <div class="quiz-option">A) Algoritmanın çok yavaş çalışması.</div>
  <div class="quiz-option">B) Sadece renk bilgisini kullanabilmesi.</div>
  <div class="quiz-option" data-correct="true">C) Kesim maliyetini, ortaya çıkan segmentlerin boyutuna göre normalize etmeden sadece kesilen kenarların toplam ağırlığını minimize etmesi.</div>
  <div class="quiz-option">D) Grafın tamamen bağlı olmasını gerektirmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Minimum Cut, tek bir aykırı pikseli veya küçük bir bölgeyi ayırmanın toplam kesim maliyetini çok düşük yapabildiğini fark eder ve bu tür "önemsiz" kesimleri tercih etme eğilimindedir. Normalized Cuts, bu durumu segment boyutunu da hesaba katarak düzeltir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüde büyük bir mavi gökyüzü bölgesi ve birkaç tane de tekil, parlak beyaz "gürültü" pikseli bulunmaktadır. Bu görüntüye sadece `Minimum Cut` tabanlı bir segmentasyon uygularsak, en olası sonuç ne olur?</p>
  <div class="quiz-option">A) Gökyüzünün tamamı tek bir segment olarak bulunur.</div>
  <div class="quiz-option" data-correct="true">B) Her bir beyaz gürültü pikseli, etrafındaki mavi gökyüzünden ayrılarak tek piksellik küçük segmentler oluşturur.</div>
  <div class="quiz-option">C) Gürültü pikselleri ve gökyüzü tek bir segment olarak birleştirilir.</div>
  <div class="quiz-option">D) Algoritma bir kesim bulamaz.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `Minimum Cut`, kesilen kenarların toplam ağırlığını minimize etmeyi hedefler. Tek bir beyaz pikseli, etrafındaki mavi piksellerden ayırmak, sadece o pikselin komşularıyla olan (ve renk farkından dolayı zaten düşük ağırlıklı olan) kenarlarını kesmeyi gerektirir. Bu "ucuz" bir kesim olduğu için, algoritma bu tür küçük, izole segmentler oluşturmayı tercih eder. `Normalized Cuts` ise bu durumu, ortaya çıkan segmentin "büyüklüğünü" de hesaba katarak engeller.</p>
  </div>
</div>

