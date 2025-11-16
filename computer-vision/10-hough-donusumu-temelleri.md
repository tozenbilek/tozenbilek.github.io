---
layout: default
title: Hough Dönüşümü Temelleri
nav_order: 10
parent: Computer Vision
---

# Hough Dönüşümü Temelleri: Oylama ile Şekil Bulma

Önceki bölümde, Canny gibi algoritmalarla bir görüntüdeki yerel kenar piksellerini nasıl bulacağımızı öğrendik. Ancak bu, bize sadece "burada bir kenar var" der; bu piksellerin bir araya gelerek bir çizgi mi, çember mi yoksa başka bir global geometrik şekil mi oluşturduğunu söylemez.

**Hough Transform (Hough Dönüşümü)**, bu dağınık ve kopuk kenar pikselleri setinden, belirli parametrelere sahip global yapıları (çizgiler, çemberler vb.) çıkarmak için kullanılan güçlü bir "oylama" tekniğidir.

---

## 1. Temel Fikir: Voting (Oylama)

Hough Dönüşümü'nün arkasındaki ana fikir son derece sezgiseldir: **Bırakın pikseller, ait oldukları şekil için oy versin!** Her kenar pikseli, "Ben şu şu özelliklere sahip bir çizginin üzerinde olabilirim!" diye "bağırır". Aynı şeyi "bağıran" piksellerin sesi birikir ve en gürültülü yer, görüntüdeki en olası çizgiyi işaret eder.

1.  Öncelikle, görüntüdeki kenar pikselleri (örneğin, Canny ile) bulunur.
2.  Aradığımız şeklin (örneğin bir çizgi) bir parametrik denklemi vardır.
3.  Her bir kenar pikseli, kendisinin bir parçası olabileceği **tüm olası şekiller** için "oy" kullanır.
4.  Bu oylar, **parameter space (parametre uzayı - Hough space)** adı verilen bir "oy sandığında" (genellikle bir 2D matris/histogram) biriktirilir.
5.  Oylama bittiğinde, oy sandığındaki en yüksek oy alan "kutucuklar", görüntüdeki en olası şekillerin parametrelerini temsil eder.

Bu yaklaşım, gürültüye ve `occlusion` (örtülme) durumuna karşı oldukça dayanıklıdır. Gürültülü piksellerin oyları parametre uzayına rastgele dağılırken, "gerçek" bir şekle ait piksellerin oyları tutarlı bir şekilde tek bir noktada birikecektir.

<div class="quiz-question">
  <p><b>Soru:</b> Hough Dönüşümü'nün "oylama" yapabilmesi için girdi olarak öncelikle neye ihtiyacı vardır?</p>
  <div class="quiz-option" data-correct="true">A) Kenar piksellerinin bir listesine (örn: Canny çıktısı).</div>
  <div class="quiz-option">B) Görüntünün orijinal renk değerlerine.</div>
  <div class="quiz-option">C) Görüntünün histogramına.</div>
  <div class="quiz-option">D) Görüntüdeki nesnelerin etiketlerine.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Hough Dönüşümü, anlamlı yapılar oluşturmak için "oy" kullanacak temel elemanlara ihtiyaç duyar. Bu elemanlar, Canny gibi bir kenar dedektörü tarafından bulunan kenar pikselleridir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Hough Dönüşümü'nün gürültüye ve eksik piksellere karşı dayanıklı olmasının temel sebebi nedir?</p>
  <div class="quiz-option">A) Görüntüyü önceden bulanıklaştırması.</div>
  <div class="quiz-option" data-correct="true">B) "Oylama" mekanizması sayesinde, tutarlı piksellerin oylarının birikirken, gürültülü piksellerin oylarının dağılması.</div>
  <div class="quiz-option">C) Sadece en güçlü kenar piksellerini kullanması.</div>
  <div class="quiz-option">D) Parametre uzayının daha küçük olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gerçek bir yapıya (çizgi gibi) ait olan pikseller, parametre uzayında aynı "kutucuk" için oy kullanma eğilimindedir. Gürültü veya alakasız piksellerin oyları ise genellikle rastgele bir şekilde dağılır ve hiçbir yerde anlamlı bir tepe noktası oluşturmaz. Bu, yöntemin gürültüye rağmen ana yapıları bulmasını sağlar.</p>
  </div>
