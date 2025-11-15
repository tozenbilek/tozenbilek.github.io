---
layout: default
title: Circles ve Generalized Hough Transform
parent: 3. Hough Transform
nav_order: 3
---

# Circles ve Generalized Hough Transform

`Hough Transform`'un gücü, sadece `line`'larla sınırlı değildir. Prensip, parametrik olarak ifade edilebilen herhangi bir şekle genişletilebilir. Bu bölümde `circle` (çember) tespitini ve ardından herhangi bir keyfi şekli bulabilen **Generalized Hough Transform**'u inceleyeceğiz.

## Circles için Hough Transform

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

## Generalized Hough Transform (GHT)

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

## Hough Transform'un Artıları ve Eksileri

`Hough Transform`, birçok avantajı olan güçlü bir tekniktir, ancak bazı sınırlamaları da vardır.

**Artıları (Pros):**
-   **Gürültüye Dayanıklılık:** Oylama mekanizması sayesinde, alakasız `pixel`'lerin oyları `parameter space`'e dağılır ve genellikle anlamlı bir tepe oluşturmaz.
-   **Eksik Veriyle Çalışabilme (`Occlusion`):** Bir şeklin bir kısmı görünmese bile, görünen kısımdaki `pixel`'ler hala doğru parametreler için oy verebilir ve şeklin tespit edilmesini sağlayabilir.
-   **Birden Fazla Örneği Bulabilme:** `Accumulator`'deki birden fazla tepeyi bularak, aynı anda `image`'deki birden fazla `line` veya `circle`'ı tespit edebilir.
-   **Paralelleştirilebilirlik:** Her `pixel`'in oylama işlemi birbirinden bağımsızdır, bu da algoritmayı paralelleştirmeye uygun hale getirir.

**Eksileri (Cons):**
-   **Hesaplama ve Bellek Maliyeti:** `Parameter space`'in boyutu, modeldeki parametre sayısıyla üssel olarak artar. Örneğin, `line` için 2D olan `accumulator`, keyfi bir şeklin konumu, yönelimi ve ölçeği için 4D veya daha fazla olabilir, bu da çok yüksek bellek ve işlem gücü gerektirir.
-   **Parametre Hassasiyeti (`Quantization`):** `Accumulator`'deki `grid` (hücre) boyutunun seçimi kritiktir. Çok büyük (`coarse`) hücreler hassasiyeti düşürürken, çok küçük (`fine`) hücreler `noise` nedeniyle oyların dağılmasına ve tepelerin kaybolmasına neden olabilir.
-   **Sahte Tepeler (Spurious Peaks):** Özellikle karmaşık `image`'lerde, ilgisiz `pixel`'lerin tesadüfen aynı hücreye oy vermesiyle yanıltıcı tepeler oluşabilir.

---

## Özet ve Anahtar Kavramlar

-   **Çemberler için Hough:** `Parameter space` 3 boyutludur (`x merkez`, `y merkez`, `yarıçap`). Görüntüdeki bir nokta, Hough uzayında bir **koni** oluşturur.
-   **Gradient Bilgisini Kullanma (Çember):** Kenar `pixel`'inin `gradient` yönü, çemberin merkezine doğru bir çizgi üzerinde olduğunu gösterir. Bu, 3D uzayda tam bir koni için oy vermek yerine, bu çizgi üzerinde oy vererek aramayı 2D'ye indirir ve süreci hızlandırır.
-   **Generalized Hough Transform (GHT):** Analitik denklemi olmayan keyfi şekilleri bulmak için kullanılır.
-   **R-Table:** GHT'nin "eğitim" aşamasında, şablon şeklinin kenar `pixel`'lerinin bir referans noktasına göre göreceli konumlarını saklayan bir `look-up table`'ıdır. Bu tablo, "tespit" aşamasında oylama için kullanılır.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Çember tespiti için Hough Transform kullanılırken, kenar piksellerinin gradyan yönü bilgisi neden çok önemlidir?</p>
  <div class="quiz-option">A) Görüntüyü renkliden siyaha çevirmek için gereklidir.</div>
  <div class="quiz-option" data-correct="true">B) Arama uzayını 2D'den 1D'ye indirerek (her piksel için) oylama işlemini büyük ölçüde hızlandırır.</div>
  <div class="quiz-option">C) Sadece tam çemberleri değil, elipsleri de bulmayı sağlar.</div>
  <div class="quiz-option">D) Accumulator matrisinin boyutunu küçültür.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Gradyan, çemberin merkezine doğru yönelmiş bir vektör verir. Gradyan yönü olmadan, bir kenar pikseli, kendisinden `r` kadar uzaktaki tüm olası merkez adayları için (yani 3D parametre uzayında bir koni yüzeyi üzerinde) oy kullanmak zorundadır. Gradyan yönünü bildiğimizde ise, merkez adayı bu yön üzerinde `r` kadar uzakta olmalıdır. Bu, her piksel için arama problemini bir yüzeyden bir çizgiye indirir ve hesaplama maliyetini dramatik şekilde azaltır.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Generalized Hough Transform'da (GHT) kullanılan R-Tablosu'nun içeriği nedir?</p>
  <div class="quiz-option">A) Görüntüdeki tüm piksellerin renk değerleri.</div>
  <div class="quiz-option">B) Görüntünün Fourier dönüşümü katsayıları.</div>
  <div class="quiz-option" data-correct="true">C) Şablon görüntüdeki her gradyan yönü için, kenar piksellerinden referans noktasına giden vektörlerin bir listesi.</div>
  <div class="quiz-option">D) Tespit edilecek nesnenin olası tüm konumları ve ölçekleri.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> R-Tablosu, bir şablon görüntüden önceden hesaplanan bir arama tablosudur. Tablonun her bir girişi, belirli bir gradyan yönüne (`φ`) karşılık gelir. Bu girişin içeriği, şablonda o gradyan yönüne sahip tüm kenar piksellerinden, önceden belirlenmiş bir referans noktasına (genellikle nesnenin merkezi) giden `(r, α)` vektörlerinin bir listesidir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Generalized Hough Transform (GHT), standart Hough Transform'a göre neden daha esnektir?</p>
  <div class="quiz-option">A) Çok daha hızlı çalıştığı için.</div>
  <div class="quiz-option">B) Daha az bellek kullandığı için.</div>
  <div class="quiz-option" data-correct="true">C) Analitik bir denklemi olmayan keyfi şekilleri de tespit edebildiği için.</div>
  <div class="quiz-option">D) Sadece renkli görüntülerde çalıştığı için.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Standart Hough Transform, çizgiler (`y = mx + b`) veya çemberler (`(x-a)² + (y-b)² = r²`) gibi analitik olarak ifade edilebilen şekillerle sınırlıdır. GHT ise bir R-Tablosu kullanarak şekli temsil eder. Bu, denklemi olmayan herhangi bir keyfi şeklin (örneğin, bir el, bir araba silüeti) bir şablon aracılığıyla tespit edilmesine olanak tanır, bu da onu çok daha esnek ve genel amaçlı hale getirir.</p>
  </div>
</div>