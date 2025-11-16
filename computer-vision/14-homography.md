---
layout: default
title: Homography ve 2D Görüntü Dönüşümleri
nav_order: 14
parent: Computer Vision
---

# Homography ve 2D Görüntü Dönüşümleri

**Homography**, iki görüntü düzlemi arasındaki geometrik ilişkiyi tanımlayan 3x3'lük sihirli bir matristir. Bu ilişki, temelde iki ana senaryoda ortaya çıkar:
1.  **Kamera Dönmesi:** Kamera, optik merkezini değiştirmeden kendi etrafında döndüğünde (panorama çekimleri gibi).
2.  **Düzlemsel Yüzey:** Kamera, dünyadaki düz bir yüzeye (bir binanın cephesi, yerdeki bir desen, bir kitap kapağı) baktığında.

Bu matris sayesinde bir görüntüdeki piksellerin diğer görüntüdeki karşılık gelen konumlarını bulabiliriz. Bu işlem, bir görüntüyü diğerinin perspektifine "eğip bükerek" (image warping) gerçekleştirilir. Bu dönüşümlerin temelini oluşturan daha basit geometrik operasyonları anlamak, Homography'nin gücünü kavramamıza yardımcı olur.

---

## 1. 2D Dönüşüm Hiyerarşisi

Daha kısıtlıdan daha genele doğru sıralanan bir 2D dönüşüm hiyerarşisi vardır. Her dönüşüm, bir öncekinin tüm özelliklerini içerir ve üzerine yeni yetenekler (serbestlik dereceleri) ekler.

Tüm dönüşümler, bir `p' = H * p` matris çarpımıyla ifade edilir, burada `p` ve `p'` homojen koordinatlardaki orijinal ve dönüştürülmüş noktalardır, `H` ise dönüşüm matrisidir.

### a) Translation (Öteleme)
Sadece nesnenin konumunu `(x, y)` yönünde kaydırır. Şekil, boyut veya yönelim değişmez.
*   **Serbestlik Derecesi:** 2 (`tx`, `ty`)
*   **Korunanlar:** Uzunluk, alan, açılar, paralellik.
*   **Matris:**
    ```
    [ 1  0  tx ]
    [ 0  1  ty ]
    [ 0  0  1  ]
    ```

### b) Euclidean (Rigidbody / Katı Cisim)
Ötelemeye ek olarak **döndürmeye (rotation)** de izin verir. Nesneyi bükmeden veya esnetmeden hareket ettirir.
*   **Serbestlik Derecesi:** 3 (`tx`, `ty`, `θ`)
*   **Korunanlar:** Uzunluk, alan, açılar, paralellik.
*   **Matris:**
    ```
    [ cosθ  -sinθ  tx ]
    [ sinθ   cosθ  ty ]
    [ 0      0     1  ]
    ```

### c) Similarity (Benzerlik)
Döndürme ve ötelemeye ek olarak **tek tip ölçeklemeye (uniform scaling)** de izin verir. Nesnenin şeklini (açılarını) korur ama boyutunu değiştirebilir.
*   **Serbestlik Derecesi:** 4 (`tx`, `ty`, `θ`, `s`)
*   **Korunanlar:** Açılar, paralellik, uzunlukların ve alanların oranı.
*   **Matris:**
    ```
    [ s*cosθ  -s*sinθ  tx ]
    [ s*sinθ   s*cosθ  ty ]
    [ 0        0       1  ]
    ```

### d) Affine
Önceki dönüşümlere ek olarak **farklı yönlerde farklı ölçekleme** ve **eğme (shear)** işlemlerine izin verir. Bir kareyi herhangi bir paralelkenara dönüştürebilir.
*   **Serbestlik Derecesi:** 6 (matristeki `a, b, c, d, tx, ty`)
*   **Korunanlar:** Paralel çizgiler, alanların oranı.
*   **Matris:**
    ```
    [ a  b  tx ]
    [ c  d  ty ]
    [ 0  0  1  ]
    ```

### e) Projective (Homography)
En genel 2D doğrusal dönüşümdür. Bir kareyi **herhangi bir dışbükey dörtgene** dönüştürebilir. Paralel çizgilerin artık paralel kalmak zorunda olmadığı, ufuk noktasında birleşebileceği perspektif etkilerini modeller.
*   **Serbestlik Derecesi:** 8 (matrisin genel ölçeği önemsiz olduğu için)
*   **Korunanlar:** Sadece düz çizgilerin düz kalması (collinearity).
*   **Matris:**
    ```
    [ a  b  c ]
    [ d  e  f ]
    [ g  h  1 ]
    ```

