---
layout: default
title: Images ve Noise Modelleri
parent: 2. Görüntü Oluşturma ve Filtreleme
nav_order: 1
---

# Images ve Noise Modelleri

Bu bölümde, dijital `image`'lerin temelini, nasıl bir fonksiyon olarak ifade edilebileceğini ve pratikte karşılaşılan `noise` türlerini inceliyoruz.

## Adım 1 – Image'i Bir Fonksiyon Olarak Anla

Bir `image`'i matematiksel olarak iki boyutlu bir fonksiyon, `I(x, y)`, olarak düşünebiliriz. Bu fonksiyonda:
- `(x, y)`: `Image` düzlemindeki bir koordinatı temsil eder.
- `I(x, y)`: Bu koordinattaki `pixel`'in `intensity` değerini verir.

**Pratikte:**
- **Grayscale Image:** `I(x, y)` fonksiyonu, `[0, 255]` gibi belirli bir aralıkta (örneğin, 0 = siyah, 255 = beyaz) tek bir skaler değer döndürür.
- **Renkli Image:** Renkli bir `image`, genellikle üç farklı fonksiyonun birleşimidir: Kırmızı, Yeşil ve Mavi (RGB). Bu, vektör değerli bir fonksiyon olarak ifade edilebilir:
  
  `I(x, y) = [R(x, y), G(x, y), B(x, y)]`

### Dijital Images
Bilgisayarlar sürekli (analog) sinyallerle çalışamaz, bu yüzden `image`'leri dijitalleştirmemiz gerekir. Bu iki temel adımda yapılır:
1.  **Sampling:** `Image` düzlemi düzenli bir grid üzerinde ayrık noktalara bölünür. Her bir nokta bir **pixel** olur.
2.  **Quantization:** Her `pixel`'in `intensity` değeri, belirli sayıdaki ayrık seviyelerden birine yuvarlanır (örneğin, 8-bit için 256 seviye).

Sonuç olarak, dijital bir `image`, tam sayı değerlerinden oluşan bir matris (veya renkli ise 3 matris) olarak temsil edilir.

## Adım 2 – Yaygın Noise Türlerini Tanı

`Image` elde etme ve iletim süreçlerinde orijinal sinyale istenmeyen rastgele sinyaller eklenir. Buna **noise** denir. `Noise`, `I'(x, y) = I(x, y) + η(x, y)` şeklinde bir toplamsal modelle ifade edilebilir; burada `η(x, y)` `noise` fonksiyonudur.

### Yaygın Noise Modelleri:

1.  **Salt and Pepper Noise:**
    - **Görünüm:** `Image` üzerinde rastgele serpiştirilmiş siyah (biber) ve beyaz (tuz) `pixel`'ler şeklinde belirir.
    - **Neden:** Genellikle veri iletimindeki hatalar veya arızalı sensör hücreleri nedeniyle oluşur.

2.  **Impulse Noise:**
    - **Görünüm:** Sadece rastgele beyaz `pixel`'lerden oluşur. *Salt and Pepper*'ın tek kutuplu halidir.

3.  **Gaussian Noise:**
    - **Görünüm:** Her `pixel`'in `intensity` değerine, normal (Gaussian) dağılıma sahip rastgele bir değer eklenir. `Image`'e hafif, tanecikli bir doku katar.
    - **Neden:** Sensör elektroniğindeki termal gürültü veya düşük aydınlatma koşulları gibi birçok doğal süreçten kaynaklanır. En yaygın karşılaşılan `noise` türüdür.
    - **Parametre:** Gaussian dağılımının standart sapması (`σ`), `noise`'un ne kadar "yoğun" olacağını belirler. `σ` arttıkça, `pixel`'ler orijinal değerlerinden daha fazla sapar.

> **Önemli Not:** `Noise`, `image`'e bilgi eklemez, aksine var olan bilgiyi **bozar**. Bu nedenle, birçok Computer Vision uygulamasının ilk adımı, `noise`'u temizlemek veya etkisini azaltmaktır. Bir sonraki bölümde bu amaçla kullanılan `filtering` tekniklerini inceleyeceğiz.
