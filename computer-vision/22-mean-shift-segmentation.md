---
layout: default
title: Mean-Shift Segmentation
nav_order: 22
parent: Computer Vision
---

# Mean-Shift ile Segmentasyon

k-means, basit ve hızlı bir kümeleme yöntemi olmasına rağmen, küme sayısını (`k`) önceden bilmemizi gerektirmesi ve sadece küresel şekilli kümeleri bulabilmesi gibi önemli kısıtlamalara sahiptir. **Mean-Shift**, bu sorunların üstesinden gelen daha esnek ve güçlü bir yaklaşımdır.

---

## 1. Ana Fikir: Yoğunluk Tepelerini Bulma (Finding Modes)

Mean-Shift'in temel amacı, bir tepe tırmanma (hill-climbing) algoritması gibi çalışarak, özellik uzayındaki **yoğunluk tepe noktalarını (modes)** bulmaktır. Özellik uzayını bir dağ sırası gibi düşünün; pikseller bu dağ sırasının yamaçlarına dağılmış noktalar olsun. Mean-Shift, her bir noktayı (pikseli) alıp, onu yokuş yukarı en yakın zirveye taşıyan bir süreçtir.

Bu yaklaşımın en büyük avantajı, küme sayısını önceden belirlememize gerek olmamasıdır. Algoritma, veri dağılımında doğal olarak kaç tane tepe noktası varsa o kadar küme bulur.

---

## 2. Mean-Shift Algoritması

Mean-Shift, her bir veri noktası (piksel) için iteratif olarak çalışır:

1.  **Başlatma:** Analiz edilecek pikselin özellik uzayındaki konumunu (örneğin `(R,G,B,x,y)` konumu) merkez alan bir arama penceresi (search window) seçilir. Bu pencerenin boyutu (`bandwidth`), algoritmanın tek önemli parametresidir.
2.  **Kütle Merkezini Hesapla:** Arama penceresinin içine düşen tüm piksellerin ortalama konumunu (centroid) hesapla. Bu, pencerenin "kütle merkezi"dir.
3.  **Pencereyi Kaydır:** Arama penceresinin merkezini, 2. adımda hesaplanan bu kütle merkezine kaydır. Bu kaydırma vektörüne **"mean-shift vector"** denir.
4.  **Yakınsayana Kadar Tekrarla:** Pencerenin merkezi artık kaymayı durdurana kadar (yani bir yoğunluk tepe noktasına, zirveye ulaşana kadar) 2. ve 3. adımları tekrarla.

Bu işlem, özellik uzayındaki her bir piksel için (veya rastgele seçilen bir alt kümesi için) tekrarlanır.

![Mean-Shift Algorithm](https://via.placeholder.com/600x300.png?text=Pencere+->+Kütle+Merkezini+Bul+->+Oraya+Kay)
*Görsel: Mean-Shift algoritmasının bir iterasyonu. Arama penceresi (mavi daire), içindeki noktaların kütle merkezine (sarı nokta) doğru kaydırılır ve bu işlem tepeye ulaşana kadar tekrarlanır.*

---

## 3. Kümeleme ve Segmentasyon

Tüm pikseller için bu kaydırma süreci tamamlandığında, aynı veya birbirine çok yakın bir tepe noktasına ("attraction basin") ulaşan tüm pikseller, aynı kümenin üyesi olarak kabul edilir. Bu kümelere rastgele bir renk atanarak, son segmentasyon haritası oluşturulur.

Özellik uzayı olarak sadece renk (`RGB`) yerine, renk ve konumu (`L*u*v* + x*y`) birleştiren 5 boyutlu bir uzay kullanmak, hem rengi hem de konumu birbirine yakın olan piksellerin aynı segmentte gruplanmasını sağlar, bu da genellikle görsel olarak daha tutarlı sonuçlar verir.

---

## 4. Mean-Shift'in Artıları ve Eksileri

**Artıları:**
*   **Küme Sayısını Otomatik Bulur:** `k` değerini önceden belirlemeye gerek yoktur.
*   **Keyfi Şekilli Kümelere İzin Verir:** k-means gibi küresel küme varsayımı yapmaz, veri dağılımındaki karmaşık şekilleri bulabilir.
*   **Başlangıç Değerlerine Dayanıklıdır:** Sonuç, başlangıç noktalarından büyük ölçüde etkilenmez.

**Eksileri:**
*   **Pencere Boyutu (Bandwidth) Seçimi:** Algoritmanın performansı, seçilen arama penceresinin boyutuna oldukça duyarlıdır. Bu parametrenin doğru ayarlanması önemlidir.
*   **Hesaplama Maliyeti:** Özellikle yüksek boyutlu özellik uzaylarında ve büyük veri setlerinde k-means'e göre daha yavaş çalışabilir.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Mean-Shift algoritmasının k-means'e göre en temel avantajı nedir?</p>
  <div class="quiz-option">A) Daha hızlı çalışması.</div>
  <div class="quiz-option" data-correct="true">B) Küme sayısını (`k`) önceden bilmeyi gerektirmemesi.</div>
  <div class="quiz-option">C) Daha az bellek kullanması.</div>
  <div class="quiz-option">D) Sadece küresel kümeler bulması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Mean-Shift, veri dağılımındaki yoğunluk tepe noktalarını (modları) arar ve bu tepe noktalarının sayısı, verinin doğal küme sayısını belirler. Bu, `k` değerini tahmin etme zorunluluğunu ortadan kaldırır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Mean-Shift algoritmasının çıktısını en çok etkileyen ve kullanıcı tarafından ayarlanması gereken ana parametre nedir?</p>
  <div class="quiz-option">A) Küme sayısı (`k`).</div>
  <div class="quiz-option">B) İterasyon sayısı.</div>
  <div class="quiz-option" data-correct="true">C) Arama penceresinin boyutu (bandwidth).</div>
  <div class="quiz-option">D) Küme merkezlerinin başlangıç konumu.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Pencere boyutu, algoritmanın hangi ölçekteki yoğunluk değişimlerine odaklanacağını belirler. Çok küçük bir pencere çok fazla küçük küme bulurken, çok büyük bir pencere farklı kümeleri birleştirerek detayları kaybedebilir.</p>
  </div>
</div>

