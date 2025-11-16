---
layout: default
title: Görüntüler ve Gürültü
nav_order: 4
parent: Computer Vision
---

# Görüntülerin Temsili ve Gürültü Modelleri

Filtreleme gibi ileri konulara geçmeden önce, bir dijital görüntünün temel olarak ne olduğunu ve bu görüntülerin kalitesini bozan yaygın gürültü türlerini anlamamız gerekir.

---

## 1. Görüntüler Bir Fonksiyondur

Teorik olarak, bir görüntüyü iki boyutlu bir uzaydan (`R²`) bir yoğunluk değerine (`R`) giden bir fonksiyon olarak düşünebiliriz:
`I(x, y)`

Bu fonksiyon, `(x, y)` koordinatındaki bir noktanın parlaklık (yoğunluk) değerini verir. Siyah-beyaz bir görüntü için bu değer tek bir skalerdir.

### Renkli Görüntüler
Renkli bir görüntü ise, her biri bir renk kanalını (Kırmızı, Yeşil, Mavi) temsil eden üç fonksiyonun birleşimidir. Bunu vektör değerli bir fonksiyon olarak ifade edebiliriz:

`I(x, y) = [ R(x,y), G(x,y), B(x,y) ]`

### Dijital Görüntüler
Pratikte, bilgisayarlar sürekli (analog) fonksiyonlarla çalışamaz. Bu nedenle görüntüler dijitalleştirilir:
1.  **Sampling (Örnekleme):** Görüntü uzayı, düzenli bir grid (ızgara) üzerinde örneklenir. Her bir ızgara noktası bir **pixel (piksel)** olur.
2.  **Quantization (Kuantalama):** Her pikseldeki yoğunluk değeri, belirli bir aralıktaki tamsayılara yuvarlanır. En yaygın olarak, bu aralık `[0, 255]`'tir (8-bit).

Sonuç olarak, dijital bir görüntü, piksellerin yoğunluk değerlerini içeren 2 boyutlu bir matristir.

![Digital Image](https://via.placeholder.com/600x300.png?text=Analog+Görüntü+->+Örnekleme/Kuantalama+->+Piksel+Matrisi)
*Görsel: Analog bir görüntünün dijital bir piksel matrisine dönüştürülme süreci.*

---

## 2. Noise (Gürültü)

Görüntüler, sensör kusurları, yetersiz ışık, elektronik parazitler veya veri iletimindeki hatalar gibi çeşitli nedenlerle bozulabilir. Bu bozulmalara **gürültü** denir. Gürültüyü, orijinal görüntü fonksiyonuna eklenen istenmeyen bir sinyal `η(x,y)` olarak modelleyebiliriz:

`I_noisy(x, y) = I_original(x, y) + η(x, y)`

### Yaygın Gürültü Türleri

*   **Gaussian Noise (Gaussian Gürültüsü):** Her piksele, ortalaması sıfır olan normal (Gaussian) bir dağılımdan rastgele seçilen bir değer eklenir. Görüntüye hafif, tanecikli bir doku katar. Düşük ışık koşullarında sensör ısınması nedeniyle sıkça görülür.

*   **Salt and Pepper Noise (Tuz ve Biber Gürültüsü):** Görüntüdeki bazı piksellerin rastgele bir şekilde tamamen siyah (`0`, pepper) veya tamamen beyaz (`255`, salt) olmasına neden olur. Genellikle veri iletimi sırasında bit hatalarından kaynaklanır.

*   **Impulse Noise (Darbe Gürültüsü):** Sadece beyaz piksellerin (`255`) rastgele eklenmesiyle oluşur, "salt" gürültüsüne benzer.

![Noise Types](https://via.placeholder.com/700x250.png?text=Orijinal+|+Gaussian+Gürültü+|+Tuz+ve+Biber+Gürültüsü)
*Görsel: Yaygın gürültü türlerinin bir görüntü üzerindeki etkileri.*

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> 8-bit bir renkli dijital görüntünün `(10, 20)` pikselindeki RGB değeri `[150, 200, 50]` ise, bu bilgiyi matematiksel olarak nasıl ifade etmek en doğrudur?</p>
  <div class="quiz-option">A) `I(10, 20) = 150`</div>
  <div class="quiz-option">B) `I(10) = [150, 200, 50]`</div>
  <div class="quiz-option" data-correct="true">C) `I(10, 20) = [150, 200, 50]`</div>
  <div class="quiz-option">D) `I(x, y) = R(150) + G(200) + B(50)`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Görüntü, `(x, y)` koordinatlarını girdi alan bir fonksiyondur. Renkli bir görüntü için, bu fonksiyon o koordinattaki renk kanallarını içeren bir vektör (veya demet) döndürür.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir fotoğraf çekerken kamerayı hafifçe sallamanın neden olduğu bulanıklık, bu derste tanımlanan gürültü modellerinden hangisine girer?</p>
  <div class="quiz-option">A) Gaussian Noise</div>
  <div class="quiz-option">B) Salt and Pepper Noise</div>
  <div class="quiz-option">C) Impulse Noise</div>
  <div class="quiz-option" data-correct="true">D) Hiçbiri, bu farklı bir bozulma türüdür.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: D.</b> Hareket bulanıklığı (motion blur), piksellere rastgele değerler ekleyen bir gürültü modeli değildir. Bunun yerine, sahnenin birden fazla anının tek bir karede üst üste binmesinden kaynaklanan, daha yapısal bir bozulma türüdür ve farklı tekniklerle ele alınır.</p>
  </div>
</div>

