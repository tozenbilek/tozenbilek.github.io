---
layout: default
title: Circles ve Generalized Hough Transform
parent: 3. Hough Transform
nav_order: 3
---

# Circles ve Generalized Hough Transform

`Hough Transform`'un gücü, sadece `line`'larla sınırlı değildir. Prensip, parametrik olarak ifade edilebilen herhangi bir şekle genişletilebilir. Bu bölümde `circle` (çember) tespitini ve ardından herhangi bir keyfi şekli bulabilen **Generalized Hough Transform**'u inceleyeceğiz.

## Adım 1 – Circles için Hough Transform

Bir `circle`, üç parametre ile tanımlanır: merkez koordinatları `(a, b)` ve yarıçap `r`. Denklem: `(x - a)² + (y - b)² = r²`.
Bu, `Hough space`'in artık 3 boyutlu `(a, b, r)` olacağı anlamına gelir.

**Algoritma Yaklaşımları:**

1.  **Yarıçap Biliniyorsa (`r` sabit):**
    - `Parameter space` 2D'dir (`a`, `b`).
    - Her `edge` `pixel`'i `(x, y)` için:
        - Bu `pixel`, merkezden `r` kadar uzakta olan tüm olası merkez noktaları için oy verir. Bu noktalar, `(x, y)` merkezli, `r` yarıçaplı bir `circle` üzerindedir.
    - `Accumulator`'de en çok oyu alan `(a, b)` hücresi, aranan `circle`'ın merkezidir.

2.  **Yarıçap Bilinmiyorsa (`r` değişken):**
    - `Parameter space` 3D'dir (`a, b, r`), bu da hesaplama maliyetini ve bellek kullanımını önemli ölçüde artırır.
    - **`Gradient` Yönünü Kullanarak Optimizasyon:** `Edge`'deki `gradient` vektörü, `circle`'ın merkezinden dışarı doğru (veya tam tersi) işaret etmelidir.
    - Her `edge` `pixel`'i `(x, y)` için:
        - `Gradient` yönü (`θ`) boyunca hem pozitif hem de negatif yönde ilerleyerek olası merkez noktaları `(a, b)` için oy verilir.
        - `a = x - r*cos(θ)`
        - `b = y - r*sin(θ)`
        - Bu oylama, tüm olası `r` değerleri için yapılır.
    - Bu yöntem, arama uzayını 3D bir koniden 2D bir çizgiye indirgeyerek verimliliği büyük ölçüde artırır.

## Adım 2 – Generalized Hough Transform (GHT)

Peki ya bulmak istediğimiz şeklin (örneğin, bir araba, bir insan figürü) basit bir geometrik denklemi yoksa? İşte burada **Generalized Hough Transform (GHT)** devreye girer.

GHT, keyfi şekilleri tespit etmek için bir **şablon (template)** kullanır. Fikir, şeklin sınır (`boundary`) `pixel`'lerinin, şeklin önceden tanımlanmış bir merkez noktasına (`reference point`) göre konumlarını bir tabloda saklamaktır. Bu tabloya **R-Table** denir.

**Training Aşaması (R-Table Oluşturma):**
1.  Tespit edilecek şeklin bir şablon `image`'i alınır.
2.  Şekil için bir `reference point` (genellikle ağırlık merkezi) seçilir.
3.  Şeklin sınırındaki her `edge` `pixel`'i `pᵢ` için:
    - `Gradient` yönü `θᵢ` hesaplanır.
    - `Reference point`'a olan yer değiştirme vektörü `rᵢ = c - pᵢ` hesaplanır.
    - Bu `rᵢ` vektörü, `gradient` yönü `θᵢ` ile indekslenerek `R-Table`'a saklanır. (Bir `θ` için birden fazla `r` vektörü olabilir).

**Detection Aşaması (Oylama):**
1.  Yeni bir `image`'de `edge detection` yapılır.
2.  Her `edge` `pixel`'i `p` için:
    - `Gradient` yönü `θ` hesaplanır.
    - `R-Table`'dan `θ`'ya karşılık gelen **tüm** `r` vektörleri alınır.
    - Her bir `r` vektörü için olası merkez noktası `c = p + r` hesaplanır ve bu `c` noktası için `accumulator`'de bir oy verilir.
3.  `Accumulator`'de en çok oyu alan nokta, `image`'deki şeklin `reference point`'unun konumudur.

**Scale ve Rotation Değişiklikleri:**
GHT, `parameter space`'e ölçek (`scale`) ve dönme (`rotation`) `parameter`'larını da ekleyerek bu tür değişimlere karşı da uyarlanabilir, ancak bu `accumulator`'ün boyutunu ve hesaplama maliyetini artırır (örneğin, 4D `accumulator` `(x, y, scale, rotation)`).

`Hough Transform` ve varyasyonları, `image`'lerdeki gürültülü ve eksik veriden anlamlı yapılar çıkarmak için güçlü ve esnek bir çerçeve sunar.
