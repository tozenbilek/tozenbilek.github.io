---
layout: default
title: Çizgiler İçin Hough Dönüşümü
nav_order: 11
parent: Computer Vision
---

# Çizgiler İçin Hough Dönüşümü

Hough Dönüşümü'nün temel mantığını anladıktan sonra, şimdi bu tekniği en yaygın ve temel uygulama alanı olan çizgi tespitine nasıl uygulayacağımızı inceleyelim.

---

## 1. Parametre Temsilinin Sorunu

Bir çizgiyi temsil etmek için akla ilk gelen denklem `y = mx + b`'dir. Ancak bu temsilin pratik bir sorunu vardır: **Dikey çizgiler**. Dikey bir çizgi için eğim (`m`) sonsuzdur. Parametre uzayımızın bir ekseninin sonsuz bir aralığa sahip olması, bilgisayarda bir oy sandığı (histogram) oluşturmayı imkansız hale getirir.

---

## 2. Çözüm: Kutupsal Koordinat (Polar) Temsili

Bu sorunu çözmek için, bir çizgiyi temsil etmenin farklı ve daha gürbüz (robust) bir yolunu kullanırız: **Kutupsal Koordinat Temsili**.

Bu yaklaşımda, bir çizgi iki parametre ile tanımlanır:
*   **`ρ` (rho):** Çizginin, koordinat sisteminin orijinine `(0,0)` olan dik mesafesi.
*   **`θ` (theta):** Bu dikme çizgisinin x-ekseni ile yaptığı açı.

Bu parametrelerle, görüntüdeki herhangi bir `(x, y)` noktasından geçen bir çizgi şu denklemle ifade edilir:

`ρ = x cos(θ) + y sin(θ)`

![Polar Coordinates for a Line](https://via.placeholder.com/500x350.png?text=Kutupsal+Koordinatlarla+Çizgi+Temsili)
*Görsel: Bir çizginin (ρ, θ) parametreleri ile tanımlanması.*

Bu temsilin en büyük avantajı, parametrelerin aralığının sınırlı olmasıdır:
*   `θ` genellikle `[-90°, 90°]` veya `[0°, 180°]` aralığında değişir.
*   `ρ` ise görüntünün köşegen uzunluğundan daha büyük olamaz.

Bu sınırlı aralıklar, parametre uzayını (`(ρ, θ)` uzayını) sonlu boyutlarda bir oy sandığı (akkümülatör matrisi) olarak oluşturmamızı sağlar.

---

## 3. Parametre Uzayında Oylama

Kutupsal koordinat sisteminde, görüntü uzayındaki `(x₀, y₀)` gibi **tek bir nokta**, `(ρ, θ)` parametre uzayında artık bir çizgi değil, bir **sinüs eğrisi** oluşturur: `ρ = x₀ cos(θ) + y₀ sin(θ)`.

Oylama süreci şu şekilde işler:
1.  `(ρ, θ)` parametre uzayını temsil eden 2D bir "oy sandığı" (akkümülatör matrisi) oluşturulur ve tüm değerleri sıfırlanır.
2.  Görüntüdeki her bir kenar pikseli `(x, y)` için:
    a. Mümkün olan her `θ` değeri (belirli bir adımla, örn: her 1 derece) için `ρ = x cos(θ) + y sin(θ)` denklemi kullanılarak karşılık gelen `ρ` değeri hesaplanır.
    b. Akkümülatör matrisindeki `(ρ, θ)` hücresinin değeri bir artırılır.
3.  Tüm kenar pikselleri için oylama bittiğinde, akkümülatör matrisindeki en yüksek değere sahip hücreler (tepe noktaları), görüntüdeki en belirgin çizgilerin `(ρ, θ)` parametrelerini verir.

![Hough Accumulator](https://via.placeholder.com/700x300.png?text=Kenar+Görüntüsü+->+Oylama+->+Akkümülatör+Matrisi)
*Görsel: Soldaki kenar pikselleri, sağdaki Hough parametre uzayında oy kullanır. Üç parlak tepe noktası, görüntüdeki üç çizgiye karşılık gelir.*

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Çizgiler için Hough Dönüşümü'nde `y = mx + b` yerine kutupsal koordinat `(ρ, θ)` temsilinin kullanılmasının ana nedeni nedir?</p>
  <div class="quiz-option">A) Kutupsal koordinatların hesaplamasının daha hızlı olması.</div>
  <div class="quiz-option">B) Daha az belleğe ihtiyaç duyması.</div>
  <div class="quiz-option" data-correct="true">C) Dikey çizgileri de temsil edebilen sınırlı bir parametre uzayı sunması.</div>
  <div class="quiz-option">D) Sadece yatay çizgileri bulabilmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> `y = mx + b` denklemi, dikey çizgiler için sonsuz bir eğim (`m`) değeri gerektirir, bu da parametre uzayını sonsuz yapar. Kutupsal koordinat sisteminde ise hem `ρ` hem de `θ` sınırlı bir aralıkta değerler alır, bu da onu bilgisayarda uygulamak için uygun ve gürbüz bir yöntem haline getirir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Kutupsal `(ρ, θ)` temsilinde, görüntüdeki **tek bir kenar pikseli** Hough parametre uzayında neye karşılık gelir?</p>
  <div class="quiz-option">A) Bir nokta.</div>
  <div class="quiz-option">B) Bir çizgi.</div>
  <div class="quiz-option" data-correct="true">C) Bir sinüs eğrisi.</div>
  <div class="quiz-option">D) Bir çember.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Sabit bir `(x, y)` pikseli için `ρ = x cos(θ) + y sin(θ)` denklemi, `θ` değiştikçe `ρ`'nun sinüsoidal bir şekilde değiştiği bir eğriyi tanımlar. Görüntüdeki her nokta, parametre uzayında kendine özgü bir sinüs eğrisi çizer.</p>
  </div>
</div>

