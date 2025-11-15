---
layout: default
title: Scale-Invariant Feature'lar ve SIFT Detector
parent: 5. Feature Detection ve Matching
nav_order: 2
---

# Scale-Invariant Feature'lar ve SIFT Detector

Harris `Corner Detector`, `rotation`'a dayanıklı olsa da `scale` değişimine karşı hassastır. Bir `image`'deki `corner`, `image`'in ölçeği değiştirildiğinde artık bir `corner` gibi görünmeyebilir. Bu sorunu çözmek için `feature`'ları, onları en iyi tanımlayan "karakteristik `scale`"de bulmamız gerekir.

## Otomatik Scale Seçimi

İki `image` arasında `scale` farkı olduğunu düşünelim. Sol `image`'deki bir `feature`'ı çevreleyen pencere, sağ `image`'deki karşılık gelen `feature`'ı çevreleyen daha büyük (veya daha küçük) bir pencereye eşlenmelidir. Ama bu doğru pencere boyutlarını her iki `image` için de birbirinden bağımsız olarak nasıl bulabiliriz?

**Çözüm:** `Image`'deki her nokta için, farklı `scale`'lerde (pencere boyutlarında) bir "özellik fonksiyonu" hesaplarız. Bu fonksiyonun `scale`'e göre maksimum (veya minimum) olduğu yer, o noktanın **karakteristik `scale`'ini** verir.

İyi bir özellik fonksiyonu, `scale` değiştikçe tek, belirgin ve stabil bir tepe noktası oluşturmalıdır. `Image`'lerde bu tür bir yanıtı en iyi veren fonksiyonlardan biri, `image`'in **Laplacian of Gaussian (LoG)** filtresiyle `convolution`'ıdır.

## Scale-Space ve LoG (Laplacian of Gaussian)

**Scale-space**, bir `image`'in farklı `smoothing` seviyelerindeki (farklı `σ` değerlerine sahip `Gaussian` `filter`'ları uygulanmış) temsilidir.

`LoG`, `Gaussian` ile `smooth` edilmiş bir `image`'in `Laplacian`'ını alarak hesaplanır. Bu, `image`'deki "blob" (leke) benzeri yapıları tespit etmek için kullanılır. `LoG` filtresinin `σ`'sı, ne boyutta `blob`'ları aradığımızı belirler.

Bir `feature`'ın karakteristik `scale`'ini bulmak için, o `feature`'ın merkezinde, farklı `σ` değerleri için `LoG` yanıtını hesaplarız. Yanıtın maksimum olduğu `σ` değeri, `feature`'ın `scale`'ini verir.

## DoG (Difference of Gaussians) ile Yaklaşım

`LoG`'u hesaplamak maliyetli olabilir. **SIFT**, `LoG`'a çok benzeyen ve hesaplaması daha verimli olan **Difference of Gaussians (DoG)**'ı kullanır. `DoG`, aynı `image`'in, `σ` değerleri birbirine yakın (`k*σ` ve `σ`) iki farklı `Gaussian` `filter` ile `smooth` edilmiş versiyonlarının farkı alınarak elde edilir.

`DoG(x, y, σ) ≈ G(x, y, kσ) - G(x, y, σ)`

Bu `DoG` `image`'lerinden bir piramit (farklı `octave`'lar ve `scale`'ler) oluşturulur.

## SIFT Keypoint Detection

SIFT, `feature`'ları (`keypoint`'leri) bu `DoG` piramidinde hem uzayda (x, y) hem de `scale`'de (`σ`) lokal `extrema` (maksimum veya minimum) olan noktaları bularak tespit eder.

1.  **`Scale-Space` `Extrema` Tespiti:** Her `pixel`, kendi `image`'indeki 8 komşusuyla ve bir alt ve bir üst `scale`'deki `image`'lerdeki 9'ar komşusuyla (toplam 26 komşu) karşılaştırılır. Eğer bu `pixel`, tüm bu komşularından daha büyük veya daha küçük bir değere sahipse, bir `keypoint` adayı olarak seçilir.

