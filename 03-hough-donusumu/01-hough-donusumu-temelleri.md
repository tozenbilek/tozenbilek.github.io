---
layout: default
title: Hough Transform Temelleri
parent: 3. Hough Transform
nav_order: 1
---

# Hough Transform Temelleri: Voting ve Parameter Space

Bir `image`'deki `edge` `pixel`'lerinden hangilerinin bir `line`'a ait olduğunu nasıl anlarız? Olası tüm `pixel` kombinasyonlarını deneyip bir `line`'a uyup uymadıklarını kontrol etmek hesaplama açısından çok maliyetlidir. `Hough Transform`, bu problemi zekice bir `voting` mekanizmasıyla çözer.

## Adım 1 – Parametric Modelleri Anla

Bir **parametric model**, bir dizi `parameter` ile tanımlanabilen bir şekil sınıfıdır.
- **Line:** `y = mx + b` denklemiyle ifade edilebilir. `Parameter`'ları: eğim (`m`) ve y-keseni (`b`).
- **Circle:** `(x - a)² + (y - b)² = r²` denklemiyle ifade edilebilir. `Parameter`'ları: merkez koordinatları (`a`, `b`) ve yarıçap (`r`).

`Hough Transform`'un amacı, `image`'deki `pixel`'lerin hangi model `parameter`'larını "desteklediğini" bulmaktır.

## Adım 2 – Image Space'ten Parameter Space'e Geçiş

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

## Adım 3 – Voting Mekanizmasını Kullan

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
