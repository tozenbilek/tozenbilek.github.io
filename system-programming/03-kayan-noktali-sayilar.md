---
layout: default
title: Kayan Noktalı Sayılar (Floating Point)
nav_order: 3
parent: System Programming
---

# Kayan Noktalı Sayılar (Floating Point)

Tamsayı gösterimleri, hesaplama dünyasının temelini oluştursa da, bilimsel, mühendislik ve grafik gibi birçok uygulama, ondalıklı sayıların temsilini gerektirir. Bu bölümde, bu sayıların bilgisayarda evrensel olarak kabul görmüş **IEEE 754** standardına göre nasıl temsil edildiğini ve bu yaklaşımın getirdiği önemli sonuçları ele alacağız.

---

## 1. Kesirli İkili Sayıların Temsili

Ondalık sistemde olduğu gibi, ikili sistemde de ondalık noktasının (binary point) sağındaki basamaklar, tabanın negatif kuvvetlerini ifade eder. Her bir basamak, sırasıyla 2⁻¹, 2⁻², 2⁻³ gibi 2'nin negatif kuvvetleriyle çarpılır.

**Örnek:**
`101.11`₂ ifadesinin ondalık değeri şu şekilde hesaplanır:
= (1 × 2²) + (0 × 2¹) + (1 × 2⁰) + (1 × 2⁻¹) + (1 × 2⁻²)
= 4 + 0 + 1 + 0.5 + 0.25
= `5.75`₁₀

Bu temsilin önemli bir sonucu, yalnızca paydası 2'nin kuvveti olarak ifade edilebilen rasyonel sayıların sonlu bir ikili gösterime sahip olmasıdır. Örneğin, ondalık sistemdeki `0.1` (1/10) veya `0.2` (1/5) gibi değerler, ikili sistemde periyodik (sonsuz tekrar eden) bir açılıma sahiptir. Bu durum, sonlu bit ile yapılan temsillerde kaçınılmaz olarak hassasiyet hatalarına neden olur.

---

## 2. IEEE 754 Standardı: Sayıları Bitlere Sığdırmak

Farklı bilgisayarların ondalıklı sayıları anlarken aynı dili konuşması gerekir. İşte bu ortak dil **IEEE 754** standardıdır. Bu standart, bir sayıyı üç temel bilgiye ayırarak bitlere dönüştürür.

Bu yöntemi, bir sayıyı bilimsel olarak göstermeye benzetebiliriz:
**Sayı = (İşaret) × (Sayının Kendisi) × 2^(Büyüklük)**

Formüldeki her parça, bellekteki belirli bir bit grubuna yerleşir:

1.  **İşaret (Sign - `s`):** En basit kısımdır. Sayı pozitif mi, negatif mi? Bu bilgi için sadece **1 bit** yeterlidir (`0` pozitif, `1` negatif).
2.  **Üs (Exponent - `exp`):** Sayının ne kadar "büyük" veya "küçük" olduğunu belirler. Aslında bu, hayali ondalık noktasının (binary point) nerede durduğunu söyler.
3.  **Kesir (Fraction - `frac`):** Sayının "hassas" kısmıdır. Yani, sayının anlamlı rakamlarını içerir (Örneğin, 1.2345 sayısındaki `2345` gibi). Bu alana ne kadar çok bit ayrılırsa, sayı o kadar hassas olur.

Bu üç bilgi, bellekte şöyle bir araya gelir:

