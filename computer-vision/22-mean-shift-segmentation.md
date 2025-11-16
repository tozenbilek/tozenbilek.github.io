---
layout: default
title: Mean-Shift ile Segmentasyon
nav_order: 22
parent: Computer Vision
---

# Mean-Shift ile Segmentasyon

k-means, basit ve hızlı bir kümeleme yöntemi olmasına rağmen, küme sayısını (`k`) önceden bilmemizi gerektirmesi ve sadece küresel şekilli kümeleri bulabilmesi gibi önemli kısıtlamalara sahiptir. **Mean-Shift**, bu sorunların üstesinden gelen, küme sayısını otomatik olarak bulan, esnek ve güçlü bir yaklaşımdır.

---

## 1. Ana Fikir: Yoğunluk Tepelerini (Modes) Bulma

Mean-Shift'in temel amacı, bir tepe tırmanma (`hill-climbing`) algoritması gibi çalışarak, özellik uzayındaki **yoğunluk tepe noktalarını (modes)** bulmaktır. Özellik uzayını engebeli bir arazi gibi düşünün; her bir piksel bu arazide bir noktadır. Mean-Shift, her bir noktadan başlayarak, sürekli olarak yokuş yukarı, en yoğun bölgeye doğru hareket ederek en yakındaki zirveyi bulur.

Bu yaklaşımın en büyük avantajı, küme sayısını önceden belirlememize gerek olmamasıdır. Algoritma, veri dağılımında doğal olarak kaç tane yoğunluk zirvesi varsa o kadar küme bulur.

---

## 2. Mean-Shift Algoritması

Mean-Shift, her bir veri noktası (piksel) için basit ve iteratif bir süreç izler:

1.  **Başla:** Analiz edilecek bir piksel ve bu pikseli merkez alan belirli bir yarıçapa (`bandwidth`) sahip bir **arama penceresi** seç.
2.  **Hesapla:** Pencerenin içine düşen tüm piksellerin ortalama konumunu ("kütle merkezini") hesapla.
3.  **Kaydır:** Arama penceresinin merkezini, az önce hesapladığın bu kütle merkezine kaydır.
4.  **Tekrarla:** Pencere artık hareket etmeyene (yani bir yoğunluk zirvesine yerleşene) kadar 2. ve 3. adımları tekrarla.

Bu "tepeye tırmanma" işlemi, özellik uzayındaki her bir piksel için (veya işlem hızlandırmak için rastgele seçilen bir alt kümesi için) tekrarlanır.

