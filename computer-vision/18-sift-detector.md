---
layout: default
title: Ölçek Dayanıklı Özellikler (SIFT Detector)
nav_order: 18
parent: Computer Vision
---

# Ölçek Dayanıklı Özellikler ve SIFT Detector

Harris köşe dedektörü, döndürme gibi dönüşümlere karşı dayanıklı olsa da, en büyük zayıflığı ölçek değişikliklerine karşı hassas olmasıydı. Bir nesneye yaklaştıkça veya uzaklaştıkça, Harris dedektörü aynı noktaları güvenilir bir şekilde bulamaz. **Scale-Invariant Feature Transform (SIFT)**, tam olarak bu sorunu çözen ve modern bilgisayarlı görünün temel taşlarından biri olan bir algoritmadır.

SIFT, sadece "köşeleri" değil, aynı zamanda "blob" (leke) olarak adlandırılabilecek daha genel ve ayırt edici bölgeleri de bulan bir **özellik dedektörüdür**. Bu tespit edilen noktalara **keypoints (anahtar noktalar)** denir. SIFT ayrıca, bu noktaları tanımlayan bir "**descriptor**" (tanımlayıcı) da üreten komple bir sistemdir.

Bu bölümde, SIFT'in ilk adımı olan **ölçek-dayanıklı anahtar nokta tespitini** inceleyeceğiz.

---

## 1. Ölçek Uzayı (Scale-Space) Piramidi

Bir özelliği ölçek değişikliklerine karşı dayanıklı hale getirmek için, o özelliği tek bir ölçekte değil, **tüm olası ölçeklerde** aramak gerekir. SIFT bunu, **ölçek uzayı piramidi** adı verilen bir yapı üzerinde gerçekleştirir.

*   **Oktavlar (Octaves):** Piramidin her bir katmanına "oktav" denir. Her oktava geçildiğinde, görüntü boyutu yarıya indirilir (genişlik ve yükseklik / 2). Bu, büyük ölçekli özellikleri daha verimli bir şekilde aramayı sağlar.
*   **Bulanıklaştırma Seviyeleri:** Her oktav içinde, görüntü farklı `σ` (sigma) değerleri ile giderek artan seviyelerde Gaussian filtresiyle bulanıklaştırılır.

Bu yapı sayesinde, bir özellik (örneğin bir araba tekerleği) uzaktan çekilmiş küçük bir görüntüde piramidin üst katmanlarındaki (düşük çözünürlüklü) bir ölçekte bulunurken, yakından çekilmiş büyük bir görüntüde piramidin alt katmanlarındaki (yüksek çözünürlüklü) bir ölçekte bulunabilir.

<pre>
Ölçek Uzayı Piramidi Yapısı:

Oktav 2 (Görüntü / 2)
  - Görüntü (σ)
  - Görüntü (k*σ)
  - Görüntü (k²*σ)
  - ...
Oktav 1 (Orijinal Görüntü)
  - Görüntü (σ)
  - Görüntü (k*σ)
  - Görüntü (k²*σ)
  - ...
</pre>

---

## 2. Karakteristik Ölçeği Bulmak: Difference of Gaussians (DoG)

Bir noktanın en "karakteristik" olduğu ölçeği bulmak, o noktayı merkez alan bir "blob"un (lekenin) en belirgin olduğu ölçeği bulmak anlamına gelir. Bunun için ideal operatör **Laplacian of Gaussian (LoG)**'dır, ancak hesaplaması yavaştır.

SIFT, LoG'a çok hızlı bir yaklaşım olan **Difference of Gaussians (DoG)** yöntemini kullanır. Bu yöntem, ölçek uzayındaki ardışık Gaussian bulanıklaştırılmış görüntülerin birbirinden çıkarılmasıyla elde edilir.

**Sezgisel olarak:** Bir görüntüyü biraz bulanıklaştırıp, sonra onu daha da fazla bulanıklaştırılmış halinden çıkardığınızda, aradaki fark tam olarak o "biraz"lık bulanıklığın en çok etkilediği, yani ortasında bir "leke" veya "köşe" olan bölgelerde maksimum olur. DoG piramidindeki bu tepe noktaları (maksimum veya minimumlar), bize blob benzeri yapıların merkezlerini ve karakteristik ölçeklerini verir.

---

## 3. Keypoint Localization (Anahtar Nokta Tespiti)

Bir noktanın "keypoint" adayı olabilmesi için, sadece kendi 2D komşularına göre değil, aynı zamanda ölçek olarak bir alt ve bir üst seviyedeki komşularına göre de bir tepe noktası (maksimum veya minimum) olması gerekir.

Bu, bir pikselin, kendi DoG görüntüsündeki 8 komşusuyla VE bir alttaki ve bir üstteki DoG görüntülerindeki 9'ar komşusuyla, yani **toplam 26 komşuyla** karşılaştırılması anlamına gelir. Eğer bu 3x3x3'lük komşuluk bloğunun merkezindeki piksel en büyük veya en küçük değere sahipse, o piksel ve ait olduğu ölçek bir anahtar nokta adayı olarak kaydedilir.

