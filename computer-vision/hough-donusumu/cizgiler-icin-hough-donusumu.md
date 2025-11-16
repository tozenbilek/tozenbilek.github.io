---
layout: default
title: Çizgiler İçin Hough Dönüşümü
nav_order: 2
parent: Computer Vision
---

# Lines için Hough Transform: Polar Koordinatlar ve Algoritma

`y = mx + b` (`Cartesian`) parametrizasyonu, dikey `line`'lar için sorun yaratır çünkü bu durumda eğim (`m`) sonsuz olur ve `parameter space`'te temsil edilemez. Bu sorunu çözmek için `line`'ları ifade etmede daha sağlam bir yöntem olan **polar koordinatları** kullanırız.

## Polar Koordinat Parametrizasyonu

Bir `line`, iki yeni `parameter` ile tanımlanabilir:
- **`d` (veya `ρ` - rho):** `Line`'ın orijine olan dik mesafesi.
- **`θ` (theta):** Bu dikme çizgisinin x-ekseni ile yaptığı açı.

Bu parametrelerle bir `line`'ın denklemi şu hale gelir:
`d = x*cos(θ) + y*sin(θ)`

Bu gösterimin avantajı, `parameter space`'in (`d`, `θ`) sınırlı olmasıdır. `θ` genellikle `[-90°, 90°]` veya `[0°, 180°]` aralığındadır ve `d` de `image`'in köşegen uzunluğunu geçemez.

**`Image Space` ve `Hough Space` arasındaki ilişki (Polar):**
- **Image Space'teki bir nokta `(x₀, y₀)`:** `d = x₀*cos(θ) + y₀*sin(θ)` denklemine uyan tüm `(d, θ)` `parameter`'ları, `Hough space`'te **sinüzoidal bir eğri** oluşturur.
- **Image Space'teki bir `line`:** `Hough space`'te tek bir noktaya karşılık gelir.
- **Aynı `line` üzerindeki noktalar:** `Hough space`'te aynı noktada kesişen sinüzoidal eğriler oluşturur.

