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

<details>
  <summary><b>Soru 1:</b> Görüntü uzayında birbirine paralel olan iki farklı çizgi, `(m,b)` Hough uzayında nasıl görünür?</summary>
  <p>Paralel çizgiler aynı eğime (`m`) sahip ancak farklı y-kesenlerine (`b`) sahiptir. Dolayısıyla, `(m,b)` Hough uzayında bu iki çizgi, aynı dikey çizgi üzerinde (`m` değeri sabit) bulunan iki farklı nokta olarak görünür.</p>
</details>

<details>
  <summary><b>Soru 2:</b> Hough Transform'un temel `voting` mekanizması, gürültüye karşı nasıl bir dayanıklılık sağlar?</summary>
  <p>Gürültü `pixel`'leri genellikle rastgele konumlardadır ve herhangi bir anlamlı geometrik şekil oluşturmazlar. Bu nedenle, bu `pixel`'lerin Hough uzayındaki oyları da `accumulator` matrisine rastgele dağılır. Anlamlı bir şekil üzerindeki `pixel`'lerin oyları ise tek bir hücrede yoğunlaşırken, gürültünün oyları yoğunlaşamaz. Bu sayede, `accumulator`'deki en yüksek tepe noktası büyük olasılıkla gürültüden değil, gerçek bir yapıdan kaynaklanır.</p>
</details>

<details>
  <summary><b>Soru 3:</b> `y = mx + b` parametrizasyonunu kullandığımızı varsayalım. Görüntüde tam olarak dikey bir çizgi varsa, `accumulator` matrisinde ne olur?</summary>
  <p>Dikey bir çizginin eğimi (`m`) sonsuzdur. `(m,b)` Hough uzayı genellikle `m` için sonlu bir aralıkta tanımlanır. Bu nedenle, dikey çizgi bu `parameter space`'te temsil edilemez ve `accumulator`'e oy veremez. Bu, `y = mx + b` gösteriminin en büyük dezavantajıdır ve bir sonraki bölümde göreceğimiz polar koordinatların kullanılmasının ana sebebidir.</p>
</details>
