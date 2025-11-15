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

<details>
  <summary><b>Soru 1:</b> Harris Corner Detector ölçeğe karşı neden dayanıksızdır ve SIFT bu sorunu nasıl çözer?</summary>
  <p>Harris Corner Detector, sabit boyutlu bir pencere (ve sabit bir `smoothing` `σ`'sı) kullanarak `gradient`'leri analiz eder. Görüntü küçüldüğünde, büyük bir pencereyle görülen bir "köşe", artık köşe gibi görünmeyebilir, detaylar kaybolur. SIFT bu sorunu, tek bir ölçekte arama yapmak yerine, görüntünün çok sayıda farklı ölçekteki versiyonundan oluşan bir "ölçek uzayı" yaratarak çözer. Böylece, bir `feature`'ın en belirgin olduğu "karakteristik ölçeği" de tespit edilmiş olur.</p>
</details>

<details>
  <summary><b>Soru 2:</b> SIFT'te `Laplacian of Gaussian (LoG)` yerine neden `Difference of Gaussians (DoG)` kullanılır? Bu yaklaşımın avantajı nedir?</summary>
  <p>LoG, `blob` (leke) tespiti için ideal bir operatördür, ancak hesaplaması yavaştır (önce Gaussian, sonra Laplacian). DoG ise, zaten ölçek uzayını oluşturmak için hesapladığımız Gaussian ile bulanıklaştırılmış görüntülerin farkını alarak elde edilir. Bu, LoG'ye çok iyi bir yaklaşım sunarken, ek bir `convolution` işlemi gerektirmediği için çok daha hızlı ve verimlidir. Temel avantajı hesaplama verimliliğidir.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Ölçek uzayında bir `keypoint`'in komşu ölçeklerde de maksimum olması neden önemlidir? Sadece kendi ölçeğinde maksimum olması neden yeterli değildir?</summary>
  <p>Bir noktanın sadece kendi ölçeğinde maksimum olması, o noktanın o ölçekteki gürültüden veya küçük bir `intensity` dalgalanmasından kaynaklanan rastgele bir tepe noktası olabileceği anlamına gelir. Komşu (daha bulanık ve daha az bulanık) ölçeklerde de bir maksimum olması, bu `feature`'ın ölçekler arasında "kararlı" olduğunu, yani rastgele bir gürültüden ziyade gerçek bir yapıya karşılık geldiğini gösterir. Bu, `keypoint`'lerin güvenilirliğini ve tekrarlanabilirliğini artıran çok önemli bir adımdır.</p>
</details>