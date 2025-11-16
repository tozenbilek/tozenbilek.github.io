---
layout: default
title: Çizgiler İçin Hough Dönüşümü
nav_order: 11
parent: Computer Vision
---

# Çizgiler İçin Hough Dönüşümü

Hough Dönüşümü'nün temel "oylama" mantığını anladıktan sonra, şimdi bu zarif fikri en yaygın ve temel uygulama alanı olan çizgi tespitine nasıl uygulayacağımızı görelim.

---

## 1. Sorun: `y = mx + b` Temsili ve Sonsuz Parametre Uzayı

Bir çizgiyi temsil etmek için akla ilk gelen denklem `y = mx + b`'dir. Ancak bu temsilin pratik bir sorunu vardır: **Dikey çizgiler**. Dikey bir çizgi için eğim (`m`) sonsuzdur. Parametre uzayımızın (`m, b`) bir ekseninin sonsuz bir aralığa sahip olması, bilgisayarda sonlu boyutlu bir oy sandığı (histogram) oluşturmayı imkansız hale getirir.

<div class="quiz-question">
  <p><b>Soru:</b> `y = mx + b` çizgi temsilinin dikey çizgiler için pratik bir sorun yaratmasının temel nedeni nedir?</p>
  <div class="quiz-option">A) `b` (y-keseni) değerinin sıfır olması.</div>
  <div class="quiz-option" data-correct="true">B) `m` (eğim) parametresinin sonsuz bir değere ihtiyaç duyması, bu da oy sandığını sonsuz boyutlu yapar.</div>
  <div class="quiz-option">C) Yatay çizgileri temsil edememesi.</div>
  <div class="quiz-option">D) Hesaplamasının çok yavaş olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Hough Dönüşümü, parametreleri sonlu bir aralıkta diskretize ederek bir "oy sandığı" (matris) oluşturur. `m` parametresi sonsuz bir aralığa sahip olabileceğinden, bu temsil ile sonlu bir oy sandığı oluşturmak mümkün değildir.</p>
  </div>
</div>

---

## 2. Çözüm: Polar (Kutupsal) Koordinat Temsili

Bu sorunu çözmek için, bir çizgiyi temsil etmenin daha gürbüz (robust) bir yolunu kullanırız: **Polar (Kutupsal) Koordinat Temsili**.

Bu yaklaşımda, bir çizgi iki parametre ile tanımlanır:
*   **`ρ` (rho):** Çizginin, koordinat sisteminin orijinine `(0,0)` olan dik mesafesi.
*   **`θ` (theta):** Bu dikme çizgisinin x-ekseni ile yaptığı açı.

Denklem: `ρ = x cos(θ) + y sin(θ)`

<pre>
        y^
         |
         |   /
         |  /|
         | / |
         |/  |
---------+---*-----> x
       /| \  | dikey mesafe (ρ)
      / |  \ |
     /  |   \|
    Çizgi
</pre>

Bu temsilin en büyük avantajı, parametrelerin aralığının **sınırlı** olmasıdır: `θ` genellikle `[0°, 180°]` aralığında, `ρ` ise görüntünün köşegen uzunluğu ile sınırlıdır. Bu, `(ρ, θ)` parametre uzayını sonlu boyutlarda bir oy sandığı (akkümülatör matrisi) olarak oluşturmamızı sağlar.

<div class="quiz-question">
  <p><b>Soru:</b> Orijinden geçen ve x-ekseni ile 45 derece açı yapan bir çizginin `(ρ, θ)` parametreleri ne olur?</p>
  <div class="quiz-option">A) `ρ=45, θ=0`</div>
  <div class="quiz-option">B) `ρ=1, θ=45`</div>
  <div class="quiz-option" data-correct="true">C) `ρ=0, θ=135`</div>
  <div class="quiz-option">D) `ρ=0, θ=45`</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Çizgi orijinden geçtiği için, orijine olan dik mesafesi `ρ=0`'dır. Çizginin kendisi 45 derece açıyla durmaktadır. `θ` ise çizgiye dik olan doğrunun açısıdır. 45 derecelik bir çizgiye dik olan doğru, `45 + 90 = 135` derece açıyla durur. Dolayısıyla `θ=135` olur.</p>
  </div>
