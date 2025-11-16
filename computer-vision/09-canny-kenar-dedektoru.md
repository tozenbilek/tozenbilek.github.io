---
layout: default
title: Canny Kenar Dedektörü
nav_order: 9
parent: Computer Vision
---

# Canny Kenar Dedektörü

Sadece gradyan büyüklüğüne bir eşik değeri uygulamak, genellikle kalın ve gürültülü kenarlar üretir. 1986'da John F. Canny tarafından geliştirilen **Canny Kenar Dedektörü**, bu sorunları çözmek için tasarlanmış, günümüzde hala en yaygın kullanılan ve en etkili kabul edilen kenar tespit algoritmalarından biridir.

Canny'nin temel hedefi, iyi bir kenar dedektörünün sahip olması gereken üç kriteri optimize etmektir:
1.  **İyi Tespit:** Gerçek kenarları kaçırmamalı ve gürültüyü kenar olarak algılamamalı.
2.  **İyi Yerelleştirme (Localization):** Tespit edilen kenar pikselleri, gerçek kenara mümkün olduğunca yakın olmalı.
3.  **Tek Yanıt:** Gerçekteki tek bir kenar için sadece tek bir piksel yanıtı üretmeli (kenarlar ince olmalı).

Bu hedeflere ulaşmak için algoritma, dört ana adımdan oluşur:

---

## 1. Adım: Gürültü Azaltma

Daha önce öğrendiğimiz gibi, türev işlemleri gürültüye karşı çok hassastır. Bu yüzden ilk adım, görüntüyü bir **Gaussian filtresi** ile pürüzsüzleştirerek gürültüyü bastırmaktır. Kullanılan Gaussian filtresinin boyutu (`sigma`), tespit edilecek kenarların ölçeğini etkiler. Daha büyük `sigma`, daha büyük ölçekli kenarları bulur ama ince detayları kaybedebilir.

---

## 2. Adım: Görüntü Gradyanını Bulma

Gürültüsü azaltılmış görüntü üzerinde, x ve y yönlerindeki gradyanları hesaplamak için **Sobel filtresi** gibi bir türev operatörü uygulanır. Bu adımın sonunda, her piksel için bir **gradyan büyüklüğü (magnitude)** ve bir **gradyan yönü (orientation)** elde edilir.

---

## 3. Adım: Maksimum Olmayanları Bastırma (Non-Maximum Suppression)

Bu adımın amacı, gradyan büyüklüğünün oluşturduğu "kalın sırtları" incelterek tek piksellik kenarlar elde etmektir.
Her piksel için şu işlem yapılır:
1.  Pikselin gradyan yönü incelenir (örneğin, 90 derece ise dikey, 0 derece ise yatay).
2.  Pikselin gradyan büyüklüğü, bu yön boyunca komşusu olan iki pikselin gradyan büyüklükleriyle karşılaştırılır.
3.  Eğer pikselin gradyan büyüklüğü, kendi gradyan yönündeki komşularından daha büyük değilse (yani bir tepe noktası değilse), bu piksel bir kenar parçası olarak kabul edilmez ve değeri sıfırlanır.

![Non-Maximum Suppression](https://via.placeholder.com/600x300.png?text=Kalın+Kenar+->+Gradyan+Yönünde+Kontrol+->+İnce+Kenar)
*Görsel: Non-maximum suppression adımı, kenar sırtlarını incelterek tek piksellik çizgiler haline getirir.*

---

## 4. Adım: Histerezisli Eşikleme (Hysteresis Thresholding)

Son adım, hangi piksellerin gerçekten kenar olduğunu belirlemektir. Tek bir eşik değeri kullanmak, gürültü nedeniyle kopuk kenarlara yol açabilir. Canny, bunun yerine iki eşik değeri (`minVal` ve `maxVal`) kullanan akıllıca bir yöntem önerir:

1.  Gradyan büyüklüğü `maxVal`'den büyük olan her piksel, "kesin kenar" olarak işaretlenir.
2.  Gradyan büyüklüğü `minVal`'den küçük olan her piksel, "kesin kenar değil" olarak atılır.
3.  Gradyan büyüklüğü bu iki eşik arasında kalan pikseller, "zayıf kenar" olarak kabul edilir. Bu zayıf kenarlar, sadece "kesin kenar" olarak işaretlenmiş bir piksele bağlıysalar nihai kenar haritasına dahil edilirler.

Bu yöntem, güçlü kenarlardan başlayarak onlara bağlı olan zayıf ama anlamlı kenar zincirlerini takip etmeyi sağlar ve gürültüden kaynaklanan izole pikselleri ortadan kaldırır. Sonuç, daha sürekli ve daha güvenilir kenar haritalarıdır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Canny kenar dedektöründeki "Non-Maximum Suppression" adımının temel amacı nedir?</p>
  <div class="quiz-option">A) Görüntüdeki gürültüyü azaltmak.</div>
  <div class="quiz-option">B) Kenarların yönünü hesaplamak.</div>
  <div class="quiz-option" data-correct="true">C) Gradyan büyüklüğü tarafından üretilen kalın kenarları incelterek tek piksel genişliğine getirmek.</div>
  <div class="quiz-option">D) Zayıf ve güçlü kenarları birbirine bağlamak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu adım, her pikselin gradyan büyüklüğünü kendi gradyan yönündeki komşularıyla karşılaştırır. Eğer piksel bir yerel maksimum değilse, yani en tepe noktası değilse, kenar olarak kabul edilmez ve elenir. Bu, "sırtları" inceltir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Histerezisli eşikleme (Hysteresis Thresholding) adımında iki farklı eşik (`minVal` ve `maxVal`) kullanılmasının sebebi nedir?</p>
  <div class="quiz-option">A) Algoritmayı daha hızlı çalıştırmak.</div>
  <div class="quiz-option" data-correct="true">B) Güçlü kenarlara bağlı olan zayıf kenarları da takip ederek kenar kopukluklarını azaltmak.</div>
  <div class="quiz-option">C) Görüntüdeki tüm pikselleri iki kategoriye ayırmak.</div>
  <div class="quiz-option">D) Sadece en güçlü kenarları bulmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Yüksek eşik (`maxVal`), güvenilir "kesin kenarları" bulur. Düşük eşik (`minVal`) ise, bu kesin kenarlara dokunan "zayıf ama muhtemel" kenarların da zincire dahil edilmesine izin verir. Bu, tek bir eşik kullanıldığında ortaya çıkabilecek kenar kopukluklarını önler.</p>
  </div>
</div>

