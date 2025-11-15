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