<pre>
Dönüşüm Hiyerarşisi ve Eklenen Serbestlik:
Translation (Öteleme)
     |
     +--> Euclidean (Döndürme eklenir)
             |
             +--> Similarity (Tek tip ölçekleme eklenir)
                     |
                     +--> Affine (Farklı ölçekleme ve eğme eklenir)
                             |
                             +--> Projective (Homography) (Perspektif eklenir)
</pre>

---

## 2. Homography Matrisini Bulmak

Bir homography matrisi `H`, 8 serbestlik derecesine sahiptir (matrisin genel ölçeği önemli olmadığı için 9 elemandan biri genellikle 1'e sabitlenir). Bu 8 bilinmeyeni çözmek için, iki görüntü arasında en az **4 adet eşleşen noktaya (point correspondence)** ihtiyaç duyarız.

Neden 4 nokta?
*   Her bir `p(x, y)` ve `p'(x', y')` nokta eşleşmesi, bize `x'` ve `y'` için olmak üzere **iki lineer denklem** verir.
*   Toplam 8 bilinmeyeni (`a, b, c, d, e, f, g, h`) çözmek için `4 nokta × 2 denklem/nokta = 8 denklem` gerekir.
*   Bu 8 denklem, bir lineer denklem sistemi oluşturur ve bu sistem çözülerek `H` matrisinin elemanları bulunur.

<div class="quiz-question">
  <p><b>Soru:</b> Paralel çizgilerin paralel kalmasını garantileyen, ancak açıları ve uzunlukları korumak zorunda olmayan en genel 2D dönüşüm hangisidir?</p>
  <div class="quiz-option">A) Euclidean</div>
  <div class="quiz-option">B) Similarity</div>
  <div class="quiz-option" data-correct="true">C) Affine</div>
  <div class="quiz-option">D) Projective (Homography)</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Affine dönüşüm, paralel çizgileri koruma özelliğine sahiptir. Projective (Homography) dönüşüm ise bu kuralı bozar; paralel çizgiler bir ufuk noktasında birleşebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir `Affine` dönüşüm matrisinin 6 serbestlik derecesi (6 bilinmeyeni) vardır. Bu matrisi tek bir çözüme sahip olacak şekilde hesaplamak için en az kaç tane eşleşen noktaya ihtiyaç vardır?</p>
  <div class="quiz-option">A) 2</div>
  <div class="quiz-option" data-correct="true">B) 3</div>
  <div class="quiz-option">C) 4</div>
  <div class="quiz-option">D) 6</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Her bir nokta eşleşmesi 2 denklem sağladığı için, 6 bilinmeyeni çözmek üzere en az 3 nokta eşleşmesine ihtiyaç duyarız (3 nokta x 2 denklem/nokta = 6 denklem).</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> İki farklı görüntü arasında bir Homography matrisini (`H`) hesaplamak için en az kaç tane eşleşen noktaya ihtiyaç vardır?</p>
  <div class="quiz-option">A) 2</div>
  <div class="quiz-option">B) 3</div>
  <div class="quiz-option" data-correct="true">C) 4</div>
  <div class="quiz-option">D) 8</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bir Homography matrisi 8 serbestlik derecesine sahiptir. Her bir nokta eşleşmesi 2 denklem sağladığı için, bu 8 bilinmeyeni çözmek üzere en az 4 nokta eşleşmesine ihtiyaç duyarız (4 nokta x 2 denklem/nokta = 8 denklem).</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Bir `Similarity` (Benzerlik) dönüşümü uygulandıktan sonra, orijinal şekildeki bir karenin hangi özelliği kesinlikle korunmaz?</p>
  <div class="quiz-option">A) Kenarlarının birbirine dik olması (Açılar).</div>
  <div class="quiz-option" data-correct="true">B) Kenar uzunlukları.</div>
  <div class="quiz-option">C) Karşılıklı kenarlarının paralel olması.</div>
  <div class="quiz-option">D) Şeklin hala bir kare olması.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Similarity dönüşümü, `uniform scaling` (tek tip ölçekleme) içerir. Bu, şeklin boyutunu büyütebilir veya küçültebilir, dolayısıyla kenar uzunlukları korunmaz. Ancak açılar korunduğu için şekil hala bir kare olarak kalır.</p>
  </div>
