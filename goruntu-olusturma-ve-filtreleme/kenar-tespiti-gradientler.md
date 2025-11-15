---
layout: default
title: Edge Detection ve Gradient'ler
parent: 2. Image Formation ve Filtering
nav_order: 4
---

# Edge Detection ve Gradient'ler

`Image`'lerdeki en temel ve önemli bilgilerden biri **edge**'lerdir. `Edge`'ler, nesnelerin sınırlarını, doku değişikliklerini ve aydınlanma farklılıklarını belirten `intensity` değişimleridir.

## Edge'ler ve Intensity Değişimleri

Bir `image`'i bir yüzey grafiği olarak düşünürsek, `edge`'ler bu yüzeydeki **sarp yamaçlara veya uçurumlara** benzer. Yani, `edge`'ler, `image` `intensity` fonksiyonunda ani ve hızlı değişimlerin olduğu yerlerdir.

Matematiksel olarak bu hızlı değişimi ölçmenin yolu **derivative** almaktır.
- Bir fonksiyonun **birinci türevi**, o fonksiyonun değişim hızını verir. `Edge` bölgelerinde birinci türevin `magnitude`'u yüksek olacaktır (pozitif veya negatif zirveler).
- Bir fonksiyonun **ikinci türevi**, değişim hızının değişimini verir. `Edge`'ler, ikinci türevin **sıfırdan geçtiği noktalara (zero-crossings)** denk gelir.

## Image Gradient

`Image`'ler iki boyutlu (`I(x, y)`) olduğu için, her yöndeki değişimi ölçmemiz gerekir. Bu, **image gradient (`∇I`)** ile yapılır. `Gradient`, bir vektördür ve iki bileşenden oluşur:
- **x yönündeki partial derivative (`∂I/∂x` veya `Gx`):** Yatay yöndeki `intensity` değişimini ölçer.
- **y yönündeki partial derivative (`∂I/∂y` veya `Gy`):** Dikey yöndeki `intensity` değişimini ölçer.

`∇I = [Gx, Gy]`

Bu `gradient` vektörü iki önemli bilgi taşır:
1.  **Gradient Magnitude:** `Edge`'in ne kadar "güçlü" veya "belirgin" olduğunu gösterir. Vektörün uzunluğudur.
    `Magnitude = ||∇I|| = sqrt(Gx² + Gy²)`
    Hesaplama kolaylığı için bazen `|Gx| + |Gy|` yaklaşımı da kullanılır.

2.  **Gradient Direction/Orientation:** `Intensity`'nin en hızlı arttığı yönü gösterir. `Edge` çizgisi, bu yöne **dik** olur.
    `Direction = θ = atan2(Gy, Gx)`

## Discrete Derivative Filter'lar

Dijital `image`'lerde sürekli `derivative` alamayız. Bunun yerine, **finite differences** kullanarak `derivative`'i yaklaşık olarak hesaplayan `filter`'lar (`kernel`'ler) kullanırız.

**Sobel Operator:**
En yaygın kullanılan `derivative filter`'larından biridir. Hem `derivative` alır hem de hafif bir `smoothing` yaparak `noise`'a karşı daha dayanıklı olmasını sağlar.

- **x-yönü için Sobel Kernel (`Sx`):**
  \[
  \begin{bmatrix}
  -1 & 0 & 1 \\
  -2 & 0 & 2 \\
  -1 & 0 & 1
  \end{bmatrix}
  \]

- **y-yönü için Sobel Kernel (`Sy`):**
  \[
  \begin{bmatrix}
  -1 & -2 & -1 \\
  0 & 0 & 0 \\
  1 & 2 & 1
  \end{bmatrix}
  \]

Bu `kernel`'ler `image` ile `convolution` (veya `correlation`) işlemine sokularak `Gx` ve `Gy` `gradient` `image`'leri elde edilir.

