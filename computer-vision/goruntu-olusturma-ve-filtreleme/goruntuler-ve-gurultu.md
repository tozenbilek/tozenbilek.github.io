---
layout: default
title: Images ve Noise Modelleri
parent: 2. Image Formation ve Filtering
nav_order: 1
---

# Images ve Noise Modelleri

Bu bölümde, dijital `image`'lerin temelini, nasıl bir fonksiyon olarak ifade edilebileceğini ve pratikte karşılaşılan `noise` türlerini inceliyoruz.

## Image'i Bir Fonksiyon Olarak Anlamak

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

## Yaygın Noise Türleri

`Image` elde etme ve iletim süreçlerinde orijinal sinyale istenmeyen rastgele sinyaller eklenir. Buna **noise** denir. `Noise`, `I'(x, y) = I(x, y) + η(x, y)` şeklinde bir toplamsal modelle ifade edilebilir; burada `η(x, y)` `noise` fonksiyonudur.

### Yaygın Noise Modelleri:

1.  **Salt and Pepper Noise:**
    - **Görünüm:** `Image` üzerinde rastgele serpiştirilmiş siyah (biber) ve beyaz (tuz) `pixel`'ler şeklinde belirir.
    - **Neden:** Genellikle veri iletimindeki hatalar veya arızalı sensör hücreleri nedeniyle oluşur.

    ![Salt and Pepper Gürültü Örneği](https://placehold.co/400x300/EEE/31343C?text=Salt+and+Pepper+Gürültüsü)

2.  **Impulse Noise:**
    - **Görünüm:** Sadece rastgele beyaz `pixel`'lerden oluşur. *Salt and Pepper*'ın tek kutuplu halidir.

3.  **Gaussian Noise:**
    - **Görünüm:** Her `pixel`'in `intensity` değerine, normal (Gaussian) dağılıma sahip rastgele bir değer eklenir. `Image`'e hafif, tanecikli bir doku katar.
    - **Neden:** Sensör elektroniğindeki termal gürültü veya düşük aydınlatma koşulları gibi birçok doğal süreçten kaynaklanır. En yaygın karşılaşılan `noise` türüdür.
    - **Parametre:** Gaussian dağılımının standart sapması (`σ`), `noise`'un ne kadar "yoğun" olacağını belirler. `σ` arttıkça, `pixel`'ler orijinal değerlerinden daha fazla sapar.

    ![Gaussian Gürültü Örneği](https://placehold.co/400x300/EEE/31343C?text=Gaussian+Gürültüsü)

> **Önemli Not:** `Noise`, `image`'e bilgi eklemez, aksine var olan bilgiyi **bozar**. Bu nedenle, birçok Computer Vision uygulamasının ilk adımı, `noise`'u temizlemek veya etkisini azaltmaktır. Bir sonraki bölümde bu amaçla kullanılan `filtering` tekniklerini inceleyeceğiz.

---

## Özet ve Anahtar Kavramlar

-   **Image as a Function:** Bir görüntü, `I(x, y)` şeklinde iki boyutlu bir fonksiyon olarak modellenebilir. Renkli görüntüler `[R(x, y), G(x, y), B(x, y)]` gibi vektör değerli fonksiyonlardır.
-   **Digital Image:** Sürekli bir görüntünün `sampling` (örnekleme) ve `quantization` (niceleme) işlemleriyle ayrık `pixel`'lerden ve `intensity` seviyelerinden oluşan bir matrise dönüştürülmesidir.
-   **Noise (Gürültü):** Görüntü sinyaline eklenen istenmeyen bozulmalardır.
-   **Salt and Pepper Noise:** Görüntüde rastgele siyah ve beyaz noktalar olarak belirir.
-   **Gaussian Noise:** Her `pixel`'e normal dağılıma sahip rastgele bir değer eklenmesiyle oluşur ve en yaygın gürültü türüdür.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Bir renkli dijital görüntü (RGB) matematiksel olarak en iyi nasıl ifade edilir?</p>
  <div class="quiz-option">A) `I(x, y)` formunda, her (x, y) konumunda tek bir parlaklık değeri olan bir fonksiyon.</div>
  <div class="quiz-option">B) `I = [R, G, B]` formunda, tüm görüntü için üç adet ortalama renk değerinden oluşan bir vektör.</div>
  <div class="quiz-option" data-correct="true">C) `I(x, y) = [R(x, y), G(x, y), B(x, y)]` formunda, her (x, y) konumunda üç renk kanalı için ayrı değerler içeren bir vektör değerli fonksiyon.</div>
  <div class="quiz-option">D) `I(t) = R(t) + G(t) + B(t)` formunda, zamana bağlı renk değişimini gösteren bir fonksiyon.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir renkli görüntü, her bir piksel konumu için Kırmızı, Yeşil ve Mavi kanallarına ait ayrı intensity değerlerini içeren çok kanallı bir yapı olarak temsil edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Aşağıdakilerden hangisi "Salt and Pepper" gürültüsünü en iyi tanımlar?</p>
  <div class="quiz-option">A) Görüntünün tamamında hafif, tanecikli bir bozulma.</div>
  <div class="quiz-option">B) Görüntüde periyodik dalga desenleri.</div>
  <div class="quiz-option" data-correct="true">C) Görüntüdeki bazı piksellerin rastgele tam siyah veya tam beyaz olması.</div>
  <div class="quiz-option">D) Görüntünün renklerinin soluklaşması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Salt and Pepper gürültüsü, belirli piksellerin değerlerini aniden minimum (siyah, "pepper") veya maksimum (beyaz, "salt") değerlere değiştirerek kendini gösterir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Dijital bir görüntüde "Quantization" (Niceleme) seviyesini çok fazla düşürmek (örneğin 256 seviyeden 8 seviyeye indirmek) ne tür bir görsel bozulmaya yol açar?</p>
  <div class="quiz-option">A) Görüntünün bulanıklaşması (blurring).</div>
  <div class="quiz-option">B) Görüntüde "Salt and Pepper" gürültüsü oluşması.</div>
  <div class="quiz-option" data-correct="true">C) Görüntüde renk geçişlerinin pürüzsüzlüğünü kaybedip bantlar halinde görünmesi (posterization).</div>
  <div class="quiz-option">D) Görüntünün geometrik olarak bozulması (distortion).</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Quantization seviyesinin düşürülmesi, temsil edilebilecek renk sayısını azaltır. Bu durum, yumuşak renk ve ton geçişlerinin kaybolmasına ve keskin sınırlarla ayrılmış renk bantlarının oluşmasına, yani "posterization" etkisine neden olur.</p>
  </div>
</div>