![Polar Hough Space Transformation](https://placehold.co/700x350/EEE/31343C?text=Görüntüdeki+Nokta+->+Hough+Uzayında+Sinüs+Eğrisi)
*<center>Görüntü uzayındaki tek bir nokta, polar Hough uzayında (d, θ) bir sinüs eğrisine dönüşür.</center>*

## Hough Transform Algoritması

1.  **`Accumulator`'ü Başlat:** `Hough space`'i temsil eden iki boyutlu bir `accumulator` matrisi `H[d, θ]` oluştur. Tüm değerleri sıfıra ayarla. `d` ve `θ`'nın aralıkları ve adımları (çözünürlüğü) önceden belirlenir.

2.  **Oylama (Voting):** `Image`'deki her `edge` `pixel`'i `(x, y)` için:
    - `θ`'yı belirlenen aralıkta (örneğin, -90°'dan +90°'a) tara.
    - Her `θ` değeri için, `d = x*cos(θ) + y*sin(θ)` denklemini kullanarak karşılık gelen `d` değerini hesapla.
    - Hesaplanan `(d, θ)` çiftine karşılık gelen `accumulator` hücresinin değerini bir artır: `H[d, θ] += 1`.

3.  **Zirveleri (Peaks) Bul:** `Accumulator` matrisindeki en yüksek değerlere sahip hücreleri bul. Bu hücreler, en çok `oy` alan `line` adaylarını temsil eder. Genellikle lokal maksimumları bulmak için bir `threshold` değeri ve bir `neighborhood` boyutu belirlenir.

4.  **`Line`'ları Çıkar:** Tespit edilen her zirvenin `(d, θ)` koordinatları, `image`'deki bir `line`'ı tanımlar.

## İyileştirmeler ve Pratik İpuçları

Standart `Hough Transform`'u daha verimli ve doğru hale getirmek için bazı iyileştirmeler yapılabilir:

- **`Gradient` Bilgisini Kullanma:** `Edge detection` sırasında her `pixel` için `gradient direction`'ı (`φ`) da hesaplanır. Bir `line` üzerindeki `pixel`'lerin `gradient direction`'ı, `line`'a dik olmalıdır. Yani, `θ ≈ φ`. Bu bilgiyle, her `edge` `pixel`'i için tüm `θ` değerlerini taramak yerine, sadece `gradient direction`'ı civarındaki birkaç `θ` değeri için oy verilir. Bu, hesaplama maliyetini önemli ölçüde azaltır.
- **Daha Güçlü `Edge`'lere Daha Fazla Oy Verme:** `Gradient magnitude`'u yüksek olan `edge` `pixel`'lerinin oylarını daha ağırlıklı hale getirmek (örneğin, `H[d, θ] += magnitude` yapmak), daha belirgin `line`'ların daha kolay tespit edilmesini sağlayabilir.
- **`Accumulator` Çözünürlüğü:** `d` ve `θ` için seçilen adım boyutları önemlidir. Çok büyük adımlar (`coarse resolution`), birbirine yakın `line`'ları aynı `bin`'de birleştirerek doğruluğu düşürür. Çok küçük adımlar (`fine resolution`) ise `noise` nedeniyle aynı `line` üzerindeki `pixel`'lerin oylarını farklı `bin`'lere dağıtabilir ve tespit gücünü azaltır. Doğru çözünürlüğü bulmak, uygulama için önemlidir.

## Accumulator Matrisini Yorumlama

Oylama işlemi tamamlandığında `accumulator` matrisi, `image`'deki yapı hakkında zengin bilgi içeren bir görsel haritaya dönüşür. Bu matrisi yorumlamak, algoritmanın nasıl çalıştığını anlamak için önemlidir:

![Accumulator Matrix Example](https://placehold.co/400x300/EEE/31343C?text=Accumulator+Matrisi+(Parlak+Noktalar=Çizgiler))

-   **Parlak Noktalar (Peaks):** Matristeki parlak noktalar veya yüksek değerli hücreler, birçok `edge` `pixel`'inin "oy verdiği" `(d, θ)` parametre çiftlerine karşılık gelir. Bu parlak noktalar, `image`'deki en belirgin çizgileri temsil eder. Örneğin, `image`'de dört kenarı olan bir kare varsa, `accumulator`'de bu dört çizgiye karşılık gelen dört belirgin parlak nokta (zirve) olacaktır.
-   **Sinüzoidal İzler:** Matrisin kendisi, her bir `edge` `pixel`'inin bıraktığı sinüzoidal oy izlerinin bir toplamıdır.
-   **Gürültünün Etkisi:** `Image`'deki gürültülü (alakasız) `edge` `pixel`'leri, `accumulator` matrisinde dağınık ve düşük değerli oylar bırakır. Bu oylar genellikle belirgin bir tepe oluşturacak şekilde yoğunlaşmazlar ve bu nedenle `Hough Transform`'un gürültüye dayanıklı olmasını sağlarlar.

---

## Özet ve Anahtar Kavramlar

-   **Polar Parametrizasyonu:** Dikey çizgileri de temsil edebilmek için `y=mx+b` yerine `d = x*cos(θ) + y*sin(θ)` denklemi kullanılır. `d` orijine olan dik mesafe, `θ` ise bu dikmenin açısıdır.
-   **Sinusoidal Eğriler:** Polar gösterimde, görüntüdeki bir nokta Hough uzayında bir **sinüs eğrisine** dönüşür.
-   **Accumulator Matrisi:** Oyların tutulduğu 2D bir matristir. Eksenleri `d` ve `θ`'dır.
-   **Peaks (Zirveler):** `Accumulator` matrisindeki en yüksek oy alan hücrelerdir ve görüntüdeki en olası çizgileri temsil ederler.
-   **Gradient Optimizasyonu:** Her `pixel`'in `gradient` yönü, o `pixel`'den geçen çizginin `θ`'sı hakkında bilgi verir. Bu bilgi, tüm `θ`'lar için oy vermek yerine sadece `gradient` yönü etrafındaki `θ`'lar için oy vererek algoritmayı hızlandırmak için kullanılabilir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Hough Transform'da çizgileri temsil etmek için `y = mx + b` yerine polar koordinat (`d, θ`) kullanılmasının temel nedeni aşağıdakilerden hangisidir?</p>
  <div class="quiz-option">A) Polar koordinatların hesaplanması daha hızlıdır.</div>
  <div class="quiz-option" data-correct="true">B) Polar koordinatlar dikey çizgileri sorunsuz bir şekilde temsil edebilir.</div>
  <div class="quiz-option">C) Polar koordinatlar daha az bellek kullanır.</div>
  <div class="quiz-option">D) Polar koordinatlar gürültüye daha dayanıklıdır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `y = mx + b` gösteriminde, dikey çizgilerin eğimi (`m`) sonsuzdur, bu da parametre uzayını sınırsız yapar ve dijital ortamda temsilini imkansızlaştırır. Polar koordinatların `d` ve `θ` parametreleri ise her zaman sınırlı bir aralıkta kalır, bu da dikey çizgiler de dahil olmak üzere tüm çizgilerin sorunsuz bir şekilde temsil edilmesini sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Görüntüdeki kenar piksellerinin gradyan yönü bilgisini Hough Transform'a dahil etmek ne gibi bir avantaj sağlar?</p>
  <div class="quiz-option" data-correct="true">A) Her pikselin daha az oy vermesini sağlayarak algoritmayı önemli ölçüde hızlandırır.</div>
  <div class="quiz-option">B) Daha fazla sayıda çizginin bulunmasını sağlar.</div>
  <div class="quiz-option">C) Algoritmanın eğri çizgileri de bulabilmesini sağlar.</div>
  <div class="quiz-option">D) Accumulator matrisine olan ihtiyacı ortadan kaldırır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Gradyan bilgisi olmadan, her kenar pikseli kendisinden geçebilecek tüm olası açılardaki (`θ`) çizgiler için oy kullanır. Gradyan yönünü bildiğimizde ise, o pikselden geçen çizginin normalinin açısının gradyan yönüyle yaklaşık aynı olması gerektiğini biliriz. Bu sayede, her piksel sadece belirli bir `θ` değeri (veya çok küçük bir aralık) için oy kullanır, bu da hesaplama miktarını büyük ölçüde azaltır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Hough Transform'un temel çalışma prensibi göz önüne alındığında, en büyük dezavantajı nedir?</p>
  <div class="quiz-option">A) Sadece siyah-beyaz görüntülerde çalışması.</div>
  <div class="quiz-option">B) Görüntüdeki nesnelerin tam olarak kapalı şekiller olmasını gerektirmesi.</div>
  <div class="quiz-option" data-correct="true">C) Tespit edilecek şeklin parametre sayısı arttıkça bellek ve hesaplama maliyetinin üssel olarak artması.</div>
  <div class="quiz-option">D) Gürültüden çok kolay etkilenmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Hough Transform, bir "boyutsallık laneti" (curse of dimensionality) probleminden muzdariptir. Çizgiler için 2D bir accumulator yeterliyken, çemberler için 3D, elipsler için 5D gerekir. Parametre sayısı arttıkça, accumulator matrisinin boyutu ve dolayısıyla gereken bellek ve işlem gücü pratik olmayan seviyelere çıkar.</p>
  </div>
</div>