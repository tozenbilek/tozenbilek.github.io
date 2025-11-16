---
layout: default
title: Projective Geometry ve Kamera Modelleri
nav_order: 13
parent: Computer Vision
---

# Projective Geometry ve Kamera Modelleri

Üç boyutlu (3D) bir dünyada yaşıyoruz ama onu kameralar aracılığıyla iki boyutlu (2D) görüntüler olarak algılıyoruz. **Projective Geometry (İzdüşümsel Geometri)**, bu 3D dünyayı 2D bir düzleme "haritalamanın" matematiksel kurallarını tanımlar. Bu bölümde, bu dönüşümün arkasındaki temel prensipleri ve en basit kamera modeli olan **Pinhole (iğne deliği) Kamera Modeli**'ni inceleyeceğiz.

---

## 1. Pinhole Kamera Modeli

Bir görüntünün nasıl oluştuğunu anlamak için en basit model, **Pinhole (iğne deliği) kamera** modelidir. Bu modelde, dış dünyadan gelen ışık ışınları, çok küçük bir delikten (optik merkez) geçerek arkadaki bir görüntü düzlemine (sensör) ters bir şekilde yansır.

Matematiksel kolaylık sağlamak için genellikle, optik merkezin *önüne* yerleştirilmiş ve görüntünün düz oluştuğu bir **sanal görüntü düzlemi** kullanılır.

<pre>
   Gerçek Dünya             Optik Merkez (O)        Sanal Görüntü Düzlemi
       ^ Y
       |
P(X,Y,Z) |                                       p(x,y)
       * . . . . . . . . . . . * . . . . . . . . . *
       |                       |                   |
       +-----------------------O-------------------+-> Z (Optik Eksen)
                               |                   |
                               |<---- f ---->| (odak uzaklığı)
</pre>

Benzer üçgenler kuralına göre, 3D uzaydaki bir `P = (X, Y, Z)` noktasının, odak uzaklığı `f` olan kameranın görüntü düzlemindeki `p = (x, y)` koordinatları:

`x = f * (X / Z)` ve `y = f * (Y / Z)`

**Önemli Sonuç:** Bir nesnenin görüntüdeki boyutu (`x,y`), kameraya olan uzaklığı (`Z`) ile ters orantılıdır.

<div class="quiz-question">
  <p><b>Soru:</b> Pinhole kamera modeline göre, bir nesne kameradan iki kat uzaklaştırılırsa, görüntüdeki boyutu nasıl değişir?</p>
  <div class="quiz-option">A) İki katına çıkar.</div>
  <div class="quiz-option" data-correct="true">B) Yarıya düşer.</div>
  <div class="quiz-option">C) Değişmez.</div>
  <div class="quiz-option">D) Dörtte birine düşer.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Yansıtma denklemleri `x = f * X / Z` ve `y = f * Y / Z`'dir. Görüntü boyutu `x` ve `y`, nesnenin uzaklığı `Z` ile ters orantılıdır. `Z` iki katına çıkarsa, `x` ve `y` yarıya düşer.</p>
  </div>
</div>

---

## 2. Homogeneous Coordinates (Homojen Koordinatlar)

Yukarıdaki yansıtma denklemlerindeki `Z`'ye bölme işlemi, denklemi **non-linear (doğrusal olmayan)** yapar. **Homojen koordinatlar**, bu bölme işleminden kurtularak, yansıtma (projection), öteleme (translation) ve döndürme (rotation) gibi tüm 3D dönüşümleri tek bir matris çarpımıyla, yani **doğrusal** bir şekilde ifade etmemizi sağlayan güçlü bir matematiksel araçtır.

Fikir basittir: `n` boyutlu bir noktayı temsil etmek için `n+1` boyutlu bir vektör kullanırız.
*   2D'deki bir `(x, y)` noktası ⇔ `(x, y, 1)` veya `(kx, ky, k)`
*   3D'deki bir `(X, Y, Z)` noktası ⇔ `(X, Y, Z, 1)`

Homojen bir `(x, y, w)` vektöründen standart 2D koordinatlara geri dönmek için `w`'ya böleriz: `(x/w, y/w)`. Bu sistemde `w=0` olan noktalar "sonsuzdaki noktaları" temsil eder.

Pinhole kamera yansıtmasını tek bir matris çarpımıyla şöyle ifade edebiliriz:

