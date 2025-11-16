---
layout: default
title: Görüntüler ve Gürültü
nav_order: 4
parent: Computer Vision
---

# Görüntülerin Temsili ve Gürültü Modelleri

Computer Vision algoritmalarını uygulayabilmek için önce temel yapı taşımızı anlamalıyız: dijital görüntünün kendisi. Bu bölümde, bir görüntünün teorik bir fonksiyondan piksellerden oluşan bir matrise nasıl dönüştüğünü ve bu süreçte ortaya çıkabilecek yaygın bozulmaları (gürültüyü) inceleyeceğiz.

---

## 1. Görüntüler Bir Fonksiyondur

Teorik olarak, bir görüntüyü iki boyutlu bir uzaydan (`x, y` koordinatları) bir yoğunluk değerine giden bir fonksiyon olarak düşünebiliriz: `I(x, y)`.

*   **Siyah-Beyaz (Grayscale) Görüntü:** `I(x, y)` fonksiyonu, o noktadaki parlaklığı temsil eden tek bir skaler değer (örn: 0-255 arası) döndürür.
*   **Renkli (RGB) Görüntü:** Fonksiyon, her biri bir renk kanalını (Kırmızı, Yeşil, Mavi) temsil eden üç değerden oluşan bir vektör döndürür: `I(x, y) = [ R(x,y), G(x,y), B(x,y) ]`.

### Dijital Görüntüler: Matrisler
Pratikte, bilgisayarlar bu sürekli (analog) fonksiyonları doğrudan işleyemez. Bu nedenle görüntüler iki adımla dijitalleştirilir:

1.  **Sampling (Örnekleme):** Sürekli görüntü uzayı, düzenli bir grid (ızgara) üzerinde örneklenir. Her bir ızgara hücresine **pixel (piksel)** denir. Bu, bir haritayı milimetrik karelere bölmeye benzer.
2.  **Quantization (Kuantalama):** Her pikseldeki (sonsuz hassasiyetteki) yoğunluk değeri, belirli bir aralıktaki tamsayılara yuvarlanır. En yaygın olarak, bu aralık `[0, 255]`'tir (her kanal için 8-bit). Bu da, her milimetrik karenin ortalama rakımını en yakın tam sayıya yuvarlamaya benzer.

Sonuç olarak, dijital bir görüntü, piksellerin sayısal yoğunluk değerlerini içeren 2 veya 3 boyutlu bir matristir.

<div class="quiz-question">
  <p><b>Soru:</b> 8-bit, 3 kanallı (RGB) ve `100x50` piksel boyutunda bir renkli görüntü, sıkıştırılmamış halde bellekte yaklaşık ne kadar yer kaplar?</p>
  <div class="quiz-option">A) 15 kilobayt (KB)</div>
  <div class="quiz-option">B) 5000 bayt</div>
  <div class="quiz-option" data-correct="true">C) 15000 bayt</div>
  <div class="quiz-option">D) 100 kilobayt (KB)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Toplam piksel sayısı = `100 * 50 = 5000`. Her piksel 3 renk kanalına sahiptir (`R, G, B`). Her kanal 8-bit, yani 1 bayt yer kaplar. Toplam yer = `5000 piksel * 3 kanal/piksel * 1 bayt/kanal = 15000 bayt`.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Analog bir görüntüyü dijital bir matrise dönüştürürken yapılan iki temel işlem sırasıyla nedir?</p>
  <div class="quiz-option" data-correct="true">A) Sampling (Örnekleme) ve Quantization (Kuantalama)</div>
  <div class="quiz-option">B) Kuantalama ve Gürültü Ekleme</div>
  <div class="quiz-option">C) Örnekleme ve Filtreleme</div>
  <div class="quiz-option">D) Fonksiyon ve Matris Dönüşümü</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> İlk olarak, sürekli görüntü uzayı piksellerden oluşan bir ızgaraya bölünür (Sampling). Ardından, her pikselin sonsuz hassasiyetteki renk/parlaklık değeri, sınırlı bir aralıktaki tamsayılara yuvarlanır (Quantization).</p>
  </div>
</div>

---

## 2. Noise (Gürültü)

Görüntüler, sensör kusurları, yetersiz ışık, elektronik parazitler veya veri iletimindeki hatalar gibi çeşitli nedenlerle bozulabilir. Bu bozulmalara **gürültü** denir. Gürültüyü, orijinal görüntü fonksiyonuna eklenen rastgele ve istenmeyen bir sinyal `η(x,y)` olarak modelleyebiliriz:

`I_noisy(x, y) = I_original(x, y) + η(x, y)`

### Yaygın Gürültü Türleri

*   **Gaussian Noise (Gaussian Gürültüsü):** Her piksele, ortalaması sıfır olan normal (Gaussian) bir dağılımdan rastgele seçilen bir değer eklenir. Görüntüye hafif, tanecikli bir doku katar. Düşük ışık koşullarında veya yüksek ISO ayarlarında sıkça görülür. Eski TV'lerdeki "karıncalanma"ya benzetilebilir.
*   **Salt and Pepper Noise (Tuz ve Biber Gürültüsü):** Görüntüdeki bazı piksellerin rastgele bir şekilde tamamen siyah (`0`, pepper) veya tamamen beyaz (`255`, salt) olmasına neden olur. Genellikle veri iletimi sırasında bit hatalarından veya arızalı sensör piksellerinden kaynaklanır.

<pre>
Orijinal Pikseller    Gaussian Gürültü      Salt & Pepper Gürültü
[[80, 82, 81],        [[78, 85, 80],        [[80, 255, 81],
 [83, 85, 84],   -->   [80, 82, 89],   -->   [0,   85, 84],
 [86, 88, 87]]         [90, 86, 85]]         [86, 88, 255]]
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Bir fotoğraf çekerken kamerayı hafifçe sallamanın neden olduğu bulanıklık, bu derste tanımlanan gürültü modellerinden hangisine girer?</p>
  <div class="quiz-option">A) Gaussian Noise</div>
  <div class="quiz-option">B) Salt and Pepper Noise</div>
  <div class="quiz-option">C) Impulse Noise</div>
  <div class="quiz-option" data-correct="true">D) Hiçbiri, bu farklı bir bozulma türüdür.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Hareket bulanıklığı (motion blur), piksellere rastgele değerler ekleyen bir gürültü modeli değildir. Bunun yerine, sahnenin birden fazla anının tek bir karede üst üste binmesinden kaynaklanan, daha yapısal bir bozulma türüdür ve farklı tekniklerle ele alınır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir dijital TV yayınında anlık bir sinyal bozulması nedeniyle görüntüde tek tük, rastgele parlak beyaz noktalar beliriyorsa, bu durum en çok hangi gürültü türüne benzer?</p>
  <div class="quiz-option">A) Gaussian Noise</div>
  <div class="quiz-option" data-correct="true">B) Salt and Pepper veya Impulse Noise</div>
  <div class="quiz-option">C) Motion Blur</div>
  <div class="quiz-option">D) Background Clutter</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Piksellerin orijinal değerlerini tamamen kaybedip en uç değerlere (bu durumda parlak beyaz, yani "salt") dönüşmesi, bu gürültü türünün en belirgin özelliğidir.</p>
  </div>
</div>

---

