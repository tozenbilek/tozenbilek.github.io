---
layout: default
title: Çemberler ve Genel Hough Dönüşümü
nav_order: 12
parent: Computer Vision
---

# Çemberler ve Genelleştirilmiş Hough Dönüşümü

Hough Dönüşümü'nün gücü, sadece çizgileri bulmakla sınırlı değildir. Aynı oylama prensibi, parametrik denklemi bilinen herhangi bir şekli tespit etmek için genelleştirilebilir. Bu bölümde, çemberleri ve hatta denklemi olmayan keyfi şekilleri bulmak için bu tekniğin nasıl uyarlandığını inceleyeceğiz.

---

## 1. Çemberler İçin Hough Dönüşümü

Bir çember, üç parametre ile tanımlanır: merkezinin koordinatları `(a, b)` ve yarıçapı `r`. Denklemi şöyledir:

`(x - a)² + (y - b)² = r²`

Bu durumda, Hough parametre uzayımız artık 2 boyutlu değil, **3 boyutlu `(a, b, r)`** olur.

**Oylama Süreci:**
1.  3D bir akkümülatör dizisi `H[a, b, r]` oluşturulur ve sıfırlanır.
2.  Görüntüdeki her bir kenar pikseli `(x, y)` için:
    a. Mümkün olan her `a` ve `b` merkezi için, `r = sqrt((x - a)² + (y - b)²) ` formülüyle bir `r` yarıçapı hesaplanır.
    b. `H[a, b, r]` hücresine bir oy eklenir.

Bu yaklaşım, her bir kenar pikselinin, kendisini çevreleyen ve olası bir merkez olabilecek her `(a,b)` noktası için oy vermesi anlamına gelir. Bu, parametre uzayında bir koni oluşturur. Farklı kenar piksellerinin oluşturduğu koniler, gerçek çemberin `(a,b,r)` parametresinde kesişir ve burada oylar birikir.

![Hough for Circles](https://via.placeholder.com/600x300.png?text=Kenar+Pikseli+->+3D+Parametre+Uzayında+Oy+Verir)
*Görsel: Bir kenar pikseli, kendisinden `r` yarıçapı kadar uzaktaki tüm olası merkezler `(a,b)` için oy kullanır.*

### Arama Uzayını Küçültmek
3D bir uzayda arama yapmak hesaplama açısından çok maliyetlidir. Bu maliyeti düşürmek için bazı pratik iyileştirmeler yapılabilir:
*   **Sabit Yarıçap:** Eğer aranacak çemberin yarıçapı `r` biliniyorsa, problem 2D'ye (`(a,b)` uzayına) indirgenir.
*   **Gradyan Yönünü Kullanma:** Bir çember üzerindeki bir kenar pikselinin gradyan yönü, her zaman çemberin merkezini işaret eder (veya merkezden dışarıyı). Bu bilgi, her kenar pikseli için olası merkezlerin sayısını büyük ölçüde azaltır. Bir piksel artık 2D bir düzlemde değil, sadece gradyanı yönündeki 1D bir çizgi boyunca oy kullanır.

---

## 2. Genelleştirilmiş Hough Dönüşümü

Peki ya bulmak istediğimiz şeklin basit bir denklemi yoksa? Örneğin, bir kedi yüzü veya bir araba silüeti bulmak istiyorsak ne olur? İşte burada **Genelleştirilmiş Hough Dönüşümü** devreye girer.

Bu teknikte, şeklin denklemi yerine, şeklin bir **template (şablon)** görüntüsü kullanılır.
1.  **Eğitim Aşaması:** Şablon görüntüdeki her kenar pikseli için, o pikselden şeklin keyfi olarak seçilmiş bir merkez noktasına olan yer değiştirme vektörü (`Δx, Δy`) hesaplanır. Bu vektörler, pikselin gradyan yönüne göre bir tabloda (`R-Table`) saklanır.
2.  **Tespit Aşaması:** Test görüntüsündeki her bir kenar pikseli için:
    a. Gradyan yönü hesaplanır.
    b. Tablodan bu gradyan yönüne karşılık gelen tüm yer değiştirme vektörleri alınır.
    c. Her bir yer değiştirme vektörü, mevcut kenar pikselinin konumuna eklenerek olası bir merkez noktası için oy kullanılır.

Bu yöntem, oylama mekanizmasını ölçek, dönme ve keyfi şekil tespiti için genişletir, ancak parametre uzayının boyutu ve dolayısıyla hesaplama maliyeti önemli ölçüde artar.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir görüntüde bilinmeyen boyutta bir çember aramak için Hough Dönüşümü kullanıldığında, Hough parametre uzayı kaç boyutlu olur?</p>
  <div class="quiz-option">A) 1D (r)</div>
  <div class="quiz-option">B) 2D (a, b)</div>
  <div class="quiz-option" data-correct="true">C) 3D (a, b, r)</div>
  <div class="quiz-option">D) 4D (x, y, a, b)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir çemberi tam olarak tanımlamak için üç parametreye ihtiyaç vardır: merkezinin x koordinatı (`a`), merkezinin y koordinatı (`b`) ve yarıçapı (`r`). Bu nedenle, oylamanın yapıldığı akkümülatör 3 boyutlu olmalıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Çemberler için Hough Dönüşümü'nün hesaplama maliyetini düşürmek amacıyla kenar piksellerinin gradyan yönü bilgisini kullanmanın temel mantığı nedir?</p>
  <div class.quiz-option">A) Görüntüyü daha pürüzsüz hale getirmek.</div>
  <div class="quiz-option" data-correct="true">B) Her kenar pikseli için olası merkez adaylarının sayısını azaltmak.</div>
  <div class="quiz-option">C) Çemberin yarıçapını sabit tutmak.</div>
  <div class="quiz-option">D) Sadece dikey kenarları kullanmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir çemberin kenarındaki bir pikselin gradyanı, her zaman merkezden geçen bir çizgi üzerindedir. Bu nedenle, bir pikselin tüm 2D düzlemdeki olası merkezler için oy vermesi yerine, sadece bu gradyan çizgisi üzerindeki noktalar için oy vermesi yeterlidir. Bu, arama uzayını önemli ölçüde daraltır.</p>
  </div>
</div>

