---
layout: default
title: Scale-Invariant Özellikler ve SIFT Detector
nav_order: 18
parent: Computer Vision
---

# Scale-Invariant Özellikler ve SIFT Detector

Harris köşe dedektörü, döndürme gibi dönüşümlere karşı dayanıklı olsa da, en büyük zayıflığı ölçek değişikliklerine karşı hassas olmasıydı. Bir nesneye yaklaştıkça veya uzaklaştıkça, Harris dedektörü aynı noktaları güvenilir bir şekilde bulamaz. **Scale-Invariant Feature Transform (SIFT)**, tam olarak bu sorunu çözmek için geliştirilmiştir.

SIFT, sadece bir köşe dedektörü değil, aynı zamanda bu noktaları tanımlayan bir "**descriptor**" (tanımlayıcı) da üreten komple bir sistemdir. Bu bölümde, SIFT'in ilk adımı olan **scale-invariant keypoint detection (ölçek-dayanıklı anahtar nokta tespitini)** inceleyeceğiz.

---

## 1. Ölçek Problemini Çözme Fikri

Bir özelliği ölçek değişikliklerine karşı dayanıklı hale getirmek için, o özelliği tek bir ölçekte değil, **tüm olası ölçeklerde** aramız gerekir. Fikir şudur:
1.  Orijinal görüntünün farklı seviyelerde bulanıklaştırılmış (`smoothed`) ve yeniden boyutlandırılmış versiyonlarından oluşan bir **scale-space pyramid (ölçek uzayı piramidi)** oluşturulur.
2.  Her bir nokta için, bu ölçek uzayında en "ilginç" veya "karakteristik" olduğu bir ölçek bulunur. Örneğin, bir insan yüzünü arıyorsak, gözler ve burun gibi küçük detaylar daha ince ölçeklerde, yüzün genel şekli ise daha kaba ölçeklerde belirgin olacaktır.
3.  Bir nokta, kendi karakteristik ölçeğinde tespit edildiğinde, o ölçek bilgisiyle birlikte saklanır. Bu sayede, aynı nesnenin daha büyük bir görüntüsünde, aynı nokta daha kaba bir ölçekte ama yine de tespit edilebilir olur.

![Scale Space Pyramid](https://via.placeholder.com/600x300.png?text=Görüntü+Piramidi+ve+Gaussian+Bulanıklaştırma)
*Görsel: Görüntünün farklı boyutlarda (`octaves`) ve her boyutta farklı seviyelerde Gaussian filtresiyle bulanıklaştırılmasıyla bir ölçek uzayı oluşturulur.*

---

## 2. Karakteristik Ölçeği Bulmak: Difference of Gaussians (DoG)

Peki bir noktanın en "karakteristik" olduğu ölçeği nasıl buluruz? Bunun için, "`blob`" (leke) benzeri yapıları en iyi şekilde vurgulayan bir operatöre ihtiyacımız var. İdeal operatör **Laplacian of Gaussian (LoG)**'dır, ancak hesaplaması yavaştır.

SIFT'in yazarı David Lowe, LoG'un, farklı seviyelerde Gaussian ile bulanıklaştırılmış iki görüntünün farkı alınarak (yani **Difference of Gaussians - DoG**) çok verimli bir şekilde yaklaşılabileceğini göstermiştir.

DoG piramidi, ölçek uzayı piramidindeki ardışık bulanıklaştırılmış görüntülerin birbirinden çıkarılmasıyla elde edilir. Bu DoG görüntülerindeki tepe noktaları (maksimum veya minimumlar), LoG operatörünün tepe noktalarına karşılık gelir ve bize blob benzeri yapıların merkezlerini ve karakteristik ölçeklerini verir.

---

## 3. Keypoint Localization (Anahtar Nokta Tespiti)

Bir noktanın "`keypoint`" (anahtar nokta) olarak kabul edilmesi için, sadece kendi 2D komşularına göre değil, aynı zamanda ölçek olarak bir alt ve bir üst seviyedeki komşularına göre de bir tepe noktası (maksimum veya minimum) olması gerekir.

Yani, bir piksel, kendi DoG görüntüsündeki 8 komşusuyla VE bir alttaki ve bir üstteki DoG görüntülerindeki 9'ar komşusuyla (toplam 26 komşu) karşılaştırılır. Eğer bu 26 komşunun hepsinden daha büyük veya daha küçük bir değere sahipse, bir anahtar nokta adayı olarak işaretlenir.

---

## 4. Anahtar Noktaları Filtreleme

Bu işlemle çok sayıda anahtar nokta adayı bulunur. Bunları daha gürbüz (robust) hale getirmek için iki filtreleme adımı uygulanır:
1.  **Düşük Kontrastlı Noktaların Elenmesi:** Tepe noktasının değeri belirli bir eşikten düşükse, bu noktanın gürültüden kaynaklanma ihtimali yüksek olduğu için elenir.
2.  **Kenar Noktalarının Elenmesi:** DoG operatörü, kenarlarda da güçlü bir yanıt verir. Ancak kenarlar, kenar boyunca belirsizlik taşıdıkları için iyi özellikler değildir. Harris köşe dedektöründekine benzer bir prensiple, bir noktanın bir kenar üzerinde olup olmadığı kontrol edilir ve eğer öyleyse elenir.

Bu adımların sonunda, ölçek değişikliklerine karşı dayanıklı, stabil ve iyi yerelleştirilmiş bir anahtar nokta seti elde edilir. Bir sonraki adım, bu noktalara döndürme-dayanıklı bir yönelim atamak ve ayırt edici bir tanımlayıcı (descriptor) oluşturmaktır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> SIFT algoritmasının `scale invariance` (ölçek dayanıklılığını) sağlamak için kullandığı temel yapı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Farklı seviyelerde bulanıklaştırılmış ve yeniden boyutlandırılmış görüntülerden oluşan bir ölçek uzayı piramidi.</div>
  <div class="quiz-option">B) Görüntünün sadece x ve y türevlerini kullanmak.</div>
  <div class="quiz-option">C) Görüntüyü kutupsal koordinatlara çevirmek.</div>
  <div class="quiz-option">D) Sadece renkli pikselleri analiz etmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> SIFT, özellikleri tek bir ölçekte aramak yerine, farklı ölçeklerden oluşan bir "piramit" üzerinde arar. Bu sayede, bir nesne büyüdüğünde veya küçüldüğünde, o nesneye ait özellikler piramidin farklı bir seviyesinde ama yine de tespit edilebilir olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> SIFT'te, ölçek uzayındaki "`blob`" (leke) benzeri ilginç bölgeleri verimli bir şekilde bulmak için hangi yöntem kullanılır?</p>
  <div class="quiz-option">A) Harris Köşe Dedektörü</div>
  <div class="quiz-option">B) Canny Kenar Dedektörü</div>
  <div class="quiz-option" data-correct="true">C) Difference of Gaussians (DoG)</div>
  <div class="quiz-option">D) Hough Dönüşümü</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> DoG, farklı Gaussian seviyeleriyle bulanıklaştırılmış iki görüntünün farkını alarak, yavaş olan Laplacian of Gaussian (LoG) operatörüne hızlı ve etkili bir yaklaşım sunar. DoG'nin tepe noktaları, karakteristik ölçekteki "`blob`"ları işaret eder.</p>
  </div>
</div>

