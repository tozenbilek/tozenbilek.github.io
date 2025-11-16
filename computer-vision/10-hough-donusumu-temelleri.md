---
layout: default
title: Hough Dönüşümü Temelleri
nav_order: 10
parent: Computer Vision
---

# Hough Dönüşümü Temelleri: Oylama ile Şekil Bulma

Önceki bölümde, Canny gibi algoritmalarla bir görüntüdeki kenar piksellerini nasıl bulacağımızı öğrendik. Ancak bu, bize sadece kenarların nerede olduğunu söyler, bu kenarların bir araya gelerek bir çizgi mi, çember mi yoksa başka bir geometrik şekil mi oluşturduğunu söylemez.

**Hough Dönüşümü (Hough Transform)**, bu dağınık kenar pikselleri setinden, belirli parametrelere sahip global yapıları (çizgiler, çemberler vb.) çıkarmak için kullanılan güçlü bir "oylama" tekniğidir.

---

## 1. Temel Fikir: Oylama (Voting)

Hough Dönüşümü'nün arkasındaki ana fikir son derece sezgiseldir: **Bırakın pikseller, ait oldukları şekil için oy versin!**

1.  Öncelikle, görüntüdeki kenar pikselleri (örneğin, Canny ile) bulunur.
2.  Aradığımız şeklin (örneğin bir çizgi) bir parametrik denklemi vardır.
3.  Her bir kenar pikseli, kendisinin bir parçası olabileceği **tüm olası şekiller** için "oy" kullanır.
4.  Bu oylar, **parametre uzayı (Hough space)** adı verilen bir "oy sandığında" (genellikle bir 2D matris/histogram) biriktirilir.
5.  Oylama bittiğinde, oy sandığındaki en yüksek oy alan "kutucuklar", görüntüdeki en olası şekillerin parametrelerini temsil eder.

Bu yaklaşım, gürültüye ve nesnelerin kısmen gizlenmiş (occlusion) olmasına karşı oldukça dayanıklıdır. Gürültülü piksellerin oyları parametre uzayına rastgele dağılırken, "gerçek" bir şekle ait piksellerin oyları tutarlı bir şekilde tek bir noktada birikecektir.

---

## 2. Görüntü Uzayından Parametre Uzayına

Hough Dönüşümü'nün büyüsü, problemi görüntü uzayında (`x, y` koordinatları) çözmek yerine, şeklin parametrelerinin uzayında çözmesidir.

**Çizgi Örneği:**
Bir çizgiyi `y = mx + b` denklemiyle temsil edelim. Bu denklemin parametreleri `m` (eğim) ve `b`'dir (y-keseni).

*   **Görüntü Uzayında:** Bir çizgi, sonsuz sayıda noktadan oluşur. Bir nokta, `(x₀, y₀)` gibi tek bir koordinattır.
*   **Parametre Uzayında:** Bir çizgi, `(m, b)` gibi tek bir noktadır.

Şimdi ilginç kısım geliyor: Görüntü uzayındaki tek bir `(x₀, y₀)` noktasını ele alalım. Bu noktadan sonsuz sayıda çizgi geçebilir. Bu çizgilerin tamamı `y₀ = mx₀ + b` denklemini sağlar. Bu denklemi parametreler (`m`, `b`) cinsinden yeniden düzenlersek:

`b = -x₀m + y₀`

Bu, parametre uzayında bir **çizgi denklemidir!**

**Sonuç:**
*   Görüntü uzayındaki bir **nokta**, parametre uzayında bir **çizgiye** karşılık gelir.
*   Görüntü uzayında aynı çizgi üzerinde yer alan (collinear) **birden fazla nokta**, parametre uzayında tek bir noktada **kesişen çizgilere** karşılık gelir.

![Hough Space](https://via.placeholder.com/700x300.png?text=Görüntü+Uzayı+(x,y)+->+Parametre+Uzayı+(m,b))
*Görsel: Görüntü uzayındaki (solda) iki farklı noktadan geçen olası çizgiler, parametre uzayında (sağda) iki farklı çizgiye dönüşür. Bu iki noktanın oluşturduğu gerçek çizgi, parametre uzayındaki bu iki çizginin kesişim noktasıyla temsil edilir.*

Hough Dönüşümü, bu kesişim noktalarını bularak (en çok oyun biriktiği yer) orijinal görüntüdeki çizgileri tespit eder.

---

### Test Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Hough Dönüşümü'nün gürültüye ve eksik piksellere karşı dayanıklı olmasının temel sebebi nedir?</p>
  <div class="quiz-option">A) Görüntüyü önceden bulanıklaştırması.</div>
  <div class="quiz-option" data-correct="true">B) "Oylama" mekanizması sayesinde, tutarlı piksellerin oylarının birikirken, gürültülü piksellerin oylarının dağılması.</div>
  <div class="quiz-option">C) Sadece en güçlü kenar piksellerini kullanması.</div>
  <div class="quiz-option">D) Parametre uzayının daha küçük olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gerçek bir yapıya (çizgi gibi) ait olan pikseller, parametre uzayında aynı "kutucuk" için oy kullanma eğilimindedir. Gürültü veya alakasız piksellerin oyları ise genellikle rastgele bir şekilde dağılır ve hiçbir yerde anlamlı bir tepe noktası oluşturmaz. Bu, yöntemin gürültüye rağmen ana yapıları bulmasını sağlar.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> `y = mx + b` parametrizasyonunda, görüntü uzayındaki **tek bir nokta** parametre uzayında neye karşılık gelir?</p>
  <div class="quiz-option">A) Tek bir nokta.</div>
  <div class="quiz-option" data-correct="true">B) Bir çizgi.</div>
  <div class="quiz-option">C) Bir sinüs eğrisi.</div>
  <div class="quiz-option">D) Bir çember.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Görüntüdeki `(x₀, y₀)` noktasından sonsuz sayıda çizgi geçebilir. Bu çizgilerin `m` ve `b` parametreleri, `b = -x₀m + y₀` denklemini sağlar. Bu, `(m,b)` parametre uzayında bir çizgi denklemidir.</p>
  </div>
</div>