<pre>
       Üst Ölçek (9 komşu)
             /
Orta Ölçek (8 komşu) --- [Piksel]
             \
       Alt Ölçek (9 komşu)
</pre>

---

## 4. Anahtar Noktaları Filtreleme

Bu işlemle çok sayıda anahtar nokta adayı bulunur. Bunları daha gürbüz (robust) hale getirmek için iki filtreleme adımı uygulanır:
1.  **Düşük Kontrastlı Noktaların Elenmesi:** Tepe noktasının değeri belirli bir eşikten düşükse, bu noktanın gürültüden kaynaklanma ihtimali yüksek olduğu için elenir.
2.  **Kenar Noktalarının Elenmesi:** DoG operatörü, kenarlarda da güçlü bir yanıt verir. Ancak kenarlar, kenar boyunca belirsizlik taşıdıkları için iyi özellikler değildir. Harris köşe dedektöründekine benzer bir prensiple, bir noktanın bir kenar üzerinde olup olmadığı kontrol edilir ve eğer öyleyse elenir.

Bu adımların sonunda, ölçek değişikliklerine karşı dayanıklı, stabil ve iyi yerelleştirilmiş bir anahtar nokta seti elde edilir. Her bir anahtar nokta, bir `(x, y)` konumu ve bir `σ` (sigma) ölçek bilgisi içerir. Bir sonraki adım, bu noktalara döndürme-dayanıklı bir yönelim atamak ve ayırt edici bir tanımlayıcı (descriptor) oluşturmaktır.

---

## Test Soruları

<div class="quiz-question">
  <p><b>Soru:</b> SIFT algoritmasının `scale invariance` (ölçek dayanıklılığını) sağlamak için kullandığı temel yapı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Farklı seviyelerde bulanıklaştırılmış ve yeniden boyutlandırılmış görüntülerden oluşan bir ölçek uzayı piramidi.</div>
  <div class="quiz-option">B) Görüntünün sadece x ve y türevlerini kullanmak.</div>
  <div class="quiz-option">C) Görüntüyü kutupsal koordinatlara çevirmek.</div>
  <div class="quiz-option">D) Sadece renkli pikselleri analiz etmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> SIFT, özellikleri tek bir ölçekte aramak yerine, farklı ölçeklerden oluşan bir "piramit" üzerinde arar. Bu sayede, bir nesne büyüdüğünde veya küçüldüğünde, o nesneye ait özellikler piramidin farklı bir seviyesinde ama yine de tespit edilebilir olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> SIFT'te, ölçek uzayındaki "`blob`" (leke) benzeri ilginç bölgeleri verimli bir şekilde bulmak için hangi yöntem kullanılır?</p>
  <div class="quiz-option">A) Harris Köşe Dedektörü</div>
  <div class="quiz-option">B) Canny Kenar Dedektörü</div>
  <div class="quiz-option" data-correct="true">C) Difference of Gaussians (DoG)</div>
  <div class="quiz-option">D) Hough Dönüşümü</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> DoG, farklı Gaussian seviyeleriyle bulanıklaştırılmış iki görüntünün farkını alarak, yavaş olan Laplacian of Gaussian (LoG) operatörüne hızlı ve etkili bir yaklaşım sunar. DoG'nin tepe noktaları, karakteristik ölçekteki "`blob`"ları işaret eder.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir SIFT anahtar noktası (keypoint) hangi bilgileri içerir?</p>
  <div class="quiz-option">A) Sadece pikselin (x, y) koordinatları.</div>
  <div class="quiz-option">B) Sadece ait olduğu ölçek (σ) bilgisi.</div>
  <div class="quiz-option" data-correct="true">C) Hem (x, y) koordinatları hem de ait olduğu ölçek (σ) bilgisi.</div>
  <div class="quiz-option">D) Sadece pikselin renk değeri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir SIFT anahtar noktasını özel kılan şey, sadece konumunu değil, aynı zamanda en "karakteristik" olduğu ölçeği de saklamasıdır. Bu ölçek bilgisi, ölçek dayanıklılığının temelini oluşturur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> SIFT anahtar noktası adayları arasında "kenar noktalarının elenmesi" adımının sebebi nedir?</p>
  <div class="quiz-option">A) Kenarların görüntülerde nadiren bulunması.</div>
  <div class="quiz-option">B) Kenarların hesaplanmasının çok yavaş olması.</div>
  <div class="quiz-option" data-correct="true">C) Kenarların, kenar boyunca belirsizlik taşıması ve bu nedenle eşleştirme için ayırt edici olmaması.</div>
  <div class="quiz-option">D) Kenarların sadece siyah-beyaz görüntülerde bulunması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Difference of Gaussians (DoG) operatörü, "blob"lar kadar kenarlarda da güçlü bir tepki üretir. Ancak bir kenar üzerindeki bir nokta, kenar çizgisi boyunca diğer noktalardan ayırt edilemez. Bu belirsizliği ortadan kaldırmak ve sadece stabil, köşeye benzer noktaları tutmak için kenarlar elenir.</p>
  </div>
</div>