</div>

---

## 3. Homography Uygulamaları

### a) Panorama Stitching (Görüntü Birleştirme)
Eğer aynı optik merkezden, sadece kamerayı döndürerek birden fazla fotoğraf çekerseniz, bu görüntüler arasındaki ilişki bir homography ile tanımlanır. Bu süreç, **image warping** (görüntü eğme/bükme) olarak adlandırılır:
1.  İki görüntü arasında SIFT gibi yöntemlerle en az 4 eşleşen nokta bulunur.
2.  Bu noktalardan `H` homography matrisi hesaplanır.
3.  Görüntülerden biri, `H` matrisi kullanılarak diğerinin koordinat sistemine "warp" edilir (pikselleri yeniden konumlandırılır).
4.  İki görüntü birleştirilerek (blending) panoramik bir fotoğraf oluşturulur.

### b) Image Rectification (Perspektif Düzeltme)
Bir düzleme (örneğin bir bina cephesi, bir masa yüzeyi) açılı bakıldığında oluşan perspektif bozulmasını düzeltmek için kullanılır.
1.  Görüntüdeki düzlemin 4 köşe noktası manuel olarak veya otomatik olarak seçilir. Bu noktalar yamuk bir dörtgen oluşturur.
2.  Hedef olarak, istenen "karşıdan görünüm" için bir dikdörtgenin 4 köşe noktası tanımlanır (örn: (0,0), (genislik,0), (genislik,yukseklik), (0,yukseklik)).
3.  Bu iki dörtgenin köşeleri arasında bir homography matrisi hesaplanır.
4.  Orijinal görüntü bu matrisle "warp" edilerek, sanki tam karşıdan bakılıyormuş gibi düzeltilmiş bir görüntü elde edilir.

<div class="quiz-question">
  <p><b>Soru:</b> Yandan çekilmiş bir fotoğraf nedeniyle yamuk görünen dikdörtgen bir tablonun görüntüsünü, tam karşıdan çekilmiş gibi düz bir dikdörtgen haline getirmek için hangi uygulama kullanılır?</p>
  <div class="quiz-option">A) Panorama Stitching</div>
  <div class="quiz-option">B) Euclidean Dönüşüm</div>
  <div class="quiz-option" data-correct="true">C) Image Rectification (Perspektif Düzeltme)</div>
  <div class="quiz-option">D) Affine Dönüşüm</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Bu işlem, perspektif bozulmasını geri almak için bir Homography matrisi kullanır. Görüntüdeki yamuk (herhangi bir dörtgen) olan tablonun köşeleri, hedefteki bir dikdörtgenin köşelerine eşlenir ve görüntü bu eşlemeye göre "düzeltilir".</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru:</b> Aşağıdaki durumlardan hangisinde iki görüntü arasındaki ilişkiyi bir Homography matrisi ile modellemek <b>uygun olmaz</b>?</p>
  <div class="quiz-option">A) Drone ile bir binanın çatısının tam tepeden çekilmiş iki farklı fotoğrafı.</div>
  <div class="quiz-option" data-correct="true">B) Yolda yürürken, kamerayı hiç döndürmeden, sadece yana doğru bir adım atarak çekilmiş iki fotoğraf.</div>
  <div class="quiz-option">C) Tripod üzerine sabitlenmiş bir kamerayı sağa doğru döndürerek çekilmiş iki fotoğraf.</div>
  <div class="quiz-option">D) Bir masanın üzerindeki bir kağıdın farklı açılardan çekilmiş iki fotoğrafı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Kamera yana doğru hareket ettiğinde (translation), optik merkezi değişir. Bu durumda, 3D sahnedeki derinlik farklılıkları nedeniyle **paralaks** etkisi oluşur ve sahne tek bir homography ile doğru bir şekilde eşlenemez. Diğer tüm seçenekler ya düz bir yüzeyi (A, D) ya da aynı optik merkezden dönüşü (C) içerir, bu yüzden Homography için uygundur.</p>
  </div>
</div>

---

