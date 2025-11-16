---
layout: default
title: Kenar Tespiti ve Gradyanlar
nav_order: 8
parent: Computer Vision
---

# Kenar Tespiti ve Gradyanlar

Görüntülerdeki nesneleri, şekilleri ve dokuları anlamanın ilk adımı, bu yapıları birbirinden ayıran sınırları, yani **edges (kenarları)** bulmaktır. Kenarlar, bir görüntüdeki yoğunluk değişiminin en belirgin olduğu yerlerdir ve nesnelerin şekli, boyutu ve konumu hakkında kritik bilgiler taşıdıkları için en temel özelliklerden biridir.

---

## 1. Kenar Nedir?

Bir kenar, görüntü fonksiyonunun yoğunluk değerinde ani ve belirgin bir değişikliğin meydana geldiği yerdir. Bu değişiklikler genellikle fiziksel dünyadaki önemli olaylara karşılık gelir:
*   **Nesne Sınırları:** Bir nesnenin bittiği ve arka planın başladığı yer.
*   **Yüzey Yönü Değişiklikleri:** Bir nesnenin yüzeyinin yön değiştirdiği yerler (örneğin, bir küpün köşeleri).
*   **Doku ve Renk Değişiklikleri:** Bir yüzey üzerindeki desen veya renk farklılıkları.

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdakilerden hangisi, bir görüntüde genellikle bir "kenar" olarak algılanmaz?</p>
  <div class="quiz-option">A) Bir binanın duvarının bittiği ve gökyüzünün başladığı yer.</div>
  <div class="quiz-option" data-correct="true">B) Tek renkli, düz bir duvarın ortasındaki bir nokta.</div>
  <div class="quiz-option">C) Bir zebra desenindeki siyah ve beyaz çizgiler arasındaki sınırlar.</div>
  <div class="quiz-option">D) Bir masanın üzerine düşen sert bir gölgenin sınırı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kenarlar, görüntü yoğunluğunda ani değişikliklerin olduğu yerlerdir. Düz, tek renkli bir duvarın ortasında böyle bir değişiklik olmaz, bu nedenle bir kenar bulunmaz.</p>
  </div>
</div>

---

## 2. Kenarları Matematikle Bulmak: Türev ve Gradyan

Görüntü fonksiyonundaki bu "ani değişiklikleri" ölçmek için matematikteki **türev** kavramını kullanırız. Kenarlar, türevin tepe (yüksek pozitif veya negatif) yaptığı noktalara karşılık gelir.

### Görüntü Gradyanı
2D bir görüntü için, bu değişimi **image gradient (`∇I` - görüntü gradyanı)** ile ölçeriz. Gradyanı, bir arazideki en dik yokuş gibi düşünebiliriz:

1.  **Gradient Magnitude (Gradyan Büyüklüğü):** Yokuşun ne kadar dik olduğunu söyler. Görüntüde bu, kenarın ne kadar "güçlü" veya "keskin" olduğunu belirtir.
    `mag(∇I) = sqrt( (∂I/∂x)² + (∂I/∂y)² )`
2.  **Gradient Orientation (Gradyan Yönü):** Yokuşun yönünü (örneğin kuzeydoğu) gösterir. Görüntüde bu, yoğunluğun en hızlı arttığı, yani kenara dik olan yönü gösterir.
    `ori(∇I) = atan2( ∂I/∂y, ∂I/∂x )`

<div class="quiz-question">
  <p><b>Soru:</b> Görüntü gradyanının `magnitude` (büyüklüğü) bize ne ifade eder?</p>
  <div class="quiz-option">A) Kenarın hangi yöne baktığını.</div>
  <div class="quiz-option" data-correct="true">B) Kenarın ne kadar keskin veya güçlü olduğunu.</div>
  <div class="quiz-option">C) Görüntünün genel parlaklığını.</div>
  <div class="quiz-option">D) Pikselin rengini.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gradyan büyüklüğü, görüntü fonksiyonundaki değişim oranının miktarını ölçer. Büyük bir gradyan büyüklüğü, pikseller arasında yüksek bir yoğunluk farkı olduğunu, yani güçlü ve keskin bir kenar bulunduğunu gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüde tam olarak dikey bir kenar (solda karanlık, sağda aydınlık) varsa, bu kenar üzerindeki gradyan vektörlerinin yönü (`orientation`) ağırlıklı olarak hangi yönü gösterir?</p>
  <div class="quiz-option">A) Yukarı</div>
  <div class="quiz-option" data-correct="true">B) Sağ (karanlıktan aydınlığa doğru)</div>
  <div class="quiz-option">C) Sol (aydınlıktan karanlığa doğru)</div>
  <div class="quiz-option">D) Aşağı</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gradyan yönü, yoğunluğun en hızlı arttığı yönü gösterir. Dikey bir kenarda en hızlı değişim yatay yönde (x ekseninde) olur. Solda karanlık (düşük değer) ve sağda aydınlık (yüksek değer) olduğu için, artış yönü sağa doğrudur.</p>
  </div>
