---
layout: default
title: Projective Geometry ve Camera Models
parent: 4. Camera Models ve Homography
nav_order: 1
---

# Projective Geometry ve Camera Models

`Image`'lerin nasıl oluştuğunu anlamak, 3D dünyayı 2D `image`'lere yansıtan geometrik süreci anlamakla başlar. Bu süreç **Projective Geometry** ile açıklanır ve en temel `camera` modeli olan **pinhole camera** ile basitleştirilir.

## Pinhole Camera Modeli

En basit `camera` modeli, ışık geçirmez bir kutunun bir yüzündeki iğne deliğinden (`pinhole`) ışığın geçerek karşı yüzeye (görüntü düzlemi - `image plane`) ters bir `image` oluşturduğu **pinhole camera** modelidir.

- **Center of Projection (COP):** Işınların geçtiği iğne deliği, `projection`'ın merkezidir ve genellikle koordinat sisteminin orijinine `(0, 0, 0)` yerleştirilir.
- **Image Plane:** `Image`'in oluştuğu düzlemdir. Matematiksel kolaylık sağlaması için genellikle `COP`'nin önüne, `z = d` gibi bir mesafeye yerleştirilir. `d` mesafesi, `focal length` (`f`) olarak da adlandırılır.

**Perspective Projection:**
3D dünyadaki bir `P = (X, Y, Z)` noktasının, `image plane` üzerindeki `p = (x, y)` noktasına yansıması, benzer üçgenler kullanılarak formüle edilir:

`x = d * (X / Z)`
`y = d * (Y / Z)`

Bu denklemler, `perspective projection`'ın temelini oluşturur. Önemli bir özelliği, bir nesnenin `image`'deki boyutunun, `camera`'ya olan uzaklığı (`Z`) ile ters orantılı olmasıdır. Yani, uzaktaki nesneler küçük görünür.

`pinhole`'a olan uzaklığı `z` ve `pinhole` ile `image plane` arasındaki uzaklık (yani `focal length`) `f` ise, benzer üçgenlerden şu ilişkiyi kurabiliriz:

`y' = -f * y / z`

Buradaki eksi işareti, `image`'in `pinhole` modelinde ters dönmesinden kaynaklanır. Pratikte bu eksi işareti genellikle göz ardı edilir ve `image`'in sanal olarak `pinhole`'un önünde oluştuğu varsayılır.