</div>

---

## 2. Duality: Görüntü Uzayından Parametre Uzayına

Hough Dönüşümü'nün büyüsü, problemi görüntü uzayında (`x, y`) çözmek yerine, şeklin parametrelerinin uzayında (`m, b` gibi) çözmesidir. Bu iki uzay arasında "ikililik" (duality) adı verilen ilginç bir ilişki vardır.

**Çizgi Örneği (`y = mx + b`):**
*   **Görüntü Uzayında:** Bir çizgi, sonsuz sayıda noktadan oluşur.
*   **Parametre Uzayında:** Bir çizgi, `(m, b)` gibi **tek bir noktadır**.

Şimdi tersini düşünelim: Görüntü uzayındaki tek bir `(x₀, y₀)` noktasından sonsuz sayıda çizgi geçebilir. Bu çizgilerin tamamı `y₀ = mx₀ + b` denklemini sağlar. Bu denklemi parametreler cinsinden yeniden düzenlersek: `b = -x₀m + y₀`. Bu, `(m,b)` parametre uzayında bir **çizgi denklemidir!**

**Sonuç (Duality):**
*   Görüntü uzayındaki bir **nokta** ⇔ Parametre uzayında bir **çizgi**.
*   Görüntü uzayında aynı çizgi üzerindeki **noktalar** ⇔ Parametre uzayında tek bir noktada **kesişen çizgiler**.

<pre>
Görüntü Uzayı (x, y)          Parametre Uzayı (m, b)
      y^                           b^
       | P1                        |   /
       |  /                        |  / L1
       | /                         | /
       |/  P2                      |/-----* Kesişim Noktası
       +------> x                  +------> m
      /                            |    /
     /                             |   / L2
    /                              |  /

P1 noktası -> L1 çizgisi olarak oy kullanır.
P2 noktası -> L2 çizgisi olarak oy kullanır.
P1 ve P2'den geçen ortak çizgi -> L1 ve L2'nin kesişim noktasıdır (en çok oyu alır).
</pre>

Hough Dönüşümü, bu kesişim noktalarını (en çok oyun biriktiği yerleri) bularak orijinal görüntüdeki çizgileri tespit eder.

<div class="quiz-question">
  <p><b>Soru:</b> `y = mx + b` parametrizasyonunda, görüntü uzayındaki **tek bir nokta** parametre uzayında neye karşılık gelir?</p>
  <div class="quiz-option">A) Tek bir nokta.</div>
  <div class="quiz-option" data-correct="true">B) Bir çizgi.</div>
  <div class="quiz-option">C) Bir sinüs eğrisi.</div>
  <div class="quiz-option">D) Bir çember.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Görüntüdeki `(x₀, y₀)` noktasından sonsuz sayıda çizgi geçebilir. Bu çizgilerin `m` ve `b` parametreleri, `b = -x₀m + y₀` denklemini sağlar. Bu, `(m,b)` parametre uzayında bir çizgi denklemidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Görüntü uzayında, aynı doğru üzerinde bulunan üç farklı nokta (P1, P2, P3), parametre uzayında nasıl bir yapı oluşturur?</p>
  <div class="quiz-option">A) Bir üçgen.</div>
  <div class="quiz-option">B) Birbirine paralel üç çizgi.</div>
  <div class="quiz-option" data-correct="true">C) Tek bir noktada kesişen üç çizgi.</div>
  <div class="quiz-option">D) Üç farklı nokta.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Her bir nokta, parametre uzayında ayrı bir çizgiye dönüşür. Bu üç nokta aynı doğru üzerinde olduğu için, parametre uzayındaki karşılıkları olan üç çizgi de, o doğrunun `(m, b)` parametrelerini temsil eden tek bir noktada kesişir. Oylamada en çok oyu bu kesişim noktası alır.</p>
  </div>
</div>

