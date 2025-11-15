---
layout: default
title: Hough Transform Temelleri
parent: 3. Hough Transform
nav_order: 1
---

# Hough Transform Temelleri: Voting ve Parameter Space

Bir `image`'deki `edge` `pixel`'lerinden hangilerinin bir `line`'a ait olduğunu nasıl anlarız? Olası tüm `pixel` kombinasyonlarını deneyip bir `line`'a uyup uymadıklarını kontrol etmek hesaplama açısından çok maliyetlidir. `Hough Transform`, bu problemi zekice bir `voting` mekanizmasıyla çözer.

## Parametric Modeller

Bir **parametric model**, bir dizi `parameter` ile tanımlanabilen bir şekil sınıfıdır.
- **Line:** `y = mx + b` denklemiyle ifade edilebilir. `Parameter`'ları: eğim (`m`) ve y-keseni (`b`).
- **Circle:** `(x - a)² + (y - b)² = r²` denklemiyle ifade edilebilir. `Parameter`'ları: merkez koordinatları (`a`, `b`) ve yarıçap (`r`).

`Hough Transform`'un amacı, `image`'deki `pixel`'lerin hangi model `parameter`'larını "desteklediğini" bulmaktır.

## Image Space'ten Parameter Space'e Geçiş

`Hough Transform`'un temel fikri, problemi **image space**'ten, modellerin `parameter`'larının eksenleri oluşturduğu **parameter space**'e veya **Hough space**'e taşımaktır.

Bu dönüşümde roller değişir:
- **Image Space'te:** Bir `line`, birçok `pixel`'den oluşan bir yapıdır. Bir `pixel` ise tek bir noktadır.
- **Hough Space'te:** `Image`'deki bir **line**, `Hough space`'te **tek bir noktaya** (`m`, `b`) karşılık gelir.

Peki ya `image`'deki tek bir `pixel`?
`y₀ = m*x₀ + b` denklemini `b = -x₀*m + y₀` olarak yeniden düzenlersek, `(x₀, y₀)` noktasından geçen tüm olası `line`'ların `(m, b)` `parameter space`'inde bir **doğru** oluşturduğunu görürüz.

**Özetle:**
- `Image`'deki bir nokta `(x, y)` -> `Hough space`'te bir `line`.
- `Hough space`'teki bir nokta `(m, b)` -> `Image space`'te bir `line`.
- `Image space`'te aynı `line` üzerinde bulunan birden fazla nokta -> `Hough space`'te **tek bir noktada kesişen** birden fazla `line`.

