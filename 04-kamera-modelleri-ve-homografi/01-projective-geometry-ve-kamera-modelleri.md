---
layout: default
title: Projective Geometry ve Kamera Modelleri
parent: 4. Kamera Modelleri ve Homografi
nav_order: 1
---

# Projective Geometry ve Kamera Modelleri

`Image`'lerin nasıl oluştuğunu anlamak, 3D dünyayı 2D `image`'lere yansıtan geometrik süreci anlamakla başlar. Bu süreç **Projective Geometry** ile açıklanır ve en temel `camera` modeli olan **pinhole camera** ile basitleştirilir.

## Adım 1 – Pinhole Camera Modelini Anla

En basit `camera` modeli, ışık geçirmez bir kutunun bir yüzündeki iğne deliğinden (`pinhole`) ışığın geçerek karşı yüzeye (görüntü düzlemi - `image plane`) ters bir `image` oluşturduğu **pinhole camera** modelidir.

- **Center of Projection (COP):** Işınların geçtiği iğne deliği, `projection`'ın merkezidir ve genellikle koordinat sisteminin orijinine `(0, 0, 0)` yerleştirilir.
- **Image Plane:** `Image`'in oluştuğu düzlemdir. Matematiksel kolaylık sağlaması için genellikle `COP`'nin önüne, `z = d` gibi bir mesafeye yerleştirilir. `d` mesafesi, `focal length` (`f`) olarak da adlandırılır.

**Perspective Projection:**
3D dünyadaki bir `P = (X, Y, Z)` noktasının, `image plane` üzerindeki `p = (x, y)` noktasına yansıması, benzer üçgenler kullanılarak formüle edilir:

`x = d * (X / Z)`
`y = d * (Y / Z)`

Bu denklemler, `perspective projection`'ın temelini oluşturur. Önemli bir özelliği, bir nesnenin `image`'deki boyutunun, `camera`'ya olan uzaklığı (`Z`) ile ters orantılı olmasıdır. Yani, uzaktaki nesneler küçük görünür.

## Adım 2 – Homogeneous Coordinates (Homojen Koordinatlar)

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

## Adım 3 – Vanishing Points (Ufuk Noktaları)

`Projective geometry`'nin ilginç bir sonucu, 3D dünyada birbirine paralel olan çizgilerin `image`'de tek bir noktada kesişiyormuş gibi görünmesidir. Bu kesişim noktasına **vanishing point** denir.

- Her bir yön (`direction`) için farklı bir `vanishing point` vardır.
- Aynı düzlem üzerindeki (örneğin, yer düzlemi) paralel çizgilerin `vanishing point`'leri, `image`'de **horizon line** (ufuk çizgisi) adı verilen bir doğru üzerinde yer alır.

`Vanishing point`'ler, `image`'lerden 3D yapı hakkında bilgi çıkarmak (örneğin, kamera yönelimi, nesne boyutları) ve `image`'lerin perspektifini analiz etmek için kullanılır.

## Adım 4 – Diğer Camera Modelleri

- **Orthographic Projection:** `Camera`'nın nesneden sonsuz uzakta olduğu varsayılan özel bir durumdur. Işınlar `COP`'de kesişmek yerine birbirine paralel olarak gelir. Bu modelde `Z`'ye bölme (derinlik etkisi) yoktur, `(X, Y, Z)` doğrudan `(X, Y)`'ye yansıtılır. `Perspective` bozulma olmaz. Genellikle mühendislik çizimleri veya haritalar için kullanılır.
- **Weak Perspective Projection:** `Perspective projection`'a bir yaklaşımdır. Bir grup nesnenin yaklaşık olarak aynı derinlikte (`Z`) olduğu varsayılır. Bu durumda `Z`, sabit bir değer gibi davranır ve `projection` basit bir ölçekleme (`scaling`) haline gelir: `(x, y) = (s*X, s*Y)`.