</div>

---

## 3. Ayrık Türevler ve Sobel Filtresi

Dijital görüntülerde türevi, **finite differences (sonlu farklar)** prensibine dayanan filtrelerle (kernellerle) yaklaşık olarak hesaplarız.

### Sobel Operatörü
**Sobel operatörü**, gürültüye karşı daha dayanıklı bir türev hesaplaması yapmak için kullanılır. Hem türev almayı hem de bir miktar pürüzsüzleştirme yapmayı birleştiren iki adet 3x3 kernel kullanır:

<pre>
     Sobel X Kernel (Yatay Değişim)      Sobel Y Kernel (Dikey Değişim)
     [[-1, 0, 1],                        [[-1, -2, -1],
      [-2, 0, 2],                         [ 0,  0,  0],
      [-1, 0, 1]]                         [ 1,  2,  1]]
</pre>

Örneğin, Sobel X kerneli yataydaki farkı alırken (`[-2,0,2]`), aynı anda dikey yönde de ağırlıklı bir ortalama (`1,2,1`) yaparak gürültüyü azaltır. Bu kerneller görüntüye ayrı ayrı uygulanarak gradyan bileşenleri (`∂I/∂x` ve `∂I/∂y`) elde edilir.

<div class="quiz-question">
  <p><b>Soru:</b> Sobel operatörünü, `[-1, 1]` gibi basit bir fark filtresine göre daha gürbüz (robust) yapan temel özellik nedir?</p>
  <div class="quiz-option">A) Daha hızlı çalışması.</div>
  <div class="quiz-option">B) Sadece pozitif değerler içermesi.</div>
  <div class="quiz-option" data-correct="true">C) Türev yönündeki farkı alırken, aynı zamanda o yöne dik yönde bir miktar pürüzsüzleştirme (smoothing) yapması.</div>
  <div class="quiz-option">D) Renkli görüntülerde daha iyi çalışması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Örneğin, Sobel X kerneli (yatay türev), merkez satırda `[-2, 0, 2]` farkını alırken, üst ve alt satırlarda `[-1, 0, 1]` farklarını alarak dikey yönde bir ağırlıklı ortalama (smoothing) uygular. Bu, gürültünün etkisini azaltır.</p>
  </div>
</div>

---

## 4. Gürültü Sorunu ve Çözümü

Türev işlemleri, doğası gereği pikseller arasındaki küçük farklılıkları bile vurgular. Bu, ne yazık ki gürültüyü de aşırı derecede güçlendirdikleri anlamına gelir.

**Çözüm:** Türev almadan önce, görüntüyü bir **Gaussian filtresiyle pürüzsüzleştirmek**. Bu ön işleme adımı, gürültüyü bastırır ve sadece daha belirgin, "gerçek" kenarların tespit edilmesini sağlar.

<pre>
[Gürültülü Görüntü] -> [Gaussian Filtresi] -> [Pürüzsüz Görüntü] -> [Sobel Filtresi] -> [Kenar Haritası]
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Kenar tespiti algoritmalarında, türev filtrelerini uygulamadan önce genellikle bir Gaussian filtresi uygulanmasının ana sebebi nedir?</p>
  <div class="quiz-option">A) Görüntüyü keskinleştirmek.</div>
  <div class="quiz-option">B) Görüntüyü renklendirmek.</div>
  <div class="quiz-option" data-correct="true">C) Türev işleminin vurgulayacağı gürültüyü azaltmak.</div>
  <div class="quiz-option">D) Görüntünün boyutunu küçültmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Türev operatörleri, pikseller arasındaki en küçük farkları bile güçlendirir. Bu, gürültünün de kenarlar gibi algılanmasına neden olabilir. Gaussian filtresi ile önceden pürüzsüzleştirme yapmak, bu gürültüyü bastırır ve algoritmanın sadece anlamlı kenarlara odaklanmasını sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Kenar tespiti öncesi uygulanan Gaussian filtresinin `sigma` değeri artırılırsa ne olur?</p>
  <div class="quiz-option">A) Görüntüdeki tüm kenarlar daha keskin hale gelir.</div>
  <div class="quiz-option" data-correct="true">B) İnce detaylar ve küçük kenarlar kaybolur, sadece büyük ve belirgin kenarlar tespit edilir.</div>
  <div class="quiz-option">C) Gürültü miktarı artar.</div>
  <div class="quiz-option">D) Görüntünün renkleri değişir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `sigma` değerini artırmak, daha güçlü bir bulanıklaştırma demektir. Bu işlem, küçük detayları ve gürültüyü ortadan kaldırırken, sadece büyük ölçekli ve belirgin yapıların (ana hatların) kenarlarının kalmasını sağlar.</p>
  </div>
</div>

---

