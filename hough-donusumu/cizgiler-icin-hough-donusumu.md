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

-   **Parlak Noktalar (Peaks):** Matristeki parlak noktalar veya yüksek değerli hücreler, birçok `edge` `pixel`'inin "oy verdiği" `(d, θ)` parametre çiftlerine karşılık gelir. Bu parlak noktalar, `image`'deki en belirgin çizgileri temsil eder. Örneğin, `image`'de dört kenarı olan bir kare varsa, `accumulator`'de bu dört çizgiye karşılık gelen dört belirgin parlak nokta (zirve) olacaktır.
-   **Sinüzoidal İzler:** Matrisin kendisi, her bir `edge` `pixel`'inin bıraktığı sinüzoidal oy izlerinin bir toplamıdır.
-   **Gürültünün Etkisi:** `Image`'deki gürültülü (alakasız) `edge` `pixel`'leri, `accumulator` matrisinde dağınık ve düşük değerli oylar bırakır. Bu oylar genellikle belirgin bir tepe oluşturacak şekilde yoğunlaşmazlar ve bu nedenle `Hough Transform`'un gürültüye dayanıklı olmasını sağlarlar.