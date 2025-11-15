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

<details>
  <summary><b>Soru 1:</b> Yatay bir çizginin olduğu bir bölgede `Gx` ve `Gy` `gradient`'lerinin değerleri yaklaşık olarak ne olur? Neden?</summary>
  <p>`Gy`'nin değeri büyük olurken, `Gx`'in değeri sıfıra yakın olur. Çünkü `gradient`'in y-bileşeni dikey yöndeki değişimi ölçer ve yatay bir çizgiden dikey olarak geçerken (yukarıdan aşağıya) `intensity`'de ani bir değişim olur. Yatay yönde (çizgi boyunca) ise `intensity` değişmediği için x-bileşeni zayıf kalır.</p>
</details>

<details>
  <summary><b>Soru 2:</b> `Gradient magnitude`'ünü `sqrt(Gx² + Gy²)` yerine `|Gx| + |Gy|` olarak hesaplamanın avantajı ve dezavantajı ne olabilir?</summary>
  <p>**Avantajı:** Karekök ve kare alma işlemleri daha maliyetli olduğu için `|Gx| + |Gy|` yaklaşımı hesaplama açısından çok daha hızlı ve verimlidir. **Dezavantajı:** Bu, `gradient`'in gerçek Öklid uzunluğuna sadece bir yaklaşımdır. `Gradient` yönüne bağlı olarak küçük hatalar içerebilir, ancak çoğu uygulama için bu hız kazancı, doğruluğundaki küçük kayba değer.</p>
</details>

<details>
  <summary><b>Soru 3:</b> Neden türev almadan önce `image`'i `smooth` etme ihtiyacı duyarız? Bu işlemin potansiyel bir dezavantajı var mıdır?</summary>
  <p>Türev filtreleri, `intensity`'deki hızlı değişimlere tepki verir. Gürültü de doğası gereği yüksek frekanslı hızlı değişimlerden oluşur. `Smooth` etmeden türev alırsak, filtre gürültüye aşırı tepki verir ve sonuçta çok sayıda yanlış kenar tespit edilir. **Potansiyel dezavantajı:** `Smoothing` (bulanıklaştırma) işlemi, sadece gürültüyü değil, aynı zamanda görüntüdeki zayıf ama gerçek olan kenarları ve ince detayları da bastırabilir. Bu yüzden doğru `smoothing` miktarını bulmak önemlidir.</p>
</details>