2.  **`Keypoint` Doğrulama ve Filtreleme:** Bulunan tüm adaylar iyi `feature`'lar değildir. İki aşamalı bir filtreleme yapılır:
           - **Düşük Kontrastlı Adayları Eleme:** `Extrema` noktasındaki `DoG` yanıtının `magnitude`'u belirli bir `threshold`'un altındaysa, bu aday `noise`'a karşı dayanıksız kabul edilir ve elenir.
           - **`Edge` Yanıtlarını Eleme:** `DoG`, `edge`'ler boyunca da güçlü bir yanıt verir, ancak `edge`'ler `localization` için belirsizlik yarattığından istenmez. Bu noktaları elemek için Harris `Corner Detector`'daki `eigenvalue` fikri kullanılır. Eğer `gradient`'in iki ana yöndeki oranı belirli bir `threshold`'dan yüksekse, bu nokta bir `edge` olarak kabul edilir ve elenir.

Bu adımlar sonucunda, `scale` değişimine karşı dayanıklı, stabil ve iyi lokalize edilmiş `keypoint`'ler elde edilir. Bir sonraki adım, bu `keypoint`'leri `rotation`'a karşı da dayanıklı hale getirmek ve onları tanımlayan bir `descriptor` oluşturmaktır.

`σ` değeri, `smoothing` miktarını, dolayısıyla da tespit edilecek `feature`'ların "ölçeğini" belirler.

