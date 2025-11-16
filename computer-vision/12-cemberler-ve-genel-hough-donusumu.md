---
layout: default
title: Çemberler ve Genel Hough Dönüşümü
nav_order: 12
parent: Computer Vision
---

# Çemberler ve Genelleştirilmiş Hough Dönüşümü

Hough Dönüşümü'nün "oylama" prensibinin gücü, sadece çizgileri bulmakla sınırlı olmamasından gelir. Aynı temel fikir, parametrik denklemi bilinen (veya bir şablonu olan) herhangi bir şekli tespit etmek için genelleştirilebilir. Bu bölümde, çemberleri ve hatta denklemi olmayan keyfi şekilleri bulmak için bu tekniğin nasıl uyarlandığını inceleyeceğiz.

---

## 1. Çemberler İçin Hough Dönüşümü

Bir çember, üç parametre ile tanımlanır: merkezinin koordinatları `(a, b)` ve yarıçapı `r`. Denklemi: `(x - a)² + (y - b)² = r²`.

Bu durumda, Hough parametre uzayımız artık 2D değil, **3 boyutlu `(a, b, r)`** olur ve bu da hesaplama maliyetini önemli ölçüde artırır.

### Arama Uzayını Küçültmenin Yolları

3D bir uzayda arama yapmak çok maliyetli olduğu için, genellikle süreci hızlandıracak ek bilgiler kullanılır:

*   **Sabit Yarıçap:** Eğer aranacak çemberin yarıçapı `r` biliniyorsa, problem 2D'ye (`(a,b)` uzayına) indirgenir. Her kenar pikseli, `(a,b)` uzayında etrafına `r` yarıçaplı bir çember çizerek oy kullanır.
*   **Gradyan Yönünü Kullanma (En Verimli Yöntem):** Bir çember üzerindeki bir kenar pikselinin gradyan yönü, her zaman çemberin merkezinden geçen bir doğru üzerindedir. Bu bilgi, her kenar pikseli için olası merkezlerin sayısını sonsuzdan (tüm 2D düzlem) sadece bir çizgiye indirir. Bu, oylama sürecini muazzam ölçüde hızlandırır.

<pre>
<b>Gradyan Bilgisi Olmadan Oylama:</b>
- Kenar pikseli P(x,y) alınır.
- P merkezli, r yarıçaplı bir çember çizilir.
- Bu çember üzerindeki <b>tüm noktalar (a,b)</b>,
  H[a,b,r] için bir oy alır. (Çok maliyetli)

<b>Gradyan Bilgisiyle Oylama:</b>
- Kenar pikseli P(x,y) alınır.
- P'deki gradyan yönü bulunur.
- Sadece bu gradyan çizgisi üzerindeki <b>noktalar (a,b)</b>,
  H[a,b,r] için oy alır. (Çok daha verimli!)
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Bir görüntüde bilinmeyen boyutta bir çember aramak için Hough Dönüşümü kullanıldığında, Hough parametre uzayı kaç boyutlu olur?</p>
  <div class="quiz-option">A) 1D (r)</div>
  <div class="quiz-option">B) 2D (a, b)</div>
  <div class="quiz-option" data-correct="true">C) 3D (a, b, r)</div>
  <div class="quiz-option">D) 4D (x, y, a, b)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir çemberi tam olarak tanımlamak için üç parametreye ihtiyaç vardır: merkezinin x koordinatı (`a`), merkezinin y koordinatı (`b`) ve yarıçapı (`r`). Bu nedenle, oylamanın yapıldığı akkümülatör 3 boyutlu olmalıdır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir elipsi (`(x-a)²/Rx² + (y-b)²/Ry² = 1`) bulmak için Hough Dönüşümü kullanılacak olsaydı, parametre uzayı en az kaç boyutlu olurdu?</p>
  <div class="quiz-option">A) 2D</div>
  <div class="quiz-option">B) 3D</div>
  <div class="quiz-option">C) 4D</div>
  <div class="quiz-option" data-correct="true">D) 5D</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Standart bir elipsi tanımlamak için 5 parametre gerekir: merkez koordinatları `(a,b)`, x ve y eksenlerindeki yarıçapları `(Rx, Ry)` ve elipsin dönme açısı `(θ)`. Bu, Hough Dönüşümü'nün parametre sayısı arttıkça ne kadar maliyetli hale geldiğinin iyi bir örneğidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Çemberler için Hough Dönüşümü'nün hesaplama maliyetini düşürmek amacıyla kenar piksellerinin gradyan yönü bilgisini kullanmanın temel mantığı nedir?</p>
  <div class="quiz-option">A) Görüntüyü daha pürüzsüz hale getirmek.</div>
  <div class="quiz-option" data-correct="true">B) Her kenar pikseli için olası merkez adaylarının sayısını 2D bir alandan 1D bir çizgiye indirmek.</div>
  <div class="quiz-option">C) Çemberin yarıçapını sabit tutmak.</div>
  <div class="quiz-option">D) Sadece dikey kenarları kullanmak.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Bir çemberin kenarındaki bir pikselin gradyanı, her zaman merkezden geçen bir çizgi üzerindedir. Bu nedenle, bir pikselin tüm 2D düzlemdeki olası merkezler için oy vermesi yerine, sadece bu gradyan çizgisi üzerindeki noktalar için oy vermesi yeterlidir. Bu, arama uzayını önemli ölçüde daraltır.</p>
  </div>