</div>

---

## 3. Parametre Uzayında Oylama (Sinüs Eğrileri)

Kutupsal koordinat sisteminde, Duality (İkililik) prensibi hala geçerlidir ancak şekil değiştirir: Görüntü uzayındaki `(x₀, y₀)` gibi **tek bir nokta**, `(ρ, θ)` parametre uzayında artık bir çizgi değil, bir **sinüs eğrisi** oluşturur: `ρ = x₀ cos(θ) + y₀ sin(θ)`.

Oylama süreci şu şekilde işler:
1.  `(ρ, θ)` parametre uzayını temsil eden 2D bir "oy sandığı" (`accumulator`) matrisi oluşturulur ve tüm değerleri sıfırlanır.
2.  Görüntüdeki her bir kenar pikseli `(x, y)` için, parametre uzayında bir sinüs eğrisi "çizilir" ve bu eğrinin geçtiği tüm `(ρ, θ)` hücrelerinin oyu bir artırılır.
3.  Tüm kenar pikselleri için oylama bittiğinde, `accumulator` matrisindeki en çok sayıda sinüs eğrisinin kesiştiği, yani en yüksek oyu alan hücreler (tepe noktaları), görüntüdeki en belirgin çizgilerin `(ρ, θ)` parametrelerini verir.

<pre>
 Accumulator Matrisi (Oy Sandığı)

      ... θ=89° θ=90° θ=91° ...
ρ=10  | .. |  5  | .. | .. |
ρ=11  | .. |  4  | .. | .. |
ρ=12  | .. | <b>25</b>  | .. | .. |  <-- Tepe Noktası (En Yüksek Oy)
ρ=13  | .. |  8  | .. | .. |

Sonuç: Görüntüde (ρ=12, θ=90°) parametrelerine sahip
       bir çizgi (dikey bir çizgi) bulunma ihtimali çok yüksektir.
</pre>

<div class="quiz-question">
  <p><b>Soru:</b> Kutupsal `(ρ, θ)` temsilinde, görüntüdeki **tek bir kenar pikseli** Hough parametre uzayında neye karşılık gelir?</p>
  <div class="quiz-option">A) Bir nokta.</div>
  <div class="quiz-option">B) Bir çizgi.</div>
  <div class="quiz-option" data-correct="true">C) Bir sinüs eğrisi.</div>
  <div class="quiz-option">D) Bir çember.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Sabit bir `(x, y)` pikseli için `ρ = x cos(θ) + y sin(θ)` denklemi, `θ` değiştikçe `ρ`'nun sinüsoidal bir şekilde değiştiği bir eğriyi tanımlar. Görüntüdeki her nokta, parametre uzayında kendine özgü bir sinüs eğrisi çizer.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Oylama işlemi bittikten sonra, Hough accumulator matrisindeki `(ρ=50, θ=45)` hücresinde `120` değeri okunuyorsa, bu ne anlama gelir?</p>
  <div class="quiz-option">A) Görüntüde 120 piksel vardır.</div>
  <div class="quiz-option" data-correct="true">B) Orijine 50 piksel uzaklıkta ve 45 derece açıyla duran bir çizginin üzerinde yaklaşık 120 adet kenar pikseli bulunmaktadır.</div>
  <div class="quiz-option">C) Görüntünün (50, 45) koordinatında bir çizgi vardır.</div>
  <div class="quiz-option">D) Görüntüdeki en uzun çizgi 120 pikseldir.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Accumulator'daki her bir hücre, belirli `(ρ, θ)` parametrelerine sahip bir çizgiyi temsil eder. Hücrenin içindeki değer ise, o çizgi için kaç adet kenar pikselinin "oy kullandığını" gösterir. Yüksek bir değer, o çizgiyi oluşturan güçlü bir kanıt demektir.</p>
  </div>
</div>

---