![Sobel Operatörü Uygulaması](https://placehold.co/800x200/EEE/31343C?text=Orijinal+|+Gx:+Dikey+Kenarlar+|+Gy:+Yatay+Kenarlar+|+Magnitude)
*<center>Soldan sağa: Orijinal görüntü, Sobel Gx çıktısı (dikey kenarları vurgular), Sobel Gy çıktısı (yatay kenarları vurgular), Gradient Magnitude (tüm kenarlar).</center>*

## Noise'un Etkisi ve Çözümü

`Derivative` operasyonları, doğaları gereği `noise`'a karşı çok hassastır. Çünkü `noise`, `image`'e yüksek frekanslı (hızlı) değişimler ekler ve `derivative filter`'ı bu değişimleri güçlendirerek hatalı `edge`'ler tespit edilmesine neden olur.

**Çözüm: Smooth First, then Differentiate**
Bu problemi çözmek için standart yaklaşım şudur:
1.  Önce `image`'i bir **Gaussian filter** ile `smooth` ederek `noise`'u bastır.
2.  Ardından `smooth` edilmiş `image` üzerinde `derivative filter`'ını uygula.

Bu iki adım (`Gaussian smoothing` + `Derivative`), matematiksel olarak tek bir adımda birleştirilebilir. Gaussian fonksiyonunun `derivative`'ini alarak yeni bir `kernel` oluşturabiliriz. Bu yeni `kernel`'e **Derivative of Gaussian (DoG)** filtresi denir. Bu, hem `noise` bastırma hem de `edge detection` işini tek bir `convolution` ile yapan verimli bir yöntemdir.

Bir sonraki bölümde, bu temel adımları bir araya getirerek güçlü ve modern bir `edge detection` algoritması olan Canny Edge Detector'nü inceleyeceğiz.

---

## Özet ve Anahtar Kavramlar

-   **Edge (Kenar):** Görüntü `intensity` fonksiyonunda ani ve hızlı değişimlerin olduğu yerlerdir.
-   **Image Gradient (`∇I`):** Bir `pixel`'deki `intensity` değişiminin yönünü ve büyüklüğünü gösteren 2D vektördür (`[Gx, Gy]`).
-   **Gradient Magnitude:** Kenarın gücünü veya belirginliğini belirtir (`sqrt(Gx² + Gy²)`).
-   **Gradient Direction:** `Intensity`'nin en hızlı arttığı yönü belirtir ve kenar çizgisine diktir.
-   **Sobel Operator:** Hem türev alan hem de hafif bir `smoothing` yapan, `gradient` hesaplaması için yaygın olarak kullanılan bir `kernel`'dir.
-   **Noise ve Smoothing:** Türev operasyonları gürültüye çok hassastır. Bu etkiyi azaltmak için türev almadan önce görüntüyü bir **Gaussian filtresi** ile yumuşatmak (`smooth` etmek) standart bir adımdır.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Yatay bir kenar (horizontal edge) içeren bir görüntü bölgesinde, Sobel operatörü ile hesaplanan `Gx` ve `Gy` gradyanlarının büyüklükleri nasıl olur?</p>
  <div class="quiz-option">A) `Gx` büyük, `Gy` sıfıra yakın olur.</div>
  <div class="quiz-option" data-correct="true">B) `Gy` büyük, `Gx` sıfıra yakın olur.</div>
  <div class="quiz-option">C) Hem `Gx` hem de `Gy` büyük olur.</div>
  <div class="quiz-option">D) Hem `Gx` hem de `Gy` sıfıra yakın olur.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `Gy` gradyanı dikey yöndeki değişimi ölçer. Yatay bir kenardan dikey olarak geçerken yoğunlukta ani bir değişim olur, bu yüzden `Gy` büyük bir değere sahip olur. `Gx` ise yatay yöndeki değişimi ölçtüğü ve kenar boyunca yoğunluk sabit kaldığı için sıfıra yakın olur.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Gradyan büyüklüğünü (gradient magnitude) hesaplarken `sqrt(Gx² + Gy²)` yerine `|Gx| + |Gy|` kullanmanın temel sebebi nedir?</p>
  <div class="quiz-option">A) Daha doğru sonuçlar vermesi.</div>
  <div class="quiz-option">B) Renkli görüntülerde daha iyi çalışması.</div>
  <div class="quiz-option" data-correct="true">C) Hesaplama açısından daha verimli ve hızlı olması.</div>
  <div class="quiz-option">D) Gürültüye karşı daha dayanıklı olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Kare alma ve karekök alma işlemleri, mutlak değer alıp toplamaktan çok daha fazla hesaplama maliyetine sahiptir. `|Gx| + |Gy|` formülü, gerçek Öklid mesafesine iyi bir yaklaşım sunarken, donanım üzerinde çok daha hızlı çalışır. Bu nedenle, özellikle gerçek zamanlı uygulamalarda sıkça tercih edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Kenar tespiti için gradyan hesaplamadan önce görüntüye bir `smoothing` (yumuşatma) filtresi (örneğin Gaussian) uygulamanın birincil amacı nedir?</p>
  <div class="quiz-option" data-correct="true">A) Gürültünün neden olduğu sahte kenarları bastırmak.</div>
  <div class="quiz-option">B) Görüntüyü keskinleştirmek.</div>
  <div class="quiz-option">C) Görüntünün boyutunu küçülterek işlemi hızlandırmak.</div>
  <div class="quiz-option">D) Renk bilgilerini gri seviyeye dönüştürmek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> Türev (gradyan) operatörleri, yoğunluktaki ani değişimlere karşı çok hassastır. Gürültü de bu tür yüksek frekanslı değişimlerden oluşur. Görüntüyü önce yumuşatmak, gürültüyü bastırarak türev operatörünün sadece gerçek ve anlamlı kenarlara tepki vermesini sağlar.</p>
  </div>
</div>