</div>

---

## 2. Genelleştirilmiş Hough Dönüşümü

Peki ya bulmak istediğimiz şeklin basit bir denklemi yoksa? Örneğin, bir kedi yüzü veya bir araba silüeti bulmak istiyorsak? İşte burada **Genelleştirilmiş Hough Dönüşümü** devreye girer. Bu yöntem, bir yapboz çözmeye benzer.

1.  **Eğitim Aşaması (Yapbozun Kılavuzunu Oluşturma):**
    *   Aranacak şeklin bir şablon görüntüsü alınır ve keyfi bir merkez noktası seçilir.
    *   Şablondaki her kenar pikseli için, o pikselin gradyan yönü (`θ`) ve o pikselden merkeze giden vektör (`r`) hesaplanır.
    *   Bu bilgiler, `R-Table` adı verilen bir "kılavuz" tabloda saklanır: Her gradyan yönü (`θ`) için olası merkez-piksel vektörlerinin (`r`) bir listesi tutulur.
2.  **Tespit Aşaması (Yapbozu Çözme):**
    *   Test görüntüsündeki her bir kenar pikseli için gradyan yönü (`θ`) hesaplanır.
    *   `R-Table`'dan bu `θ`'ya karşılık gelen tüm `r` vektörleri alınır.
    *   Her bir `r` vektörü, mevcut kenar pikselinin konumundan "geriye doğru" uygulanarak olası bir merkez noktası için oy kullanılır.
    *   En çok oy alan merkez noktası, aranan şeklin konumunu verir.

Bu yöntem, oylama mekanizmasını keyfi şekil tespiti için genişletir, ancak genellikle standart haliyle ölçek ve dönme değişikliklerine karşı hassastır.

<div class="quiz-question">
  <p><b>Soru:</b> Genelleştirilmiş Hough Dönüşümü'nü, standart Hough Dönüşümü'nden ayıran en temel özellik nedir?</p>
  <div class="quiz-option">A) Sadece çizgileri bulabilmesi.</div>
  <div class="quiz-option">B) Daha hızlı çalışması.</div>
  <div class="quiz-option" data-correct="true">C) Basit bir matematiksel denklemi olmayan keyfi şekilleri de bir şablon (R-Table) kullanarak bulabilmesi.</div>
  <div class="quiz-option">D) Gürültüye karşı daha dayanıksız olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Standart Hough, çizgi veya çember gibi net parametrik denklemlere dayanır. Genelleştirilmiş Hough ise, bir denklem yerine önceden tanımlanmış bir şablon (R-Table) kullanarak denklemi olmayan herhangi bir şekli bulabilir.</p>
  </div>
</div>

---