![Mean-Shift Algorithm](https://via.placeholder.com/600x300.png?text=Pencere+->+Kütle+Merkezini+Bul+->+Oraya+Kay)
*Görsel: Mean-Shift algoritmasının bir iterasyonu. Arama penceresi (mavi daire), içindeki noktaların kütle merkezine (sarı nokta) doğru kaydırılır ve bu işlem tepeye ulaşana kadar tekrarlanır.*

---

## 3. Kümeleme ve Sonuç

Tüm başlangıç pikselleri için bu kaydırma süreci tamamlandığında, aynı veya birbirine çok yakın bir tepe noktasına ulaşan tüm pikseller, aynı kümenin üyesi olarak kabul edilir. Bu kümelere rastgele bir renk atanarak, son segmentasyon haritası oluşturulur.

Özellik uzayı olarak sadece renk (`RGB`) yerine, renk ve konumu (`L*u*v* + x*y`) birleştiren 5 boyutlu bir uzay kullanmak, hem rengi hem de konumu birbirine yakın olan piksellerin aynı segmentte gruplanmasını sağlar, bu da genellikle görsel olarak daha tutarlı sonuçlar verir.

---

## 4. Bandwidth Parametresinin Etkisi

Mean-Shift'in tek ve en kritik parametresi **bandwidth**'tir (pencere yarıçapı). Bu parametrenin seçimi, segmentasyon sonucunu büyük ölçüde etkiler:

*   **Küçük Bandwidth:** Algoritma, sadece çok yerel yoğunluk değişimlerine odaklanır. Bu, görüntüde çok sayıda küçük ve detaylı segment bulunmasına yol açabilir (**over-segmentation** - aşırı segmentasyon).
*   **Büyük Bandwidth:** Algoritma, daha geniş bir alandaki yoğunlukları ortalamaya meyillidir. Bu, birbirinden ayrı olan nesnelerin veya bölgelerin yanlışlıkla tek bir segment olarak birleştirilmesine neden olabilir (**under-segmentation** - eksik segmentasyon).

Doğru `bandwidth`'i seçmek, genellikle deneme-yanılma gerektiren, probleme özgü bir adımdır.

---

## 5. Mean-Shift Artıları ve Eksileri

**Artıları:**
*   **Küme Sayısını Otomatik Bulur:** `k` değerini önceden belirlemeye gerek yoktur.
*   **Keyfi Şekilli Kümelere İzin Verir:** k-means gibi küresel küme varsayımı yapmaz, veri dağılımındaki karmaşık şekilleri bulabilir.
*   **Başlangıç Değerlerine Dayanıklıdır:** Sonuç, başlangıç noktalarından büyük ölçüde etkilenmez.

**Eksileri:**
*   **Bandwidth (Pencere Boyutu) Seçimi:** Algoritmanın performansı, seçilen arama penceresinin boyutuna oldukça duyarlıdır. Bu parametrenin doğru ayarlanması kritik ve zordur.
*   **Hesaplama Maliyeti:** Özellikle yüksek boyutlu özellik uzaylarında ve büyük veri setlerinde k-means'e göre daha yavaş çalışabilir.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> Mean-Shift algoritmasının k-means'e göre en temel avantajı nedir?</p>
  <div class="quiz-option">A) Daha hızlı çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Küme sayısını (`k`) önceden bilmeyi gerektirmemesi.</div>
  <div class="quiz-option">C) Daha az bellek kullanması.</div>
  <div class="quiz-option">D) Sadece küresel kümeler bulması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Mean-Shift, veri dağılımındaki yoğunluk tepe noktalarını (`modes`) arar ve bu tepe noktalarının sayısı, verinin doğal küme sayısını belirler. Bu, `k` değerini tahmin etme zorunluluğunu ortadan kaldırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Mean-Shift algoritmasının çıktısını en çok etkileyen ve kullanıcı tarafından ayarlanması gereken ana parametre nedir?</p>
  <div class="quiz-option">A) Küme sayısı (`k`).</div>
  <div class="quiz-option">B) İterasyon sayısı.</div>
  <div class="quiz-option" data-correct="true">C) `Bandwidth` (arama penceresinin boyutu).</div>
  <div class="quiz-option">D) Küme merkezlerinin başlangıç konumu.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Pencere boyutu, algoritmanın hangi ölçekteki yoğunluk değişimlerine odaklanacağını belirler. Çok küçük bir pencere çok fazla küçük küme bulurken, çok büyük bir pencere farklı kümeleri birleştirerek detayları kaybedebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntü segmentasyonu probleminde, Mean-Shift algoritmasının `bandwidth` parametresi çok büyük bir değere ayarlanırsa, en olası sonuç aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Görüntü, her biri tek bir pikselden oluşan milyonlarca segmente ayrılır.</div>
  <div class="quiz-option">B) Algoritma bir tepe noktası bulamaz ve sonsuz döngüye girer.</div>
  <div class="quiz-option" data-correct="true">C) Birbirinden farklı nesneler veya bölgeler (örneğin, bir ormandaki ağaçlar ve çimenler) tek bir segment olarak birleştirilir (under-segmentation).</div>
  <div class="quiz-option">D) Görüntüdeki küçük detaylar çok hassas bir şekilde ayrı segmentlere ayrılır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Çok büyük bir `bandwidth`, algoritmanın çok geniş bir alandaki piksellerin ortalamasını almasına neden olur. Bu, birbirinden ayrı olan ancak özellik uzayında yine de bir miktar yakınlığı olan farklı yoğunluk tepelerini "düzleştirir" ve tek bir büyük tepe gibi algılamasına yol açar. Sonuç olarak, farklı bölgeler yanlışlıkla aynı segmentte birleşir.</p>
  </div>
</div>

