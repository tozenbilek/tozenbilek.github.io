---
layout: default
title: Projective Geometry ve Kamera Modelleri
nav_order: 13
parent: Computer Vision
---

# Projective Geometry ve Kamera Modelleri

Üç boyutlu (3D) bir dünyada yaşıyoruz ama onu kameralar aracılığıyla iki boyutlu (2D) görüntüler olarak algılıyoruz. Computer Vision'ın temel zorluklarından biri, bu 3D-2D dönüşümünü ve bunun getirdiği belirsizlikleri anlamaktır. Bu bölümde, bu dönüşümün arkasındaki matematiksel temel olan **İzdüşümsel Geometri (Projective Geometry)** ve en basit kamera modeli olan **Pinhole (iğne deliği) Kamera Modeli**'ni inceleyeceğiz.

---

## 1. Pinhole Kamera Modeli

Bir görüntünün nasıl oluştuğunu anlamak için en basit model, "camera obscura" veya **Pinhole (iğne deliği) kamera** modelidir. Bu modelde, dış dünyadan gelen ışık ışınları, çok küçük bir delikten geçerek arkadaki bir görüntü düzlemine (film veya sensör) ters bir şekilde yansır.

![Pinhole Camera Model](https://via.placeholder.com/600x350.png?text=3D+Dünya+->+İğne+Deliği+->+2D+Görüntü+Düzlemi)
*Görsel: Pinhole kamera modeli. 3D dünyadaki bir P noktası, optik merkezden (iğne deliği) geçen bir ışınla görüntü düzlemindeki p noktasına yansır.*

Benzer üçgenler kullanarak, 3D uzaydaki bir `P = (X, Y, Z)` noktasının, odak uzaklığı `f` olan bir kameranın görüntü düzlemindeki `p = (x, y)` koordinatlarını hesaplayabiliriz:

`x = f * (X / Z)`
`y = f * (Y / Z)`

**Önemli Sonuç:** Bir nesnenin görüntüdeki boyutu, kameraya olan uzaklığı (`Z`) ile ters orantılıdır. Uzaktaki nesneler daha küçük görünür.

---

## 2. Homojen Koordinatlar (Homogeneous Coordinates)

Yukarıdaki yansıtma denklemlerinde `Z`'ye bölme işlemi vardır. Bu, denklemi **doğrusal olmayan (non-linear)** yapar. Doğrusal olmayan denklemlerle çalışmak matematiksel olarak daha zordur.

**Homojen koordinatlar**, bu bölme işleminden kurtularak izdüşüm (projection) gibi işlemleri tek bir matris çarpımıyla, yani **doğrusal** bir şekilde ifade etmemizi sağlayan güçlü bir matematiksel araçtır.

Fikir basittir: `n` boyutlu bir uzaydaki bir noktayı temsil etmek için `n+1` boyutlu bir vektör kullanırız.
*   2D'deki bir `(x, y)` noktası, homojen koordinatlarda `(x, y, 1)` veya `(kx, ky, k)` (herhangi bir `k ≠ 0` için) olarak temsil edilir.
*   3D'deki bir `(X, Y, Z)` noktası, `(X, Y, Z, 1)` olarak temsil edilir.

Homojen bir `(x, y, w)` vektöründen standart 2D koordinatlara geri dönmek için ilk iki bileşeni üçüncüye böleriz: `(x/w, y/w)`.

Bu sistem sayesinde, Pinhole kamera yansıtmasını tek bir matris çarpımıyla ifade edebiliriz:

![Projection Matrix](https://via.placeholder.com/700x150.png?text=[x,y,w]'_image+=+P_matrix+*+[X,Y,Z,1]'_world)
*Görsel: Homojen koordinatlar kullanılarak 3D dünya noktasının 2D görüntü noktasına yansıtılması, 3x4'lük bir Projeksiyon Matrisi (P) ile doğrusal bir çarpıma dönüşür.*

---

## 3. Ufuk Noktaları ve Çizgileri (Vanishing Points and Lines)

İzdüşümsel geometrinin en ilginç sonuçlarından biri, gerçek dünyada birbirine **paralel olan çizgilerin, görüntüde tek bir noktada birleşiyormuş gibi görünmesidir.** Bu birleşme noktasına **ufuk noktası (vanishing point)** denir.

*   Örneğin, tren rayları veya bir yolun kenarları, sonsuzda birleşiyormuş gibi görünür.
*   Farklı yönlere giden paralel çizgiler (örneğin bir küpün farklı kenarları) farklı ufuk noktaları oluşturur.
*   Aynı düzlem üzerindeki (örneğin yer düzlemi) tüm ufuk noktaları, **ufuk çizgisi (vanishing line veya horizon)** adı verilen tek bir çizgi üzerinde yer alır.

Bu prensip, görüntülerden 3D yapı hakkında ipuçları çıkarmak, sahte görüntüleri tespit etmek veya bir görüntünün perspektifini analiz etmek için kullanılır.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Pinhole kamera modeline göre, bir nesne kameradan iki kat uzaklaştırılırsa, görüntüdeki boyutu nasıl değişir?</p>
  <div class="quiz-option">A) İki katına çıkar.</div>
  <div class="quiz-option" data-correct="true">B) Yarıya düşer.</div>
  <div class="quiz-option">C) Değişmez.</div>
  <div class="quiz-option">D) Dörtte birine düşer.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Yansıtma denklemleri `x = f * X / Z` ve `y = f * Y / Z`'dir. Görüntü boyutu `x` ve `y`, nesnenin uzaklığı `Z` ile ters orantılıdır. `Z` iki katına çıkarsa, `x` ve `y` yarıya düşer.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> İzdüşümsel geometride, 3D'den 2D'ye yansıtma gibi işlemleri doğrusal bir matris çarpımı olarak ifade edebilmek için hangi araç kullanılır?</p>
  <div class="quiz-option">A) Kutupsal Koordinatlar</div>
  <div class="quiz-option">B) Fourier Dönüşümü</div>
  <div class="quiz-option" data-correct="true">C) Homojen Koordinatlar</div>
  <div class="quiz-option">D) Gaussian Filtreleri</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Homojen koordinatlar, bir boyut ekleyerek, yansıtma gibi normalde bölme içeren ve doğrusal olmayan işlemleri, tek bir matris çarpımıyla ifade etmemizi sağlar. Bu, bilgisayar grafikleri ve Computer Vision'da hesaplamaları büyük ölçüde basitleştirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir binanın fotoğrafında, binanın sol ve sağ tarafındaki birbirine paralel olan çatı çizgilerinin görüntüde tek bir noktada birleştiği görülür. Bu noktaya ne ad verilir?</p>
  <div class="quiz-option">A) Optik Merkez</div>
  <div class="quiz-option" data-correct="true">B) Ufuk Noktası (Vanishing Point)</div>
  <div class="quiz-option">C) Odak Noktası (Focal Point)</div>
  <div class="quiz-option">D) Ana Nokta (Principal Point)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gerçek dünyada paralel olan çizgilerin, perspektif yansıması nedeniyle 2D bir görüntüde kesiştikleri noktaya "ufuk noktası" denir.</p>
  </div>
</div>