![Pinhole Camera Model](https://placehold.co/600x350/EEE/31343C?text=Pinhole+Kamera+Modeli+ve+Benzer+Üçgenler)
*<center>Pinhole kamera modeli, 3D dünyayı 2D görüntü düzlemine yansıtmak için benzer üçgenler prensibini kullanır.</center>*

## Homogeneous Coordinates (Homojen Koordinatlar)

`Perspective projection` denklemlerindeki `Z`'ye bölme işlemi, dönüşümü **non-linear** (doğrusal olmayan) yapar. Bu, matris çarpımlarıyla ifade etmeyi zorlaştırır. Bu sorunu çözmek için **homogeneous coordinates** kullanılır.

- 2D bir nokta `(x, y)`, `(x, y, 1)` şeklinde bir 3D vektörle temsil edilir.
- 3D bir nokta `(X, Y, Z)`, `(X, Y, Z, 1)` şeklinde bir 4D vektörle temsil edilir.

Bu sistemde, bir vektörün skaler katları aynı noktayı temsil eder (örneğin, `(x, y, w)` noktası, `(x/w, y/w)` kartezyen noktasına eşittir).

`Homogeneous coordinates` kullanarak, `perspective projection` işlemi tek bir matris çarpımıyla ifade edilebilir:

\[
\begin{bmatrix}
x \\
y \\
w
\end{bmatrix}
=
\begin{bmatrix}
d & 0 & 0 & 0 \\
0 & d & 0 & 0 \\
0 & 0 & 1 & 0
\end{bmatrix}
\begin{bmatrix}
X \\
Y \\
Z \\
1
\end{bmatrix}
\]

Bu matris çarpımı sonucunda `(dX, dY, Z)` elde edilir. Bunu kartezyen koordinatlara çevirmek için ilk iki bileşeni üçüncüye böleriz ve `(dX/Z, dY/Z)` `image` koordinatlarını buluruz.

Bu sayede, `projective geometry`'nin güçlü matematiksel araçlarını kullanarak `translation` (öteleme) gibi `non-linear` dönüşümleri bile matris çarpımıyla ifade edebilir hale geliriz.

![Homogeneous Coordinates Intuition](https://placehold.co/700x400/EEE/31343C?text=2D+Nokta+->+3D+Işın+|+Sonsuzdaki+Noktalar)
*<center>Homojen koordinatlar, 2D'deki bir noktayı 3D'de orijinden geçen bir ışın olarak temsil eder. Sonsuzdaki noktalar ise xy-düzlemine paralel (w=0) ışınlara karşılık gelir.</center>*

## Vanishing Points (Ufuk Noktaları)

`Projective geometry`'nin ilginç bir sonucu, 3D dünyada birbirine paralel olan çizgilerin `image`'de tek bir noktada kesişiyormuş gibi görünmesidir. Bu kesişim noktasına **vanishing point** denir.

- Her bir yön (`direction`) için farklı bir `vanishing point` vardır.
- Aynı düzlem üzerindeki (örneğin, yer düzlemi) paralel çizgilerin `vanishing point`'leri, `image`'de **horizon line** (ufuk çizgisi) adı verilen bir doğru üzerinde yer alır.

Paralel çizgilerin `image` üzerinde birleştiği bu noktalara **vanishing point (ufuk noktası)** denir.
- **`Vanishing Point`'lerin Kümesi:** 3D uzaydaki bir düzlem üzerindeki (örneğin yer düzlemi) tüm `line`'ların `vanishing point`'leri, `image` üzerinde **vanishing line (ufuk çizgisi)** adı verilen bir `line` oluşturur.

![Vanishing Point and Line](https://placehold.co/500x350/EEE/31343C?text=Paralel+Çizgiler+Ufuk+Noktasında+Kesişir)
*<center>Tren rayları gibi paralel çizgiler, görüntüde ufuk noktasında (vanishing point) birleşir. Yer düzlemindeki tüm ufuk noktaları, ufuk çizgisini (vanishing line) oluşturur.</center>*

`Projective geometry`, bu tür `image` ipuçlarını kullanarak 3D sahne geometrisi hakkında çıkarımlar yapmamızı sağlar.

## Diğer Camera Modelleri

- **Orthographic Projection:** `Camera`'nın nesneden sonsuz uzakta olduğu varsayılan özel bir durumdur. Işınlar `COP`'de kesişmek yerine birbirine paralel olarak gelir. Bu modelde `Z`'ye bölme (derinlik etkisi) yoktur, `(X, Y, Z)` doğrudan `(X, Y)`'ye yansıtılır. `Perspective` bozulma olmaz. Genellikle mühendislik çizimleri veya haritalar için kullanılır.
- **Weak Perspective Projection:** `Perspective projection`'a bir yaklaşımdır. Bir grup nesnenin yaklaşık olarak aynı derinlikte (`Z`) olduğu varsayılır. Bu durumda `Z`, sabit bir değer gibi davranır ve `projection` basit bir ölçekleme (`scaling`) haline gelir: `(x, y) = (s*X, s*Y)`.

---

## Özet ve Anahtar Kavramlar

-   **Projective Geometry:** Paralel çizgilerin sonsuzda kesiştiği ve geometrik dönüşümlerin matrislerle ifade edildiği bir geometri dalıdır.
-   **Pinhole Camera Model:** 3D dünyayı 2D bir görüntüye yansıtan en basit kamera modelidir.
-   **Homogeneous Coordinates:** 2D bir noktayı `(x, y)` -> `(x, y, 1)` gibi ekstra bir koordinat ekleyerek temsil etme yöntemidir. Bu sayede öteleme gibi işlemler de matris çarpımıyla yapılabilir ve sonsuzdaki noktalar temsil edilebilir.
-   **Vanishing Point (Ufuk Noktası):** 3D uzayda paralel olan çizgilerin görüntü düzleminde kesiştiği gibi göründüğü noktadır.
-   **Vanishing Line (Ufuk Çizgisi):** 3D uzaydaki bir düzlem üzerindeki tüm çizgilerin ufuk noktalarının birleşerek oluşturduğu çizgidir.

---

## Kavrama Soruları

<div class="quiz-question">
  <p><b>Soru 1:</b> Geometrik dönüşümlerde homojen koordinat sistemini kullanmanın en temel avantajı nedir?</p>
  <div class="quiz-option">A) 3D noktaları 2D'de göstermeyi sağlaması.</div>
  <div class="quiz-option" data-correct="true">B) Öteleme (translation) dahil tüm afin ve projektif dönüşümlerin tek bir matris çarpımı ile ifade edilmesini sağlaması.</div>
  <div class="quiz-option">C) Sadece rotasyon ve ölçekleme işlemlerini hızlandırması.</div>
  <div class="quiz-option">D) Koordinatları tam sayılarla temsil ederek bellekten tasarruf etmesi.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: B.</b> Standart Kartezyen koordinatlarda, öteleme bir vektör toplaması iken, rotasyon ve ölçekleme matris çarpımıdır. Bu durum, dönüşümleri birleştirmeyi karmaşıklaştırır. Homojen koordinatlar, fazladan bir boyut ekleyerek ötelemeyi de bir matris çarpımı olarak formüle etmemize olanak tanır. Böylece tüm dönüşüm serileri tek bir matriste birleştirilebilir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 2:</b> Bir fotoğraftaki "ufuk çizgisi" (horizon line) neyi temsil eder?</p>
  <div class="quiz-option" data-correct="true">A) Kamera odak düzlemine paralel olan sonsuzdaki düzlemin (plane at infinity) görüntüdeki izdüşümünü.</div>
  <div class="quiz-option">B) Görüntünün tam ortasından geçen yatay çizgiyi.</div>
  <div class="quiz-option">C) Görüntüdeki en uzakta olan nesnenin konumunu.</div>
  <div class="quiz-option">D) Kameranın optik ekseninin yere değdiği noktayı.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: A.</b> 3D dünyada birbirine paralel olan tüm düzlemler (örneğin, yer düzlemi, binaların katları) sonsuzda kesişir. Bu "sonsuzdaki düzlemin" kamera tarafından görülen kısmı, görüntüde bir çizgi olarak belirir. Bu çizgiye ufuk çizgisi denir ve dünyadaki paralel çizgilerin izdüşümleri bu çizgi üzerindeki ufuk noktalarında birleşir.</p>
  </div>
</div>

<div class="quiz-question">
  <p><b>Soru 3:</b> Bir pinhole kameranın `focal length` (odak uzaklığı) değerini artırırsak ne olur?</p>
  <div class="quiz-option">A) Görüntü daha geniş bir açıyı görür (field of view artar).</div>
  <div class="quiz-option">B) Görüntü daha karanlık olur.</div>
  <div class="quiz-option" data-correct="true">C) Görüntüdeki nesneler büyür (zoom in etkisi).</div>
  <div class="quiz-option">D) Görüntüde geometrik bozulma (distortion) artar.</div>
  <div class="quiz-explanation">
    <p><b>Cevap: C.</b> Pinhole kamera projeksiyon denklemlerine (`y' = -f * Y / Z`) göre, görüntü düzlemindeki bir noktanın konumu (`y'`), odak uzaklığı (`f`) ile doğru orantılıdır. `f`'yi artırmak, `y'` değerini de artırır, bu da nesnelerin görüntüde daha büyük görünmesine neden olur. Bu, optik zoom yapmaya eşdeğer bir etkidir.</p>
  </div>
</div>