![Scale Invariance Problem](https://placehold.co/800x400/EEE/31343C?text=Yakın+Çekimde+Büyük+Pencere+İşe+Yarar,+Uzak+Çekimde+Küçük)
*<center>Ölçek problemi: Sabit boyutlu bir köşe dedektörü, yakın çekimde köşeyi bulurken, uzak çekimde (görüntü küçüldüğünde) aynı bölgeyi bir çizgi veya leke olarak görebilir.</center>*

Bu sorunu çözmek için, `feature`'ları tek bir ölçekte aramak yerine, **tüm olası ölçeklerde** ararız. Bu konsept, **scale-space (ölçek uzayı)** olarak bilinir.

Bu işlem, farklı `σ` değerlerine sahip Gaussian'larla `convolution` alınmış bir `image` piramidi oluşturur.

![Gaussian Scale-Space Pyramid](https://placehold.co/600x450/EEE/31343C?text=Görüntü+Piramidi+ve+Her+Seviyede+Artan+Bulanıklık+(σ))
*<center>Gaussian ölçek uzayı: Görüntü tekrar tekrar alt örneklenir (piramit katmanları) ve her katmanda artan `σ` değerleriyle giderek daha fazla bulanıklaştırılır.</center>*

## 2. Laplacian of Gaussian (LoG) Yaklaşımı ve Farkı (DoG)

Ancak LoG hesaplama açısından maliyetlidir. SIFT'in yazarı David Lowe, LoG'nin **Difference of Gaussians (DoG)** ile çok iyi bir şekilde yaklaştırıldığını göstermiştir. DoG, ölçek uzayında birbirine yakın `σ` değerleriyle bulanıklaştırılmış iki `image`'in farkını alarak elde edilir:

`DoG(x,y,σ) ≈ G(x,y,kσ) * I(x,y) - G(x,y,σ) * I(x,y)`

## 3. Ölçek Uzayında Tepe (Maxima/Minima) Noktalarını Bulma

Bir `pixel`'in `keypoint` adayı olabilmesi için, sadece kendi 3x3 komşuluğunda değil, aynı zamanda **bir alttaki ve bir üstteki** DoG `image`'lerindeki 3x3 komşuluğunda da en yüksek veya en düşük değere sahip olması gerekir. Yani, bir aday `pixel`, 3x3x3'lük bir 27 `pixel`'lik komşulukta lokal bir `maximum` veya `minimum` olmalıdır.

![Scale-Space Extrema Detection](https://placehold.co/500x400/EEE/31343C?text=Aday+Piksel+(X),+Hem+Kendi+Katmanında+Hem+de+Alt/Üst+Katmanlarda+Ekstremum+Olmalı)
*<center>Ölçek uzayında maksimum tespiti: Bir 'X' pikseli, sadece kendi 8 komşusuyla değil, aynı zamanda alt ve üst ölçeklerdeki 9+9=18 komşusuyla da karşılaştırılır.</center>*

Bu adım, `keypoint` adaylarının sayısını önemli ölçüde azaltır.

`Harris Corner Detector`'dakine benzer bir prensip kullanılır. Düşük kontrasta sahip (güvenilir olmayan) ve kenar üzerinde bulunan (kötü lokalize edilmiş) `keypoint`'ler elenir.

---

## Özet ve Anahtar Kavramlar

-   **Scale Invariance:** Bir özelliğin, görüntüdeki nesnenin boyutu veya kameraya olan uzaklığı değişse bile tespit edilebilmesi yeteneğidir.
-   **Scale-Space (Ölçek Uzayı):** Bir görüntünün, farklı `σ` değerlerine sahip Gaussian filtreleri ile giderek artan seviyelerde bulanıklaştırılmış versiyonlarının bir koleksiyonudur. Bu, `feature`'ları tüm ölçeklerde aramayı sağlar.
-   **Difference of Gaussians (DoG):** İki farklı Gaussian ile bulanıklaştırılmış görüntünün farkıdır. `Laplacian of Gaussian (LoG)` operatörüne hızlı ve verimli bir yaklaşımdır ve "blob" benzeri yapıları tespit eder.
-   **Scale-Space Extrema:** Bir `keypoint` adayının, sadece kendi ölçeğinde değil, aynı zamanda komşu (alt ve üst) ölçeklerde de lokal bir maksimum veya minimum olması gerektiği prensibidir. Bu, `keypoint`'lerin hem konumunu hem de karakteristik ölçeğini belirler.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> SIFT algoritmasında, `Laplacian of Gaussian (LoG)` yerine `Difference of Gaussians (DoG)` kullanılmasının temel nedeni nedir?</p>
  <div class="quiz-option" data-correct="true">A) DoG, `scale-space` piramidi oluşturulurken elde edilen görüntüleri yeniden kullandığı için hesaplama açısından çok daha verimlidir.</div>
  <div class="quiz-option">B) DoG, LoG'dan daha doğru `keypoint`'ler bulur.</div>
  <div class="quiz-option">C) DoG, gürültüye karşı LoG'dan daha dayanıklıdır.</div>
  <div class="quiz-option">D) DoG, renkli görüntülerde daha iyi çalışır.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> DoG, farklı `sigma` değerleriyle `blur` edilmiş iki görüntünün basit bir farkıdır. SIFT, `scale-space` piramidini oluştururken bu `blur` edilmiş görüntüleri zaten hesaplar. Dolayısıyla, DoG'u hesaplamak neredeyse hiçbir ek maliyet getirmez. LoG ise ek bir `Laplacian` operatörü uygulamayı gerektirir. DoG, LoG'a çok iyi bir yaklaşım olduğu için bu verimlilik kazancı tercih edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> SIFT `detector`'ı, bir `keypoint`'in "karakteristik ölçeğini" nasıl bulur?</p>
  <div class="quiz-option">A) Görüntünün en keskin olduğu bölgeyi bularak.</div>
  <div class="quiz-option">B) `Keypoint` etrafındaki gradyanların ortalamasını alarak.</div>
  <div class="quiz-option" data-correct="true">C) `Scale-space`'te, `keypoint`'in hem uzaysal komşularından hem de komşu ölçeklerden daha güçlü bir tepkiye sahip olduğu noktayı bularak.</div>
  <div class="quiz-option">D) Görüntüyü Fourier dönüşümüne geçirerek.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> SIFT, `scale-space`'in hem `(x, y)` uzayında hem de `σ` (ölçek) boyutunda bir `non-maximum suppression` uygular. Bu, bir `keypoint`'in sadece kendi görüntüsündeki komşularından değil, aynı zamanda daha `blur`'lu ve daha az `blur`'lu versiyonlarındaki komşularından da daha güçlü bir `extrema` (maksimum veya minimum) olması gerektiği anlamına gelir. Bu sayede, `feature`'ın en belirgin ve en kararlı olduğu ölçek tespit edilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> SIFT `detector`'ının bir `keypoint`'e bir "orientation" (yönelim) ataması, `descriptor`'ün hangi özelliğe sahip olmasını sağlar?</p>
  <div class="quiz-option">A) Ölçek değişmezliği (Scale Invariance).</div>
  <div class="quiz-option" data-correct="true">B) Rotasyon değişmezliği (Rotation Invariance).</div>
  <div class="quiz-option">C) Aydınlatma değişmezliği (Illumination Invariance).</div>
  <div class="quiz-option">D) Perspektif değişmezliği (Affine Invariance).</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> `Keypoint` etrafındaki gradyanların yönelim histogramı kullanılarak baskın bir yön belirlenir. Sonraki `descriptor` hesaplama adımında, tüm gradyanlar bu ana yöne göre normalize edilir. Bu sayede, nesne görüntüde döndürülse bile, ana yön de onunla birlikte döner ve sonuçta ortaya çıkan `descriptor` vektörü aynı kalır. Bu, SIFT'e rotasyon değişmezliği kazandırır.</p>
  </div>
</div>