![Image Space to Hough Space Mapping](https://placehold.co/700x350/EEE/31343C?text=Görüntüdeki+Noktalar+->+Hough+Uzayında+Kesişen+Doğrular)
*<center>Görüntü uzayında aynı doğru üzerindeki (kırmızı, mavi, yeşil) noktaların her biri, Hough uzayında bir doğruya dönüşür. Bu doğrular, orijinal doğrunun parametrelerine karşılık gelen tek bir noktada kesişir.</center>*

## Voting Mekanizması

İşte `Hough Transform`'un sihirli kısmı burada devreye girer:
1.  `Parameter space`'i ayrık "kutulara" veya "hücrelere" (`bins`) bölen bir **accumulator array** oluşturulur. Bu dizi başlangıçta sıfırlarla doldurulur.
2.  `Image`'deki **her bir edge pixel'i** için:
    - O `pixel`'den geçebilecek **tüm olası `line`'ların** `parameter`'larını hesapla. Bu, `Hough space`'te bir `line`'a karşılık gelir.
    - Bu `line`'ın geçtiği `accumulator array`'indeki her bir kutunun sayacını (`vote`'unu) bir artır.
3.  Tüm `edge` `pixel`'leri için `voting` bittikten sonra, `accumulator array`'inde **en çok `vote` alan** kutuyu (veya kutuları) bul.
4.  Bu kutunun koordinatları (`m`, `b`), `image`'deki en belirgin `line`'ın `parameter`'larını verir.

**Neden İşe Yarıyor?**
- **Doğrusal Pixeller:** Aynı doğru üzerindeki `pixel`'ler, `Hough space`'te aynı noktada kesişen `line`'lar oluşturacağı için, bu kesişim noktası çok yüksek `vote` alır.
- **Noise ve Alakasız Pixeller:** `Noise` `pixel`'leri veya farklı şekillere ait `pixel`'ler, `Hough space`'te rastgele yerlere `vote` verirler ve oyları belirli bir kutuda yoğunlaşmaz.
- **Eksik Pixeller:** Bir `line`'ın bazı `pixel`'leri eksik olsa bile, mevcut `pixel`'ler yine de aynı kutuya `vote` vereceği için `line` hala tespit edilebilir.

Bu `voting` mekanizması sayesinde `Hough Transform`, `noise`'a, eksik verilere ve `image`'deki birden fazla yapıya karşı oldukça dayanıklıdır.

---

## Özet ve Anahtar Kavramlar

-   **Parametric Model:** Bir dizi parametre ile tanımlanabilen şekil sınıfıdır (örn: `y=mx+b` bir çizgi modelidir).
-   **Image Space:** Görüntünün `pixel` koordinatlarından (`x,y`) oluşan normal 2D uzaydır.
-   **Parameter Space (Hough Space):** Eksenleri, aranan şeklin parametrelerinden (örn: `m, b`) oluşan uzaydır.
-   **Duality:** Görüntü uzayındaki bir nokta, Hough uzayında bir çizgiye; görüntü uzayındaki bir çizgi, Hough uzayında bir noktaya karşılık gelir.
-   **Voting:** Görüntüdeki her bir `edge pixel`'inin, kendisinden geçebilecek tüm olası şekil parametreleri için Hough uzayındaki bir `accumulator` matrisine "oy" vermesi işlemidir. En çok oyu alan hücre, görüntüdeki en olası şekli temsil eder.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Görüntü uzayındaki (image space) tek bir nokta, Hough uzayında (parameter space) neye karşılık gelir?</p>
  <div class="quiz-option">A) Yine tek bir noktaya.</div>
  <div class="quiz-option" data-correct="true">B) Bir çizgiye (veya eğriye).</div>
  <div class="quiz-option">C) Bir alana.</div>
  <div class="quiz-option">D) Hiçbir şeye.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Görüntüdeki tek bir `(x, y)` noktası, kendisinden geçebilecek sonsuz sayıdaki çizginin parametrelerine (`m` ve `b`) karşılık gelir. `y = mx + b` denklemini `b = -xm + y` olarak düzenlersek, bunun `(m,b)` uzayında bir doğru denklemi olduğunu görürüz. Yani görüntüdeki her nokta, parametre uzayında bir çizgiye oy verir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Hough Transform'daki `accumulator` matrisinin amacı nedir?</p>
  <div class="quiz-option">A) Görüntünün kenarlarını depolamak.</div>
  <div class="quiz-option">B) Görüntünün renk histogramını tutmak.</div>
  <div class="quiz-option" data-correct="true">C) Parametre uzayındaki oyları toplamak ve en çok oy alan parametreleri bulmak.</div>
  <div class="quiz-option">D) Görüntüyü daha hızlı işlemek için geçici bir bellektir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `Accumulator`, parametre uzayını (`m` ve `b` gibi) ayrık hücrelere bölen bir ızgaradır. Görüntüdeki her kenar pikseli, kendisinden geçebilecek tüm olası çizgilere karşılık gelen hücrelere bir "oy" verir. Algoritmanın sonunda, en çok oy toplayan hücreler (tepe noktaları), görüntüdeki en belirgin çizgilerin parametrelerini temsil eder.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> `y = mx + b` parametrizasyonunun Hough Transform'da kullanılmasının en büyük dezavantajı nedir?</p>
  <div class="quiz-option">A) Yatay çizgileri temsil edememesi.</div>
  <div class="quiz-option" data-correct="true">B) Dikey çizgileri temsil edememesi.</div>
  <div class="quiz-option">C) Çemberleri temsil edememesi.</div>
  <div class="quiz-option">D) Hesaplama açısından çok yavaş olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Dikey bir çizginin eğimi (`m`) sonsuzdur. Bu, `m` ekseninin sonsuz bir aralığa sahip olmasını gerektirir ki bu da bir `accumulator` matrisinde pratik olarak temsil edilemez. Bu sınırlama, dikey çizgilerin tespit edilememesine yol açar ve bu yüzden polar koordinat (`d`, `θ`) parametrizasyonu gibi alternatifler kullanılır.</p>
  </div>
</div>
