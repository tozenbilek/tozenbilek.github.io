---
layout: default
title: Stereo Vision ve Derinlik Algılama
nav_order: 16
parent: Computer Vision
---

# Stereo Vision ve Derinlik Algılama

Tek bir 2D görüntü, bir 3D sahnenin düzleme yansıtılmış halidir ve bu süreçte "derinlik" bilgisi kaybolur. Stereo Vision, insan görüşünü taklit ederek, hafifçe farklı iki bakış açısından çekilmiş iki görüntü kullanarak bu kayıp derinlik bilgisini yeniden yapılandırma problemidir. Nihai amaç genellikle, her pikselin kameraya olan uzaklığını içeren bir **derinlik haritası (depth map)** oluşturmaktır.

---

## 1. Temel Fikir: Disparity (Eşitsizlik)

İki kamera, dünyayı birbirinden yatay olarak hafifçe kaydırılmış iki farklı bakış açısından görür. Bir 3D noktasının sol ve sağ görüntülerdeki piksellerinin konumları arasındaki bu yatay farka **Disparity (Eşitsizlik)** denir.

*   **Yakındaki nesneler**, iki gözün görüntülerinde birbirine göre daha fazla kaymış görünür (yüksek `disparity`).
*   **Uzaktaki nesneler**, iki gözün görüntülerinde neredeyse aynı konumda görünür (düşük `disparity`).

---

## 2. Disparity ve Derinlik

İdeal (düzeltilmiş - rectified) bir stereo sistemde, iki kamera birbirine mükemmel paraleldir ve aynı yatay hizada yer alır. Bu durumda, bir `P` noktasının derinliği (`Z`) ile `disparity`'si (`d`) arasında basit ve güçlü bir ters orantı ilişkisi vardır:

`Z = (f * B) / d`

*   `Z`: Noktanın kameraya olan derinliği (uzaklığı).
*   `f`: Kameraların odak uzaklığı (içsel parametre).
*   `B`: Kameralar arasındaki mesafe (`baseline`).
*   `d`: Disparity (`x_sol - x_sağ`).

Bu denklem, eğer bir noktanın iki görüntü arasındaki piksel kaymasını (`d`) bulabilirsek, o noktanın derinliğini (`Z`) doğrudan hesaplayabileceğimizi gösterir.

<pre>
Disparity Örneği:

Sol Görüntü:       Sağ Görüntü:
P noktası (x=150)   P noktası (x=100)

Disparity (d) = x_sol - x_sağ = 150 - 100 = 50 piksel

Eğer f=1000 piksel ve B=0.1 metre ise:
Derinlik (Z) = (1000 * 0.1) / 50 = 2 metre
</pre>

---

## 3. Epipolar Geometri

Peki, sol görüntüdeki bir `p` pikselinin sağ görüntüdeki karşılığı `p'` nerede olabilir? `p'` pikseli, sağ görüntünün tamamında rastgele bir yerde olamaz. İki kameranın geometrisi, `p'`'nin nerede olabileceğini sınırlar. Bu kısıtlamaları tanımlayan geometriye **Epipolar Geometry** denir.

*   **Epipolar Line (Epipolar Çizgi):** Sol görüntüdeki bir `p` noktası için, sağ görüntüdeki karşılığı `p'`'nin üzerinde bulunmak zorunda olduğu çizgiye denir.
*   **Epipolar Constraint (Epipolar Kısıtlama):** Bu kısıtlama sayesinde, bir pikselin karşılığını arama problemi, tüm 2D görüntü yüzeyinden **1D bir çizgiye** indirgenir. Bu, arama işlemini çok büyük ölçüde basitleştirir ve hızlandırır.
*   **Rectification (Düzeltme):** Gerçek dünyada kameralar nadiren mükemmel paraleldir. Bu nedenle, stereo eşleştirmeden önce bir ön işleme adımı olan **rectification** uygulanır. Bu işlem, iki görüntüyü de sanki mükemmel paralel kameralardan çekilmiş gibi matematiksel olarak "döndürür". Sonuç olarak, tüm epipolar çizgiler görüntünün tarama çizgileriyle aynı, yani **yatay** hale gelir.

---

## 4. Stereo Eşleştirme (Correspondence) Problemi ve Algoritmalar

Stereo Vision'ın kalbindeki en zorlu problem şudur: Sol görüntüdeki her bir piksel için, sağ görüntüdeki yatay epipolar çizgi üzerinde ona karşılık gelen doğru pikseli bulmak.