<pre>
[x']   [f, 0, 0, 0] [X]
[y'] = [0, f, 0, 0] [Y]   (Sonuçta: x = x'/w', y = y'/w')
[w']   [0, 0, 1, 0] [Z]
                    [1]
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Homojen koordinatların Computer Vision ve grafik alanında kullanılmasının en temel avantajı nedir?</p>
  <div class="quiz-option">A) Daha az bellek kullanması.</div>
  <div class="quiz-option" data-correct="true">B) Öteleme, döndürme ve yansıtma gibi farklı geometrik dönüşümleri tek bir matris çarpımında birleştirebilmesi.</div>
  <div class="quiz-option">C) Sadece 2D geometride çalışması.</div>
  <div class="quiz-option">D) Görüntüdeki gürültüyü azaltması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Homojen koordinatlar sayesinde, normalde matris çarpımı + vektör toplamı olarak ifade edilen dönüşümler (örn: öteleme), tek bir birleşik matris çarpımı haline getirilebilir. Bu, donanım hızlandırmasını ve hesaplamaları büyük ölçüde basitleştirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Standart 2D uzaydaki `(8, 6)` noktasının homojen koordinatlardaki temsili aşağıdakilerden hangisi olabilir?</p>
  <div class="quiz-option">A) (8, 6)</div>
  <div class="quiz-option">B) (8, 6, 0)</div>
  <div class="quiz-option" data-correct="true">C) (16, 12, 2)</div>
  <div class="quiz-option">D) (8, 6, 1, 1)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir `(x,y)` noktasının homojen temsili `(kx, ky, k)` şeklindedir (`k≠0`). `(16, 12, 2)` vektörünü standart koordinatlara çevirmek için `(16/2, 12/2)` işlemi yapılır ve bu da `(8, 6)` sonucunu verir. `(8, 6, 1)` de doğru bir temsil olurdu.</p>
  </div>
</div>

---

## 3. Vanishing Points (Ufuk Noktaları)

İzdüşümsel geometrinin en ilginç sonuçlarından biri, gerçek dünyada birbirine **paralel olan çizgilerin, görüntüde tek bir noktada birleşiyormuş gibi görünmesidir.** Bu birleşme noktasına **vanishing point (ufuk noktası)** denir.

*   Bir küpün üç farklı yöne giden paralel kenar setleri, görüntüde üç farklı ufuk noktası oluşturur.
*   Aynı düzlem üzerindeki (örneğin yer düzlemi) tüm ufuk noktaları, **vanishing line (ufuk çizgisi veya horizon)** adı verilen tek bir çizgi üzerinde yer alır.

Bu prensip, bir fotoğraftaki kameranın açısını anlamak, nesnelerin göreceli boyutlarını tahmin etmek veya bir görüntüye sanal nesneler eklemek (CGI) gibi birçok uygulama için kullanılır.

<div class="quiz-question">
  <p><b>Soru:</b> Bir binanın fotoğrafında, binanın sol ve sağ tarafındaki birbirine paralel olan çatı çizgilerinin görüntüde tek bir noktada birleştiği görülür. Bu noktaya ne ad verilir?</p>
  <div class="quiz-option">A) Optik Merkez</div>
  <div class="quiz-option" data-correct="true">B) Vanishing Point (Ufuk Noktası)</div>
  <div class="quiz-option">C) Odak Noktası (Focal Point)</div>
  <div class="quiz-option">D) Ana Nokta (Principal Point)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gerçek dünyada paralel olan çizgilerin, perspektif yansıması nedeniyle 2D bir görüntüde kesiştikleri noktaya "ufuk noktası" denir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir otoyol fotoğrafında, yolun kenar çizgilerinin ufukta bir noktada birleştiğini görüyoruz. Bu bilgi, tek başına bize ne gibi bir çıkarım yapma imkanı sağlar?</p>
  <div class="quiz-option">A) Otoyolun hangi malzemeden yapıldığını.</div>
  <div class="quiz-option">B) Fotoğrafın hangi saatte çekildiğini.</div>
  <div class="quiz-option" data-correct="true">C) Fotoğrafı çeken kameranın yer düzlemine göre açısı ve yüksekliği hakkında bir ipucu.</div>
  <div class="quiz-option">D) Arabaların hızını.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Ufuk çizgisinin (vanishing line) görüntüdeki konumu, kameranın ufka göre ne kadar yukarıda veya aşağıda olduğunu (eğimi) ve yüksekliğini belirlemede kullanılır. Bu, 3D sahne rekonstrüksiyonunun temel adımlarından biridir.</p>
  </div>
</div>

---

