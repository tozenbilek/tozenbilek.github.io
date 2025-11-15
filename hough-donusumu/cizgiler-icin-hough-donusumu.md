---
layout: default
title: Lines için Hough Transform
parent: 3. Hough Transform
nav_order: 2
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

<details>
  <summary><b>Soru 1:</b> `y = mx + b` yerine neden polar koordinat (`d, θ`) gösterimini kullanıyoruz? Temel sebebi nedir?</summary>
  <p>Temel sebep, `y = mx + b` gösteriminin dikey çizgileri temsil edememesidir. Dikey bir çizginin eğimi (`m`) sonsuzdur ve bu, `parameter space`'te sonsuz bir aralık gerektirir. Polar koordinatların (`d, θ`) `parameter space`'i ise her zaman sınırlıdır (örneğin, `θ` 0-180 derece arası), bu da onu dijital bir `accumulator` matrisinde temsil etmeyi mümkün kılar.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Bir görüntüde tam olarak orijinden geçen 45 derecelik bir çizgi varsa, bu çizgiye karşılık gelen `(d, θ)` `peak`'i `accumulator` matrisinde nerede olur?</summary>
  <p>Çizgi orijinden geçtiği için, orijine olan dik mesafesi (`d`) sıfırdır. Çizginin kendisi 45 derece ise, ona dik olan doğrunun açısı `45 + 90 = 135` derece olacaktır. Dolayısıyla `peak`, `(d=0, θ=135°)` koordinatlarında bulunur.</p>
</details>

<details>
  <summary><b>Soru 3:</b> `Gradient` bilgisini kullanmak Hough Transform'u nasıl hızlandırır?</summary>
  <p>Standart algoritmada, her bir `edge pixel`'i, kendisinden geçebilecek tüm olası çizgiler için (yani tüm `θ` aralığı için) oy verir, bu da Hough uzayında tam bir sinüs eğrisi çizer. `Gradient` yönünü (`φ`) bildiğimizde ise, o `pixel`'den geçen çizginin normalinin açısının (`θ`) `gradient` yönüyle (`θ ≈ φ`) aynı olması gerektiğini biliriz. Bu sayede, tüm `θ` değerleri için oy vermek yerine, sadece `gradient` yönü civarındaki birkaç `θ` değeri için oy veririz. Bu, her `pixel` için yapılan hesaplama miktarını büyük ölçüde azaltır ve algoritmayı hızlandırır.</p>
</details>