Bir stereo algoritması genellikle şu adımları izler:
1.  **Rectification:** Görüntüleri, epipolar çizgiler yatay olacak şekilde düzelt.
2.  **Eşleştirme Maliyeti Hesaplama:** Sol görüntüdeki bir pikseli merkez alan küçük bir pencere (örn: 7x7) ile sağ görüntüdeki epipolar çizgi üzerindeki her olası `disparity` değeri için bir "benzememe" maliyeti (`Sum of Squared Differences - SSD` gibi) hesapla.
3.  **Disparity Optimizasyonu:** Her piksel için en düşük maliyeti veren `disparity` değerini seç. Daha gelişmiş algoritmalar bu adımda, komşu piksellerin `disparity`'lerinin de benzer olması gerektiği (pürüzsüzlük kısıtı) gibi ek bilgileri kullanarak daha tutarlı ve doğru bir `disparity` haritası oluşturur (örn: Dynamic Programming, Graph Cuts).

Bu problemin zorlukları:
*   **Dokusuz Alanlar:** Beyaz bir duvar gibi tekdüze bölgelerde, tüm pencere bölgeleri birbirine benzeyeceği için doğru eşleşmeyi bulmak (ambiguity) zordur.
*   **Occlusion (Tıkanma):** Bir gözün gördüğü bir nokta, diğeri tarafından (örneğin bir nesnenin arkasında kaldığı için) görülemeyebilir.
*   **Tekrarlayan Desenler:** Bir çit veya tuğla duvar gibi tekrarlayan dokular, birden fazla olası (yanlış) eşleşmeye yol açabilir.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> Stereo vision sisteminde, bir nesne kameralara ne kadar yakınsa, `disparity`'si o kadar ... olur.</p>
  <div class="quiz-option" data-correct="true">A) büyük</div>
  <div class="quiz-option">B) küçük</div>
  <div class="quiz-option">C) negatif</div>
  <div class="quiz-option">D) değişmez</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> `Disparity`, bir noktanın iki görüntü arasındaki konum farkıdır. Nesneler yaklaştıkça, bu konum farkı artar. Derinlik ile `disparity` arasında ters orantı vardır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> `Epipolar constraint`'in (epipolar kısıtlama) stereo eşleştirme problemine sağladığı en büyük avantaj nedir?</p>
  <div class="quiz-option">A) Görüntülerdeki gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Kameranın içsel parametrelerini bulmak.</div>
  <div class="quiz-option" data-correct="true">C) Bir pikselin karşılığını arama problemini 2D bir alandan 1D bir çizgiye indirgemek.</div>
  <div class="quiz-option">D) Görüntülerin parlaklığını eşitlemek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki kameranın geometrisi sayesinde, sol görüntüdeki bir noktanın sağ görüntüdeki karşılığı, tüm görüntüde değil, "epipolar çizgi" adı verilen belirli bir çizgi üzerinde olmak zorundadır. Bu, arama uzayını dramatik bir şekilde küçültür.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Stereo vision algoritmalarında "rectification" (düzeltme) adımının temel amacı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Epipolar çizgileri yatay hale getirerek eşleştirme aramasını basitleştirmek.</div>
  <div class="quiz-option">B) Görüntülerdeki lens bozulmalarını (distorsiyon) düzeltmek.</div>
  <div class="quiz-option">C) İki görüntünün renklerini ve parlaklıklarını eşitlemek.</div>
  <div class="quiz-option">D) Görüntülerin çözünürlüğünü artırmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Rectification, iki görüntüyü de sanki mükemmel paralel ve aynı hizada olan kameralardan çekilmiş gibi yeniden yansıtır. Bu işlemin sonucunda, sol görüntüdeki bir pikselin sağ görüntüdeki karşılığı aynı satır üzerinde (yatay epipolar çizgi) yer alır, bu da 1D arama yapmayı mümkün kılar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Stereo eşleştirme algoritması, aşağıdaki yüzeylerden hangisinde en çok zorlanır ve en hatalı derinlik haritasını üretir?</p>
  <div class="quiz-option">A) Üzerinde gazete kağıdı serilmiş bir masa.</div>
  <div class="quiz-option" data-correct="true">B) Boyanmış, desensiz beyaz bir duvar.</div>
  <div class="quiz-option">C) Çakıl taşlarıyla dolu bir zemin.</div>
  <div class="quiz-option">D) Dikey çizgili bir duvar kağıdı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Dokusuz (textureless) alanlar, stereo eşleştirmenin en büyük zorluklarından biridir. Beyaz bir duvarda, bir pikseli merkez alan bir pencere, epipolar çizgi üzerindeki diğer tüm pencerelerle neredeyse aynı görünecektir. Bu belirsizlik (ambiguity) nedeniyle algoritma doğru eşleşmeyi bulamaz ve hatalı disparity değerleri üretir. Diğer seçenekler, eşleştirme için kullanılabilecek zengin doku veya desenler içerir.</p>
  </div>
</div>

