---
layout: default
title: Canny Kenar Dedektörü
nav_order: 9
parent: Computer Vision
---

# Canny Kenar Dedektörü

Sadece gradyan büyüklüğüne bir eşik değeri uygulamak, genellikle kalın, gürültülü ve kopuk kenarlar üretir. 1986'da John F. Canny tarafından geliştirilen **Canny Kenar Dedektörü**, bu sorunları çözmek için tasarlanmış, günümüzde hala altın standart kabul edilen çok adımlı bir algoritmadır.

Canny'nin hedefi, iyi bir kenar dedektörünün sahip olması gereken üç kriteri optimize etmektir:
1.  **İyi Tespit:** Gerçek kenarları kaçırmamalı, gürültüyü kenar olarak algılamamalı.
2.  **İyi Yerelleştirme (Localization):** Tespit edilen kenar pikselleri, gerçek kenara mümkün olduğunca yakın olmalı.
3.  **Tek Yanıt (Single Response):** Gerçekteki tek bir kenar için sadece tek piksellik ince bir çizgi üretmeli.

Bu hedeflere ulaşmak için algoritma, dört ana adımdan oluşur:

<pre>
[Görüntü] -> 1. Gaussian Blur -> [Bulanık Görüntü] -> 2. Gradyanları Bul -> [Güç & Yön Haritası] -> 3. Non-Max Suppression -> [İnceltilmiş Kenarlar] -> 4. Hysteresis -> [Nihai Kenar Haritası]
</pre>

---

## 1. Adım: Gürültü Azaltma (Gaussian Blur)

İlk adım, görüntüyü bir **Gaussian filtresi** ile pürüzsüzleştirerek, türev adımında güçlenecek olan gürültüyü bastırmaktır. Kullanılan `sigma` değeri, tespit edilecek kenarların ölçeğini etkiler (yüksek `sigma` ana hatları, düşük `sigma` ince detayları bulur).

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüdeki çok ince detaylı kenarları (örneğin, bir kumaşın dokusu) tespit etmek isteyen birisi, Canny algoritmasının ilk adımındaki Gaussian filtresinin `sigma` değerini nasıl ayarlamalıdır?</p>
  <div class="quiz-option">A) Mümkün olan en yüksek değere ayarlamalıdır.</div>
  <div class="quiz-option" data-correct="true">B) Düşük bir değere ayarlamalı veya bu adımı atlamalıdır.</div>
  <div class="quiz-option">C) `sigma` değerinin bu durumla bir ilgisi yoktur.</div>
  <div class="quiz-option">D) Görüntünün boyutuna göre ayarlamalıdır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Yüksek `sigma` değeri, güçlü bir bulanıklaştırma anlamına gelir ve bu da ince detayların kaybolmasına neden olur. İnce detayları korumak için daha az bulanıklaştırma yapan düşük bir `sigma` değeri tercih edilmelidir.</p>
  </div>
</div>

---

## 2. Adım: Görüntü Gradyanını Bulma (Sobel)

Gürültüsü azaltılmış görüntü üzerinde, **Sobel filtresi** gibi bir operatörle her piksel için bir **gradient magnitude (kenar gücü)** ve bir **gradient orientation (kenar yönü)** hesaplanır.

<div class="quiz-question">
  <p><b>Soru:</b> Canny algoritmasının ikinci adımı tamamlandığında, sonraki adımlarda kullanılmak üzere her piksel için hangi iki temel bilgi hesaplanmış olur?</p>
  <div class="quiz-option">A) Pikselin rengi ve parlaklığı.</div>
  <div class="quiz-option">B) Görüntünün en aydınlık ve en karanlık noktaları.</div>
  <div class="quiz-option" data-correct="true">C) Kenarın gücü (magnitude) ve kenarın yönü (orientation).</div>
  <div class="quiz-option">D) Gürültü miktarı ve gürültü türü.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu adım, her pikseldeki yoğunluk değişiminin ne kadar güçlü (magnitude) ve hangi yönde en dik (orientation) olduğunu hesaplar. Sonraki adımlar bu iki bilgiyi kullanarak kenarları inceltir ve seçer.</p>
  </div>
</div>

---

## 3. Adım: Non-Maximum Suppression (Zirve Dışındakileri Bastırma)

Bu adımın amacı, gradyan büyüklüğünün oluşturduğu "kalın sırtları", bir dağ sırasındaki en yüksek zirveleri bulup yamaçları silmeye benzeterek, tek piksellik ince kenarlara dönüştürmektir.

Her piksel için, gradyan yönü boyunca komşusu olan iki pikselin gradyan büyüklükleriyle karşılaştırılır. Eğer pikselin büyüklüğü, bu iki komşusundan da büyük değilse (yani bir "zirve" değilse), değeri sıfırlanır.