![IEEE 754 Formatı](https://via.placeholder.com/700x200.png?text=İşaret+(1)+|++Üs+(k)++|++Kesir+(n))
*Görsel: Sayının üç parçasının bitlerdeki yerleşimi.*

### Ne Kadar Hassas? `float` ve `double`

Bu standardın programlamada sıkça karşımıza çıkan iki farklı "boyutu" vardır:

*   **`float` (Tek Hassasiyet):** Toplam **32 bit** kullanır.
    *   İşaret için 1 bit
    *   Büyüklük (üs) için 8 bit
    *   Hassasiyet (kesir) için 23 bit
    *   *Daha az yer kaplar ama daha az hassastır ve daha küçük sayıları saklayabilir.*

*   **`double` (Çift Hassasiyet):** Toplam **64 bit** kullanır.
    *   İşaret için 1 bit
    *   Büyüklük (üs) için 11 bit
    *   Hassasiyet (kesir) için 52 bit
    *   *Daha çok yer kaplar ama çok daha hassastır ve çok daha geniş bir sayı aralığını temsil edebilir.*

---

## 3. Bitlerin Anlamını Değiştirmek: Sayıların Farklı Halleri

Bilgisayar, bir kayan noktalı sayıyı yorumlarken önce `exp` (büyüklük) alanına bakar. Bu alandaki bitler, bir anahtar görevi görür ve sayının "normal" mi, "sıfıra çok yakın" mı, yoksa "özel bir durum" mu olduğunu belirler.

### a) Normal Sayılar (Normalized Values)
Bu, günlük hayatta kullandığımız sayıların büyük çoğunluğunun temsil edildiği standart durumdur.

*   **Şart:** `exp` alanı ne tamamen sıfırlardan ne de tamamen birlerden oluşur.
*   **Gizli 1 Biti Kuralı:** Bilgisayar, verimlilik için akıllı bir varsayımda bulunur: "Her sayının başında `1,` varmış gibi davran." Bu sayede, o `1`'i bellekte saklamak zorunda kalmaz ve fazladan bir bitlik hassasiyet kazanırız.
*   **Bias (Kaydırma) Yöntemi:** `exp` alanı, hem pozitif (sayıyı büyüten) hem de negatif (sayıyı küçülten) üsleri saklayabilmelidir. Bunu `işaret biti` kullanmadan yapmak için sabit bir "kaydırma" değeri (Bias) kullanılır. Gerçek üs, `exp` alanındaki değerden bu `Bias` değerinin çıkarılmasıyla bulunur. (`float` için Bias 127, `double` için 1023'tür).

### b) Sıfıra Yakın Sayılar (Denormalized Values)
Bu mod, sıfıra çok çok yakın olan minicik sayıları ifade etmek için kullanılır.

*   **Şart:** `exp` alanı tamamen `0`'lardan oluşur.
*   Bu durumda, "gizli 1 biti" kuralı artık geçerli değildir. Bilgisayar, sayının `0,` ile başladığını varsayar. Bu, sayıların aniden sıfıra düşmesi yerine, yavaşça ve kademeli olarak sıfıra yaklaşmasını sağlar ("gradual underflow").
*   `+0.0` ve `-0.0` gibi değerler de bu şekilde temsil edilir.

### c) Özel Durumlar (Special Values)
Bazen bir işlemin sonucu bildiğimiz anlamda bir sayı değildir. Bu durumlar için özel kodlar kullanılır.

*   **Şart:** `exp` alanı tamamen `1`'lerden oluşur.
*   Bu durumda iki olasılık vardır:
    *   **Sonsuz (Infinity):** Eğer `frac` (hassasiyet) alanı tamamen `0`'lardan oluşuyorsa, bu değer "sonsuz" demektir. Örneğin, `1 / 0.0` işleminin sonucu budur.
    *   **Sayı Değil (NaN - Not a Number):** Eğer `frac` alanı `0`'dan farklı bir değer içeriyorsa, bu "tanımsız işlem" anlamına gelir. Örneğin, `sqrt(-1)` (negatif sayının karekökü) işleminin sonucu NaN'dir.

---

## 4. Rounding (Yuvarlama)

Hesaplamaların sonucu genellikle mevcut bit sayısından daha fazla hassasiyet gerektirdiğinde, sonucun yuvarlanması gerekir. Varsayılan ve en yaygın mod **Round-to-Nearest-Even**'dır:
*   Sayıyı en yakın temsil edilebilir değere yuvarla.
*   Eğer sayı iki temsil edilebilir değerin tam ortasındaysa, en anlamsız biti `0` olan (yani çift olan) komşuya yuvarla. Bu, istatistiksel `bias` (sapmayı) önler.

---

## 5. C Dilinde Kayan Noktalı Sayılar

C dilindeki `float` ve `double` tipleri, IEEE 754 standardına karşılık gelir. Tipler arası dönüşümlerde dikkatli olunmalıdır:
*   `double`/`float` -> `int`: Ondalık kısım **truncate edilir (kırpılır)**, yuvarlanmaz. `(int) 3.99` işleminin sonucu `3`'tür.
*   `int` -> `double`: Genellikle hassasiyet kaybı olmaz, çünkü `double`'ın kesir alanı (`52 bit`) bir `int`'in tüm bitlerini (`32` veya `