<div class="quiz-question">
  <p><b>Soru:</b> Canny kenar dedektöründeki "Non-Maximum Suppression" adımının temel amacı nedir?</p>
  <div class="quiz-option">A) Görüntüdeki gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Kenarların yönünü hesaplamak.</div>
  <div class="quiz-option" data-correct="true">C) Gradyan büyüklüğü tarafından üretilen kalın kenarları incelterek tek piksel genişliğine getirmek.</div>
  <div class="quiz-option">D) Zayıf ve güçlü kenarları birbirine bağlamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu adım, her pikselin gradyan büyüklüğünü kendi gradyan yönündeki komşularıyla karşılaştırır. Eğer piksel bir yerel maksimum değilse, yani en tepe noktası değilse, kenar olarak kabul edilmez ve elenir. Bu, "sırtları" inceltir.</p>
  </div>
</div>

---

## 4. Adım: Hysteresis Thresholding (Çift Eşikle Bağlantı Kurma)

Son adım, hangi piksellerin gerçekten kenar olduğunu belirlemektir. Tek bir eşik yerine, iki eşik (`minVal` ve `maxVal`) kullanan bu akıllıca yöntem, bir dedektif gibi çalışır:

1.  **Kesin Kanıtları Bul:** Gradyan büyüklüğü `maxVal`'den büyük olan her piksel, "kesin kenar" olarak işaretlenir.
2.  **İşe Yaramazları At:** Gradyan büyüklüğü `minVal`'den küçük olan her piksel atılır.
3.  **Şüphelileri Değerlendir:** Büyüklüğü bu iki eşik arasında kalan "zayıf kenar" pikselleri, sadece "kesin kenar" olarak işaretlenmiş bir piksele doğrudan veya dolaylı olarak bağlıysalar nihai kenar haritasına dahil edilirler.

Bu yöntem, güçlü kenarlardan başlayarak onlara bağlı olan zayıf ama anlamlı kenar zincirlerini takip etmeyi sağlar ve gürültüden kaynaklanan izole pikselleri ortadan kaldırır. Sonuç, daha sürekli ve güvenilir kenar haritalarıdır.

<div class="quiz-question">
  <p><b>Soru:</b> Hysteresis Thresholding adımında iki farklı eşik (`minVal` ve `maxVal`) kullanılmasının sebebi nedir?</p>
  <div class="quiz-option">A) Algoritmayı daha hızlı çalıştırmak.</div>
  <div class="quiz-option" data-correct="true">B) Güçlü kenarlara bağlı olan zayıf kenarları da takip ederek kenar kopukluklarını azaltmak.</div>
  <div class="quiz-option">C) Görüntüdeki tüm pikselleri iki kategoriye ayırmak.</div>
  <div class="quiz-option">D) Sadece en güçlü kenarları bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Yüksek eşik (`maxVal`), güvenilir "kesin kenarları" bulur. Düşük eşik (`minVal`) ise, bu kesin kenarlara dokunan "zayıf ama muhtemel" kenarların da zincire dahil edilmesine izin verir. Bu, tek bir eşik kullanıldığında ortaya çıkabilecek kenar kopukluklarını önler.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Canny'nin "İyi Yerelleştirme (Good Localization)" hedefi, algoritmanın hangi adımıyla en doğrudan ilişkilidir?</p>
  <div class="quiz-option">A) Gaussian Blur</div>
  <div class="quiz-option">B) Hysteresis Thresholding</div>
  <div class="quiz-option" data-correct="true">C) Non-Maximum Suppression</div>
  <div class="quiz-option">D) Gradyan Hesaplama</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İyi yerelleştirme, tespit edilen kenarın gerçek kenara olabildiğince yakın ve ince olması demektir. Non-maximum suppression adımı, kalın "sırtları" tek piksellik çizgilere indirgeyerek kenarları hassas bir şekilde yerelleştirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Hysteresis eşikleme adımında, yüksek ve düşük eşik değerleri (`maxVal` ve `minVal`) birbirine çok yakın seçilirse ne olur?</p>
  <div class="quiz-option">A) Görüntüdeki tüm kenarlar bulunur.</div>
  <div class="quiz-option">B) Algoritma daha hızlı çalışır.</div>
  <div class="quiz-option" data-correct="true">C) Algoritmanın davranışı, tek bir eşik değeri kullanmaya çok benzer hale gelir.</div>
  <div class="quiz-option">D) Sadece en zayıf kenarlar bulunur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> İki eşik arasındaki "belirsizlik" bölgesi ortadan kalkar. Pikseller ya neredeyse kesin olarak kenardır ya da kesin olarak kenar değildir. Bu durum, zayıf kenarları güçlü kenarlara bağlama yeteneğini azaltır ve sonuç, tek ve yüksek bir eşik değeri kullanmanın sonucuna yaklaşır (daha fazla kopuk kenar riski).</p>
  </div>
</div>

---

